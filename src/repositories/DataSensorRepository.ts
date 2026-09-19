import { DataSensor } from "../models/DataSensor";
import { Sensor } from "../models/Sensor";
import { CreateDataSensorDTO } from "../schemas/data-sensor.schema";
import { createBaseRepository } from "./BaseRepository";

export class DataSensorRepository {
  public base = createBaseRepository(DataSensor);
  async findBySensorId(sensorId: number): Promise<DataSensor[] | null> {
    return this.base.findAll({
      where: { sensor: { id: sensorId } },
      relations: { sensor: true },
    });
  }
  async findByIdWithRelation(id: number) {
    return this.base.findById(id, {
      relations: { sensor: true },
    });
  }
  async create(data: CreateDataSensorDTO, sensor: Sensor): Promise<DataSensor> {
    const dataSensor = this.base.create({ ...data, sensor });
    return this.base.save(dataSensor);
  }
}