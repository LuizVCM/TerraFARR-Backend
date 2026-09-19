import { Crop, CropStatus } from "../models/Crop";
import { Seed } from "../models/Seed";
import { Territory } from "../models/Territory";
import { AreaUnit } from "../calc/area-converter";
import { createBaseRepository } from "./BaseRepository";

interface CropData {
  nome: string;
  variedade: string | null | undefined;
  areaM2: number;
  unidadeArea: AreaUnit;
  dataPlantio: Date | null | undefined;
  responsavel: string | null | undefined;
  status: CropStatus;
  observacoes: string | null | undefined;
}

export class CropRepository {
  public base = createBaseRepository(Crop);
  async findAllWithRelations() {
    return this.base.findAll({
      relations: { territorio: { usuario: true }, sementes: { planta: true } },
    });
  }
  /** retorna o usuário */
  async findByTerritoryId(territoryId: number) {
    return this.base.getRepository().find({
      where: { territorio: { id: territoryId } },
      relations: { territorio: { usuario: true }, sementes: { planta: true } },
    });
  }
  /** retorna o usuário */
  async findByIdWithRelations(id: number) {
    return this.base.findById(id, {
      relations: { territorio: { usuario: true }, sementes: { planta: true } },
    });
  }
  /** retorna o usuário */
  async findAllByUserId(userId: number) {
    return this.base.findAll({
      where: { territorio: { usuario: { id: userId } } },
      relations: { territorio: { usuario: true }, sementes: { planta: true } },
    });
  }
  async create(data: CropData, territory: Territory, seed: Seed) {
    const crop = this.base.create({
      ...data,
      territorio: territory,
      sementes: seed,
    });
    return this.base.save(crop);
  }
}