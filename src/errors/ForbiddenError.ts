import { AppError } from "./AppError";
export class ForbiddenError extends AppError {
  constructor(readonly resource: string, readonly info?: string, readonly cause?: string) {
    super(
      `Acesso restrito: sem permissão para alterar e acessar ${resource}`,
      403
    );
  }
  override toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource,
      info: this.info,
      cause: this.cause
    };
  }
}