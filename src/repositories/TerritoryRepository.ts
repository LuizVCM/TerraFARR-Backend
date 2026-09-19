import { Territory } from "../models/Territory";
import { User } from "../models/User";
import { AreaUnit } from "../calc/area-converter";
import { createBaseRepository } from "./BaseRepository";

interface TerritoryData {
  cep: string;
  cidade: string;
  estado: string;
  bairro: string | null;
  logradouro: string | null;
  areaM2: number;
  unidadeArea: AreaUnit;
}

export class TerritoryRepository {
  public base = createBaseRepository(Territory);
  async findAllWithUser() {
    return this.base.findAll({
      relations: {
        usuario: true,
      },
    });
  }
  async findByIdWithUser(id: number) {
    return this.base.findById(id, {
      relations: {
        usuario: true,
      },
    });
  }
  /** buscar todos os territórios de um usuário, com as relações */
  async findByUserIdWithRelations(userId: number): Promise<Territory[]> {
    return this.base.getRepository().find({
      where: { usuario: { id: userId } },
      relations: {
        usuario: true,
        plantacoes: true,
        sensores: true,
        clima: true,
      },
    });
  }
  async findByIdWithRelations(id: number) {
    return this.base.findById(id, {
      relations: {
        usuario: true,
        plantacoes: true,
        sensores: true,
        clima: true,
      },
    });
  }
  /** criar um novo território associado a um usuário */
  async create(data: TerritoryData, user: User): Promise<Territory> {
    const territory = this.base.create({ ...data, usuario: user });
    return this.base.save(territory);
  }
}
