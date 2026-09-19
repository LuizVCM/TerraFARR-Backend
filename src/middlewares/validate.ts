import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../errors/BadRequestError";
export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestError(
        result.error.issues.map((issue) => {
          if (issue.code === "invalid_value" && issue.values) {
            return {
              field: issue.path.join("."),
              message: "Valor inválido",
              expected: `${issue.values.join(
                ", "
              )}` 
            };
          }
          return {
            field: issue.path.join("."),
            message: issue.message,
          };
        })
      );
    }
    req.body = result.data;
    next();
  };
}