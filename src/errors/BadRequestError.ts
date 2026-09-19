import { AppError } from "./AppError";
export class BadRequestError extends AppError {
  constructor(readonly details: unknown, readonly field?: string) {
    super(`Requisição incorreta`, 400);
  }
  override toJSON() {
    return {
      ...super.toJSON(),
      ...(this.details ? { errors: this.details } : {}),
    };
  }
}