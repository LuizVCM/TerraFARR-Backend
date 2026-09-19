import { PlantRepository } from "../repositories/PlantRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { PlantMapper } from "../mappers/PlantMapper";
import { SeedRepository } from "../repositories/SeedRepository";
import { AuthorizationService } from "./AuthorizationService";

export class PlantService {
  private repo = new PlantRepository();
  private seedRepo = new SeedRepository();
  async listAll() {
    const plants = await this.repo.base.findAll();
    return PlantMapper.toResponseList(plants);
  }
  async getById(id: number) {
    const plant = await this.repo.base.findById(id);
    if (!plant) {
      throw new NotFoundError("planta");
    }
    return PlantMapper.toResponse(plant);
  }
  async getPlantBySeedId(seedId: number, loggedUserId: number) {
    const seed = await this.seedRepo.findByIdWithRelations(seedId);
    if (!seed) {
      throw new NotFoundError("semente");
    }
    AuthorizationService.ensureOwnership(seed, loggedUserId, "semente");
    return PlantMapper.toResponse(seed.planta);
  }
  async listUsedByUser(userId: number) {
    const plants = await this.repo.findByUserId(userId);
    return PlantMapper.toResponseWithRelationList(plants);
  }
}