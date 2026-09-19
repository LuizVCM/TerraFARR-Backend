import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../auth/json-web-token";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthorizedError("não autenticado");
  }
  const payload = verifyToken(token);
  if (!payload) {
    throw new UnauthorizedError("não autenticado");
  }
  req.user = payload;
  next();
}