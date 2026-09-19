import { InternalServerError } from "../errors/InternalServerError";
import { NotFoundError } from "../errors/NotFoundError";
import { TerritoryMapper } from "../mappers/TerritoryMapper";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { UserRepository } from "../repositories/UserRepository";
import {
  CreateTerritoryDTO,
  UpdateTerritoryDTO,
} from "../schemas/territory.schema";
import { fetchAddress } from "../integrations/address-service";
import { dataFilter } from "../utils/data-filter";
import { AuthorizationService } from "./AuthorizationService";

export class TerritoryService {
  private repo = new TerritoryRepository();
  private userRepo = new UserRepository();
  async listAll() {
    const territories = await this.repo.findAllWithUser();
    return TerritoryMapper.toResponseList(territories);
  }
  async getById(id: number, loggedUserId: number) {
    const territory = await this.repo.findByIdWithRelations(id);
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    return TerritoryMapper.toResponse(territory);
  }
  async listByUserLogged(userId: number) {
    const territories = await this.repo.findByUserIdWithRelations(userId);
    return TerritoryMapper.toResponseList(territories);
  }
  async create(data: CreateTerritoryDTO, loggedUserId: number) {
    const user = await this.userRepo.base.findById(loggedUserId);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    const address = await fetchAddress(data.cep);
    const territoryData = {
      ...TerritoryMapper.toCreateEntity(data),
      cidade: address.cidade,
      estado: address.estado,
      bairro: address.bairro,
      logradouro: address.logradouro,
    };
    const territory = await this.repo.create(territoryData, user);
    return TerritoryMapper.toResponse(territory);
  }
  async update(id: number, data: UpdateTerritoryDTO, loggedUserId: number) {
    const territory = await this.repo.findByIdWithUser(id);
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const address = data.cep != null ? await fetchAddress(data.cep) : null;
    const territoryData = {
      ...TerritoryMapper.toUpdateEntity(data),
      ...(address && {
        cep: address.cep,
        cidade: address.cidade,
        estado: address.estado,
        bairro: address.bairro,
        logradouro: address.logradouro,
      }),
    };
    dataFilter(territory, territoryData);
    const territoryUpdated = await this.repo.base.save(territory);
    return TerritoryMapper.toSummaryResponse(territoryUpdated);
  }
  async delete(id: number, loggedUserId: number) {
    const territory = await this.repo.findByIdWithUser(id);
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const result = await this.repo.base.softDelete(id);
    if (result.affected === 0) {
      throw new InternalServerError("Não foi possível deletar");
    }
    return result;
  }
}