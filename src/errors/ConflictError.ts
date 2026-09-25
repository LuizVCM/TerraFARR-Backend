import { AppError } from "./AppError";

type ConflictErrorParams = {
  fields?: string[];
  info?: string;
  message?: string;
};

export class ConflictError extends AppError {
  readonly fields: string[];
  readonly info?: string;

  constructor({ fields = [], message, info}: ConflictErrorParams = {}) {
    super(
      message ??
        (fields.length > 1
          ? `Os seguintes campos já estão em uso: ${fields.join(", ")}`
          : `O seguinte campo já está em uso: ${fields[0]}`),
      409,
    );
    this.fields = fields;
    this.info = info;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      fields: this.fields,
      info: this.info,
    };
  }
}