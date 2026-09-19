import { SensorRepository } from "../repositories/SensorRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateSensorDTO, UpdateSensorDTO } from "../schemas/sensor.schema";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { AuthorizationService } from "./AuthorizationService";
import { SensorMapper } from "../mappers/SensorMapper";
import { dataFilter } from "../utils/data-filter";
import { InternalServerError } from "../errors/InternalServerError";

export class SensorService {
  private repo = new SensorRepository();
  private territoryRepo = new TerritoryRepository();
  async listAll() {
    const sensors = await this.repo.findAllWithRelations();
    return SensorMapper.toResponseList(sensors);
  }
  async getById(id: number, loggedUserId: number) {
    const sensor = await this.repo.findByIdWithRelations(id);
    if (!sensor) {
      throw new NotFoundError("sensor");
    }
    AuthorizationService.ensureRelationActive(
      sensor.territorio,
      "sensor",
      "território"
    );
    AuthorizationService.ensureOwnership(
      sensor.territorio,
      loggedUserId,
      "sensor"
    );
    return SensorMapper.toResponse(sensor);
  }
  async listByTerritoryId(territoryId: number, loggedUserId: number) {
    const territory = await this.territoryRepo.findByIdWithRelations(
      territoryId
    );
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const sensors = await this.repo.findAllByTerritoryId(territoryId);
    return SensorMapper.toResponseList(sensors);
  }
  async listByUserLogged(userId: number) {
    const sensors = await this.repo.findAllByUserId(userId);
    return SensorMapper.toResponseList(sensors);
  }
  async create(
    data: CreateSensorDTO,
    territoryId: number,
    loggedUserId: number
  ) {
    const territory = await this.territoryRepo.findByIdWithRelations(
      territoryId
    );
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureRelationActive(
      territory,
      "sensor",
      "território"
    );
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const sensor = await this.repo.create(data, territory);
    return SensorMapper.toResponse(sensor);
  }
  async update(id: number, data: UpdateSensorDTO, loggedUserId: number) {
    const sensor = await this.repo.findByIdWithRelations(id);
    if (!sensor) {
      throw new NotFoundError("sensor");
    }
    AuthorizationService.ensureRelationActive(
      sensor.territorio,
      "sensor",
      "território"
    );
    AuthorizationService.ensureOwnership(
      sensor.territorio,
      loggedUserId,
      "sensor"
    );
    dataFilter(sensor, data);
    const sensorUpdated = await this.repo.base.save(sensor);
    return sensorUpdated;
  }
  async delete(id: number, loggedUserId: number) {
    const sensor = await this.repo.findByIdWithRelations(id);
    if (!sensor) {
      throw new NotFoundError("sensor");
    }
    AuthorizationService.ensureRelationActive(
      sensor.territorio,
      "sensor",
      "território"
    );
    AuthorizationService.ensureOwnership(
      sensor.territorio,
      loggedUserId,
      "sensor"
    );
    const result = await this.repo.base.softDelete(id);
    if (result.affected === 0) {
      throw new InternalServerError("Não foi possível deletar");
    }
    return result;
  }
}