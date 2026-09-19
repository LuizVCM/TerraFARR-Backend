import { IPayload } from "../auth/json-web-token";
import { generateToken, verifyToken } from "../auth/json-web-token";
export class AuthService {
  generate(payload: IPayload) {
    return generateToken({
      id: payload.id,
      email: payload.email,
      role: payload.role
    });
  }
  verify(token: string) {
    return verifyToken(token);
  }
}