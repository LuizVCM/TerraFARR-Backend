import { AppError } from "./AppError";
export class NotFoundError extends AppError {
  constructor(readonly field: string, readonly info?: string) {
    super(`Não encontrado: ${field}`, 404);
  }
  override toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      info: this.info,
    };
  }
}