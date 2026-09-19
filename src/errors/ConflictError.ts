import { AppError } from "./AppError";
export class ConflictError extends AppError {
  constructor(readonly fields: string[], readonly info?: string) {
    super(
      fields.length > 1
        ? `Os seguintes campos já estão em uso: ${fields.join(", ")}`
        : `O seguinte campo já está em uso: ${fields[0]}`,
      409,
    );
  }
  override toJSON() {
    return {
      ...super.toJSON(),
      fields: this.fields,
      info: this.info
    };
  }
}