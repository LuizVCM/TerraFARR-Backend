import { InternalServerError } from "../errors/InternalServerError";
import { NotFoundError } from "../errors/NotFoundError";
import { StockMapper } from "../mappers/StockMapper";
import { StockRepository } from "../repositories/StockRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CreateStockDTO, UpdateStockDTO } from "../schemas/stock.schema";
import { dataFilter } from "../utils/data-filter";
import { AuthorizationService } from "./AuthorizationService";

export class StockService {
  private repo = new StockRepository();
  private userRepo = new UserRepository();
  async listAll() {
    const stocks = await this.repo.findAllWithUser();
    return StockMapper.toResponseList(stocks);
  }
  async getById(id: number, loggedUserId: number) {
    const stock = await this.repo.findByIdWithUser(id);
    if (!stock) {
      throw new NotFoundError("registro de insumo");
    }
    AuthorizationService.ensureOwnership(
      stock,
      loggedUserId,
      "registro de insumo"
    );
    return StockMapper.toResponse(stock);
  }
  async listByUserLogged(userId: number) {
    const stocks = await this.repo.findAllByUserId(userId);
    return StockMapper.toResponseList(stocks);
  }
  async create(data: CreateStockDTO, loggedUserId: number) {
    const user = await this.userRepo.base.findById(loggedUserId);
    if (!user) {
      throw new InternalServerError("Ocorreu um erro inesperado");
    }
    const stock = await this.repo.create(data, user);
    return StockMapper.toResponse(stock);
  }
  async update(id: number, data: UpdateStockDTO, loggedUserId: number) {
    const stock = await this.repo.findByIdWithUser(id);
    if (!stock) {
      throw new NotFoundError("registro de insumo");
    }
    AuthorizationService.ensureOwnership(
      stock,
      loggedUserId,
      "registros de insumos"
    );
    dataFilter(stock, data);
    const stockUpdated = await this.repo.base.save(stock);
    return StockMapper.toSummaryResponse(stockUpdated);
  }
  async delete(id: number, loggedUserId: number) {
    const stock = await this.repo.findByIdWithUser(id);
    if (!stock) {
      throw new NotFoundError("registro de insumos");
    }
    AuthorizationService.ensureOwnership(
      stock,
      loggedUserId,
      "registros de insumos"
    );
    const result = await this.repo.base.softDelete(id);
    if (result.affected === 0) {
      throw new InternalServerError("Não foi possível deletar");
    }
    return result;
  }
}