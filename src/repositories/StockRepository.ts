import { Stock } from "../models/Stock";
import { User } from "../models/User";
import { CreateStockDTO } from "../schemas/stock.schema";
import { createBaseRepository } from "./BaseRepository";

export class StockRepository {
  public base = createBaseRepository(Stock);
  async findAllWithUser() {
    return this.base.findAll({ relations: { usuario: true } });
  }
  async findByIdWithUser(id: number) {
    return this.base.findById(id, { relations: { usuario: true } });
  }
  async findAllByUserId(userId: number): Promise<Stock[]> {
    return this.base.getRepository().find({
      where: { usuario: { id: userId } },
      relations: { usuario: true },
    });
  }
  async create(data: CreateStockDTO, user: User): Promise<Stock> {
    const stock = this.base.create({ ...data, usuario: user });
    return this.base.save(stock);
  }
}