import { NotFoundError } from "../errors/NotFoundError";
import { AuthorizationService } from "../services/AuthorizationService";
import { DataSensorMapper } from "../mappers/DataSensor";
import { DataSensorRepository } from "../repositories/DataSensorRepository";
import { SensorRepository } from "../repositories/SensorRepository";
import { CreateDataSensorDTO } from "../schemas/data-sensor.schema";

export class DataSensorService {
  private repo = new DataSensorRepository();
  private sensorRepo = new SensorRepository();

  async getById(id: number, loggedUserId: number) {
    const data = await this.repo.findByIdWithRelation(id);

    if (!data) {
      throw new NotFoundError("dados do sensor");
    }

    AuthorizationService.ensureOwnership(
      data.sensor.territorio,
      loggedUserId,
      "sensor"
    );

    return DataSensorMapper.toResponse(data);
  }

  async listBySensor(sensorId: number, loggedUserId: number) {
    const sensor = await this.sensorRepo.findByIdWithRelations(sensorId);

    if (!sensor) {
      throw new NotFoundError("sensor");
    }

    AuthorizationService.ensureOwnership(
      sensor.territorio,
      loggedUserId,
      "sensor"
    );

    const data = await this.repo.findBySensorId(sensorId);

    return DataSensorMapper.toResponseList(data!);
  }

  async create(
    data: CreateDataSensorDTO,
    sensorId: number,
    loggedUserId: number
  ) {
    const sensor = await this.sensorRepo.findByIdWithRelations(sensorId);

    if (!sensor) {
      throw new NotFoundError("sensor");
    }

    AuthorizationService.ensureOwnership(
      sensor.territorio,
      loggedUserId,
      "sensor"
    );

    const dataSensor = await this.repo.create(data, sensor);

    return DataSensorMapper.toResponse(dataSensor);
  }
}