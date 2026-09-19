import { AppError } from "./AppError";
export class UnauthorizedError extends AppError {
  constructor(readonly info?: string) {
    super(`Não autorizado: ${info}`, 401);
  }
  override toJSON() {
    return {
      ...super.toJSON(),
      info: this.info,
    };
  }
}