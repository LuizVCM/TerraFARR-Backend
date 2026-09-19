import { InternalServerError } from "../errors/InternalServerError";
import { NotFoundError } from "../errors/NotFoundError";
import { FinanceMapper } from "../mappers/FinanceMapper";
import { FinanceRepository } from "../repositories/FinanceRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CreateFinanceDTO, UpdateFinanceDTO } from "../schemas/finance.schema";
import { dataFilter } from "../utils/data-filter";
import { AuthorizationService } from "./AuthorizationService";

export class FinanceService {
  private repo = new FinanceRepository();
  private userRepo = new UserRepository();
  async listAll() {
    const finances = await this.repo.findAllWithUser();
    return FinanceMapper.toResponseList(finances);
  }
  async getById(id: number, loggedUserId: number) {
    const finance = await this.repo.findByIdWithUser(id);
    if (!finance) {
      throw new NotFoundError("registro financeiro");
    }
    AuthorizationService.ensureOwnership(
      finance,
      loggedUserId,
      "registro financeiro"
    );
    return FinanceMapper.toResponse(finance);
  }
  async listByUserLogged(userId: number) {
    const finances = await this.repo.findAllByUserId(userId);
    return FinanceMapper.toResponseList(finances);
  }
  async create(data: CreateFinanceDTO, loggedUserId: number) {
    const user = await this.userRepo.base.findById(loggedUserId);
    if (!user) {
      throw new InternalServerError("Ocorreu um erro inesperado");
    }
    const finance = await this.repo.create(data, user);
    return FinanceMapper.toResponse(finance);
  }
  async update(id: number, data: UpdateFinanceDTO, loggedUserId: number) {
    const finance = await this.repo.findByIdWithUser(id);
    if (!finance) {
      throw new NotFoundError("registro financeiro");
    }
    AuthorizationService.ensureOwnership(
      finance,
      loggedUserId,
      "registros financeiros"
    );
    dataFilter(finance, data);
    const financeUpdated = await this.repo.base.save(finance);
    return FinanceMapper.toSummaryResponse(financeUpdated);
  }
  async delete(id: number, loggedUserId: number) {
    const finance = await this.repo.findByIdWithUser(id);
    if (!finance) {
      throw new NotFoundError("registro financeiro");
    }
    AuthorizationService.ensureOwnership(
      finance,
      loggedUserId,
      "registros financeiros"
    );
    const result = await this.repo.base.softDelete(id);
    if (result.affected === 0) {
      throw new InternalServerError("Não foi possível deletar");
    }
    return result;
  }
}