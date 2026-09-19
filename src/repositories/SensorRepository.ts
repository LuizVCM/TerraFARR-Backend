import { Sensor } from "../models/Sensor";
import { Territory } from "../models/Territory";
import { CreateSensorDTO } from "../schemas/sensor.schema";
import { createBaseRepository } from "./BaseRepository";

export class SensorRepository {
  public base = createBaseRepository(Sensor);
  async findAllWithRelations() {
    return this.base.findAll({ relations: { territorio: true, dados: true } });
  }
  async findAllByTerritoryId(territoryId: number): Promise<Sensor[]> {
    return this.base.getRepository().find({
      where: { territorio: { id: territoryId } },
      relations: { territorio: true },
    });
  }
  async findAllByUserId(userId: number): Promise<Sensor[]> {
    return this.base
      .getRepository()
      .find({
        where: { territorio: { usuario: { id: userId } } },
        relations: { territorio: true },
      });
  }
  async findByIdWithRelations(id: number) {
    return this.base.findById(id, {
      relations: { territorio: true, dados: true },
      select: { territorio: { usuario: true } },
    });
  }
  async create(data: CreateSensorDTO, territory: Territory): Promise<Sensor> {
    const sensor = this.base.create({ ...data, territorio: territory });
    return this.base.save(sensor);
  }
}