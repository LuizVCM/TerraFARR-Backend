import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import {
  CreateAdminDTO,
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
} from "../schemas/user.schema";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { ConflictError } from "../errors/ConflictError";
import { InternalServerError } from "../errors/InternalServerError";
import { UserMapper } from "../mappers/UserMapper";
import { dataFilter } from "../utils/data-filter";
import { UserRole } from "../models/User";

export class UserService {
  private repo = new UserRepository();
  async listAllWithRelations() {
    const users = await this.repo.listAllWithTerritory();
    return UserMapper.toResponseList(users);
  }
  async listByEmail(email: string) {
    if (!email) {
      throw new BadRequestError("e-mail não fornecido");
    }
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    return UserMapper.toResponse(user);
  }
  async getInfoUser(id: number) {
    const user = await this.repo.findUserWithTerritory(id);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    return UserMapper.toResponse(user);
  }
  /** buscar um usuário por ID com uma relação específica (ex: 'sementes', 'territorios', 'financas' ou 'insumos') */
  async listByIdWith(field: string, id: number) {
    const relations = ["sementes", "territorios", "financas", "insumos"];
    if (!relations.includes(field)) {
      throw new BadRequestError("relação com a entidade incorreta", field);
    }
    const user = await this.repo.findByIdWithRelation(id, field);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    return UserMapper.toResponse(user);
  }
  async create(data: CreateUserDTO) {
    const { cpf, telefone, email } = data;
    const alreadyInUse = await this.repo.findConflicts({
      cpf,
      telefone,
      email,
    });
    if (alreadyInUse) {
      const fields: string[] = [];
      if (alreadyInUse.cpf) fields.push("CPF");
      if (alreadyInUse.telefone) fields.push("telefone");
      if (alreadyInUse.email) fields.push("e-mail");
      if (fields.length > 0) {
        throw new ConflictError({ fields: fields });
      }
    }
    const passHash = await bcrypt.hash(data.senha, 10);
    const user = await this.repo.create({
      ...data,
      senha: passHash,
    });
    return UserMapper.toResponseSavedUser(user);
  }
  async update(id: number, data: UpdateUserDTO) {
    const user = await this.repo.base.findById(id);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    const { senha, ...rest } = data;
    dataFilter(user, rest);
    if (senha) {
      user.senha = await bcrypt.hash(senha, 10);
    }
    const updatedUser = await this.repo.base.save(user);
    return UserMapper.toResponseSavedUser(updatedUser);
  }
  async delete(id: number) {
    const result = await this.repo.base.softDelete(id);
    if (result.affected === 0) {
      throw new InternalServerError("Não foi possível deletar");
    }
    return result;
  }
  async login(data: LoginUserDTO) {
    const userRegistered = await this.repo.findByEmail(data.email);
    if (!userRegistered) {
      throw new UnauthorizedError("credenciais inválidas");
    }
    const user = await this.repo.findByEmailWithPassword(data.email);
    if (!user) {
      throw new InternalServerError("Ocorreu um erro inesperado");
    }
    const validCredentials = await bcrypt.compare(data.senha, user.senha);
    if (!validCredentials) {
      throw new UnauthorizedError("credenciais inválidas");
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
  async checkUserPassword(email: string, pass: string) {
    const user = await this.repo.findByEmailWithPassword(email);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    const passwordIsValid = await bcrypt.compare(pass, user.senha);
    if (!passwordIsValid) {
      throw new UnauthorizedError("credenciais inválidas");
    }
    return { usuario: UserMapper.toResponse(user) };
  }
  async createAdmin(data: CreateAdminDTO) {
    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError({ fields: ["e-mail"] });
    }
    const adminExists = await this.repo.existsByRole(UserRole.ADMIN);
    if (adminExists) {
      throw new UnauthorizedError("o administrador inicial já foi configurado");
    }
    const senha = await bcrypt.hash(data.senha, 10);
    const user = await this.repo.createAdmin({
      ...data,
      senha,
      role: UserRole.ADMIN,
    });
    return { nome: user.nome, email: user.email };
  }
}