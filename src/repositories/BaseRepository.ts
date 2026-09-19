import {
  DeepPartial,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";
import { AppDataSource } from "../config/data-source";

interface BaseEntity extends ObjectLiteral {
  id: number;
}

export interface BaseRepository<T extends BaseEntity> {
  getRepository(): Repository<T>;
  /** o findAll sozinho, sem especificar opções, retorna apenas a lista de objetos daquela entidade, sem as relações */
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  /** o findById sozinho, sem especificar opções, retorna apenas o objeto daquela entidade, sem as relações */
  findById(
    id: number,
    options?: Omit<FindOneOptions<T>, "where">
  ): Promise<T | null>;
  /** o findOne sozinho, sem especificar opções, retorna apenas o objeto daquela entidade, sem as relações */
  findOne(options: FindOneOptions<T>): Promise<T | null>;

  create(data: DeepPartial<T>): T;

  save(data: DeepPartial<T>): Promise<T>;

  delete(id: number): Promise<DeleteResult>;

  softDelete(id: number): Promise<DeleteResult>;

  exists(id: number): Promise<boolean>;

  count(options?: FindManyOptions<T>): Promise<number>;
}

export function createBaseRepository<T extends BaseEntity>(
  entity: EntityTarget<T>
): BaseRepository<T> {
  const repo = AppDataSource.getRepository(entity);

  return {
    getRepository: () => repo,

    async findAll(options) {
      return repo.find(options);
    },

    async findById(id, options) {
      return repo.findOne({
        where: { id } as FindOptionsWhere<T>,
        ...options,
      });
    },

    async findOne(options) {
      return repo.findOne(options);
    },

    create(data) {
      return repo.create(data);
    },

    async save(data) {
      return repo.save(data);
    },

    async delete(id) {
      return await repo.delete(id);
    },

    async softDelete(id) {
      return await repo.softDelete(id);
    },

    async exists(id) {
      return repo.exists({
        where: { id } as FindOptionsWhere<T>,
      });
    },

    async count(options) {
      return repo.count(options);
    },
  };
}