import { Finance } from "../models/Finance";
import { User } from "../models/User";
import { CreateFinanceDTO } from "../schemas/finance.schema";
import { createBaseRepository } from "./BaseRepository";

export class FinanceRepository {
  public base = createBaseRepository(Finance);
  async findAllWithUser() {
    return this.base.findAll({ relations: { usuario: true } });
  }
  async findByIdWithUser(id: number) {
    return this.base.findById(id, { relations: { usuario: true } });
  }
  async findAllByUserId(userId: number): Promise<Finance[]> {
    return this.base.getRepository().find({
      where: { usuario: { id: userId } },
      relations: { usuario: true },
    });
  }
  async create(data: CreateFinanceDTO, user: User): Promise<Finance> {
    const finance = this.base.create({ ...data, usuario: user });
    return this.base.save(finance);
  }
}