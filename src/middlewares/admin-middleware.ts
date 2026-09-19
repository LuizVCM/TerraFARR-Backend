import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { UserRole } from "../models/User";

export function adminMiddleware(resource: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("não autenticado");
    }
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenError(
        resource,
        "Acesso permitido apenas para administrador",
        "Permissão insuficiente"
      );
    }
    next();
  };
}