import { ForbiddenError } from "../errors/ForbiddenError";
export class AuthorizationService {
  static ensureOwnership(
    entity: { usuario: { id: number } },
    loggedUserId: number,
    entityName: string
  ) {
    if (!entity.usuario) {
      throw new ForbiddenError(
        entityName,
        `${entityName} não possui um proprietário ativo`
      );
    }
    if (entity.usuario.id !== loggedUserId) {
      throw new ForbiddenError(
        entityName,
        "tentativa de acessar dados de outro usuário"
      );
    }
  }
  static ensureRelationActive(
    relation: unknown,
    entityName: string,
    relationName: string | string[]
  ) {
    if (!relation) {
      throw new ForbiddenError(
        entityName,
        `${entityName} não está ativo(a)`,
        Array.isArray(relationName)
          ? `${relationName.join(", ")} associados(as) não estão disponíveis`
          : `${relationName} associado(a) não está disponível`
      );
    }
  }
}