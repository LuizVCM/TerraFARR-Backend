import { Plant } from "../models/Plant";
import { createBaseRepository } from "./BaseRepository";

export class PlantRepository {
  public base = createBaseRepository(Plant);
  async findExisting(scientificName: string) {
    const existing = await this.base.count({
      where: {
        nomeCientifico: scientificName,
      },
    });
    return existing > 0;
  }
  async findBySeedId(seedId: number) {
    return this.base.getRepository().findOne({
      where: { sementes: { id: seedId } },
      relations: {
        sementes: {
          planta: true,
        },
      },
    });
  }
  async findByUserId(userId: number) {
    return this.base.getRepository().find({
      where: { sementes: { usuario: { id: userId } } },
      relations: {
        sementes: {
          planta: true,
        },
      },
    });
  }
  async findByName(name: string) {
    return this.base.getRepository().findOne({ where: { nome: name } });
  }
}