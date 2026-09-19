import { Plant } from "../models/Plant";
import { Seed } from "../models/Seed";
import { User } from "../models/User";
import { CreateSeedDTO } from "../schemas/seed.schema";
import { createBaseRepository } from "./BaseRepository";

export class SeedRepository {
  public base = createBaseRepository(Seed);
  async findAllWithRelations() {
    return this.base.findAll({ relations: { usuario: true, planta: true } });
  }
  async findByIdWithRelations(id: number) {
    return this.base.findById(id, {
      relations: { usuario: true, planta: true, plantacao: true },
    });
  }
  async findByUserIdWithRelations(userId: number): Promise<Seed[]> {
    return this.base.findAll({
      where: { usuario: { id: userId } },
      relations: { usuario: true, planta: true, plantacao: true },
    });
  }
  async create(data: CreateSeedDTO, user: User, plant: Plant): Promise<Seed> {
    const seed = this.base.create({ ...data, usuario: user, planta: plant });
    return this.base.save(seed);
  }
}