import { User, UserRole } from "../models/User";
import { CreateAdminDTO, CreateUserDTO } from "../schemas/user.schema";
import { createBaseRepository } from "./BaseRepository";

export class UserRepository {
  public base = createBaseRepository(User);
  /** listar todos os usuários com território  */
  async listAllWithTerritory() {
    return this.base.findAll({
      relations: {
        territorios: true,
      },
    });
  }
  /** buscar por chaves únicas, a fim de validar um cadastro */
  async findConflicts(keys: { cpf: string; telefone: string; email: string }) {
    const users = await this.base.findAll({
      where: [
        { cpf: keys.cpf },
        { telefone: keys.telefone },
        { email: keys.email },
      ],
      withDeleted: true,
      select: { id: true, cpf: true, telefone: true, email: true },
    });
    // mapeia quais campos estão em uso
    const conflicts = {
      cpf: false,
      telefone: false,
      email: false,
    };
    for (const user of users) {
      if (user.cpf === keys.cpf) conflicts.cpf = true;
      if (user.telefone === keys.telefone) conflicts.telefone = true;
      if (user.email === keys.email) conflicts.email = true;
    }
    return conflicts;
  }
  async findUserWithTerritory(id: number) {
    return this.base.findById(id, {
      relations: {
        territorios: true,
      },
    });
  }
  /** busca apenas por e-mail */
  async findByEmail(email: string) {
    return this.base.findOne({
      where: { email },
      select: { id: true, email: true },
    });
  }
  /** busca por e-mail para ser utilizado ao logar. APENAS no login, pois aqui a senha é retornada */
  async findByEmailWithPassword(email: string) {
    return this.base.findOne({
      where: { email },
      select: { id: true, email: true, senha: true },
    });
  }
  /** buscar um usuário por ID com uma relação específica (ex: 'sementes', 'territorios', 'financas' ou 'insumos') */
  async findByIdWithRelation(
    id: number,
    relation: string
  ): Promise<User | null> {
    return this.base.findById(id, { relations: [relation] });
  }
  /** cria um novo usuário */
  async create(data: CreateUserDTO): Promise<User> {
    const user = this.base.create(data);
    return this.base.save(user);
  }
  async createAdmin(data: CreateAdminDTO): Promise<User> {
    const user = this.base.create(data);
    return this.base.save(user);
  }
  async existsByRole(role: UserRole): Promise<boolean> {
    const count = await this.base.count({
      where: {
        role,
      },
    });
    return count > 0;
  }
}
