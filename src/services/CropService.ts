import { InternalServerError } from "../errors/InternalServerError";
import { NotFoundError } from "../errors/NotFoundError";
import { CropMapper } from "../mappers/CropMapper";
import { CropRepository } from "../repositories/CropRepository";
import { SeedRepository } from "../repositories/SeedRepository";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CreateCropDTO, UpdateCropDTO } from "../schemas/crop.schema";
import { dataFilter } from "../utils/data-filter";
import { setHarvestForecast } from "../utils/date-utils";
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
      "plantação"
    );
    if (data.dataPlantio) {
      const novaDataPlantio = new Date(data.dataPlantio);
      const cicloMedio = crop.sementes.planta.getCicloMedioDias();
      const novaPrevista = setHarvestForecast(novaDataPlantio, cicloMedio);
      crop.dataPlantio = novaDataPlantio;
      crop.dataColheitaPrevista = novaPrevista;
    } else if (data.dataPlantio === null) {
      // se o usuário removeu a data, limpa a previsão também
      crop.dataPlantio = null;
      crop.dataColheitaPrevista = null;
    }
    const cropData = CropMapper.toUpdateEntity(data);
    dataFilter(crop, cropData);
    const cropUpdated = await this.repo.base.save(crop);
    return CropMapper.toSummaryResponse(cropUpdated);
  }
  async delete(id: number, loggedUserId: number) {
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
    const result = await this.repo.base.softDelete(id);
    if (result.affected === 0) {
      throw new InternalServerError("Não foi possível deletar");
    }
    return result;
  }
}