import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UserRole } from "../models/User";

export interface IPayload {
  id: number;
  email: string;
  role: UserRole;
}

dotenv.config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export function generateToken(payload: IPayload) {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: Number(JWT_EXPIRES_IN) });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET!) as IPayload;
  } catch {
    return null;
  }
}