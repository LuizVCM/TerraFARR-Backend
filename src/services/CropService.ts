import { InternalServerError } from "../errors/InternalServerError";
import { NotFoundError } from "../errors/NotFoundError";
import { CropMapper } from "../mappers/CropMapper";
import { Crop, CropStatus } from "../models/Crop";
import { Seed } from "../models/Seed";
import { CropRepository } from "../repositories/CropRepository";
import { SeedRepository } from "../repositories/SeedRepository";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CreateCropDTO, UpdateCropDTO } from "../schemas/crop.schema";
import { dataFilter } from "../utils/data-filter";
import { formateDateToString, setHarvestForecast } from "../utils/date-utils";
import { AuthorizationService } from "./AuthorizationService";

export class CropService {
  private repo = new CropRepository();
  private userRepo = new UserRepository();
  private territoryRepo = new TerritoryRepository();
  private seedRepo = new SeedRepository();

  async listAll() {
    const crops = await this.repo.findAllWithRelations();
    return CropMapper.toResponseList(crops);
  }
  async getById(id: number, loggedUserId: number) {
    const crop = await this.repo.findByIdWithRelations(id);
    if (!crop) {
      throw new NotFoundError("plantação");
    }
    AuthorizationService.ensureRelationActive(
      crop.territorio,
      "plantação",
      "território"
    );
    AuthorizationService.ensureOwnership(
      crop.territorio,
      loggedUserId,
      "plantação"
    );
    return CropMapper.toResponse(crop);
  }
  async listByUserLogged(userId: number) {
    const crops = await this.repo.findAllByUserId(userId);
    return CropMapper.toResponseList(crops);
  }
  async listByTerritoryId(territoryId: number, loggedUserId: number) {
    const territory = await this.territoryRepo.findByIdWithRelations(
      territoryId
    );
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const crops = await this.repo.findByTerritoryId(territoryId);
    return CropMapper.toResponseList(crops);
  }
  async create(data: CreateCropDTO, territoryId: number, loggedUserId: number) {
    const user = await this.userRepo.base.findById(loggedUserId);
    if (!user) {
      throw new InternalServerError("Ocorreu um erro inesperado");
    }
    const territory = await this.territoryRepo.findByIdWithUser(territoryId);
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureRelationActive(
      territory,
      "plantação",
      "território"
    );
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const seed = await this.seedRepo.findByIdWithRelations(data.sementeId);
    if (!seed) {
      throw new NotFoundError("cultura");
    }
    AuthorizationService.ensureRelationActive(seed, "plantação", "semente");
    AuthorizationService.ensureOwnership(seed, loggedUserId, "semente");
    const cropData = CropMapper.toCreateEntity(data, seed.planta);
    const crop = await this.repo.create(cropData, territory, seed);
    return CropMapper.toResponse(crop);
  }
  async update(id: number, data: UpdateCropDTO, loggedUserId: number) {
    const crop = await this.repo.findByIdWithRelations(id);
    if (!crop) {
      throw new NotFoundError("plantação");
    }

    AuthorizationService.ensureRelationActive(
      crop.territorio,
      "plantação",
      "território"
    );
    AuthorizationService.ensureOwnership(
      crop.territorio,
      loggedUserId,
      "território"
    );

    // se vai trocar de semente
    const trocandoSemente =
      data.sementeId !== undefined && data.sementeId !== crop.sementes?.id;

    // valida e autoriza a nova semente antes de qualquer alteração
    let novaSeed: Seed | null = null;
    if (trocandoSemente) {
      novaSeed = await this.seedRepo.findByIdWithRelations(data.sementeId!);
      if (!novaSeed) {
        throw new NotFoundError("semente");
      }
      AuthorizationService.ensureRelationActive(
        novaSeed,
        "plantação",
        "semente"
      );
      AuthorizationService.ensureOwnership(novaSeed, loggedUserId, "semente");
    }

    const cancelando =
      data.status === CropStatus.CANCELADA &&
      crop.status !== CropStatus.CANCELADA;

    return await this.repo.base
      .getRepository()
      .manager.transaction(async (manager) => {
        const seedRepo = manager.getRepository(Seed);
        const cropRepo = manager.getRepository(Crop);

        // desvincula a semente / cultura antiga
        if ((trocandoSemente || cancelando) && crop.sementes) {
          await seedRepo.save({ id: crop.sementes.id, plantacao: null });
        }

        // vincula a nova semente / cultura
        if (trocandoSemente && novaSeed) {
          await seedRepo.save({ id: novaSeed.id, plantacao: crop });
          crop.sementes = novaSeed;
        }

        if (cancelando) {
          crop.sementes = null;
        }

        if (data.dataPlantio) {
          const seedParaCalculo = novaSeed ?? crop.sementes;
          if (!seedParaCalculo?.planta) {
            throw new InternalServerError("Plantação sem semente associada");
          }
          const novaDataPlantio = new Date(data.dataPlantio);
          const cicloMedio = seedParaCalculo.planta.getCicloMedioDias();
          const novaPrevista = setHarvestForecast(novaDataPlantio, cicloMedio);
          crop.dataPlantio = formateDateToString(novaDataPlantio);
          crop.dataColheitaPrevista = formateDateToString(novaPrevista);
        } else if (data.dataPlantio === null) {
          crop.dataPlantio = null;
          crop.dataColheitaPrevista = null;
        } else if (trocandoSemente && crop.dataPlantio && novaSeed?.planta) {
          // se trocou a semente sem mandar nova data, recalcula previsão
          const cicloMedio = novaSeed.planta.getCicloMedioDias();
          const novaPrevista = setHarvestForecast(
            new Date(crop.dataPlantio),
            cicloMedio
          );
          crop.dataColheitaPrevista = formateDateToString(novaPrevista);
        }

        if (data.dataColheitaReal) {
          const colheitaReal = new Date(data.dataColheitaReal);
          crop.dataColheitaReal = formateDateToString(colheitaReal);
          if (new Date() >= colheitaReal) {
            crop.status = CropStatus.CONCLUIDA;
          }
        }

        const {
          dataPlantio,
          dataColheitaReal,
          dataColheitaPrevista,
          status,
          sementes,
          ...cropData
        } = CropMapper.toUpdateEntity(data);
        dataFilter(crop, cropData);

        const cropUpdated = await cropRepo.save(crop);
        return CropMapper.toSummaryResponse(cropUpdated);
      });
  }
  async delete(id: number, loggedUserId: number) {
    const crop = await this.repo.findByIdWithRelations(id);
    if (!crop) throw new NotFoundError("plantação");

    AuthorizationService.ensureRelationActive(
      crop.territorio,
      "plantação",
      "território"
    );
    AuthorizationService.ensureOwnership(
      crop.territorio,
      loggedUserId,
      "território"
    );

    return await this.repo.base
      .getRepository()
      .manager.transaction(async (manager) => {
        if (crop.sementes) {
          await manager
            .getRepository(Seed)
            .save({ id: crop.sementes.id, plantacao: null });
        }
        const result = await manager.softDelete(Crop, id);
        if (result.affected === 0)
          throw new InternalServerError("Não foi possível deletar");
        return result;
      });
  }
}