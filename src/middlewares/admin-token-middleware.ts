import { Request, Response, NextFunction } from "express";
import { InternalServerError } from "../errors/InternalServerError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export function adminTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const expectedToken = process.env.ADMIN_TOKEN;
  const receivedToken = req.headers["x-admin-token"];
  if (!expectedToken) {
    throw new InternalServerError("Token de administrador não configurado");
  }
  if (!receivedToken || receivedToken !== expectedToken) {
    throw new UnauthorizedError("token de administrador inválido");
  }
  next();
}