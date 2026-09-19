import { LoginUserDTO } from "./../schemas/user.schema";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class AuthController {
  private authService: AuthService = new AuthService();
  private userService: UserService = new UserService();
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = req.body as LoginUserDTO;
      const loggedUser = await this.userService.login(loginData);
      const token = this.authService.generate({
        id: loggedUser.id,
        email: loggedUser.email,
        role: loggedUser.role,
      });

      // console.log("Token:", token);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // false -> thunderclient, true -> front
        sameSite: "none", // 'lax' -> thunderclient, 'none' -> front
        maxAge: 1000 * 60 * 60, // 1h
      });

      // console.log("Headers:", res.getHeaders());

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token");
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
  /** para solicitar confirmação ao alterar dados sensíveis, se necessário  */
  async checkUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { senha } = req.body;
      if (!req.user?.email) {
        throw new UnauthorizedError("não autenticado");
      }
      const passwordIsValid = await this.userService.checkUserPassword(
        req.user?.email,
        senha
      );
      if (!passwordIsValid) {
        throw new UnauthorizedError("credenciais inválidas");
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}