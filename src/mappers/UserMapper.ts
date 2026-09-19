import { User } from "../models/User";
import { TerritoryMapper } from "./TerritoryMapper";

export class UserMapper {
  static toResponseSavedUser(usuario: User) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
    };
  }
  static toResponse(usuario: User) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      territorios: usuario.territorios ? TerritoryMapper.toSummaryResponseList(usuario.territorios) : [],
    };
  }
  static toSummaryResponse(usuario: User) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
    };
  }
  static toResponseList(usuarios: User[]) {
    return usuarios.map((usuario) =>
      UserMapper.toResponse(usuario)
    );
  }
}