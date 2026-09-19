import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { CreateAdminDTO, CreateUserDTO, UpdateUserDTO } from "../schemas/user.schema";

export class UserController {
  private userService = new UserService();
  async listAllWithRelations(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.listAllWithRelations();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  async getInfoUserLogged(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const user = await this.userService.getInfoUser(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async getRelationUserLogged(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const relation: string = req.body.relation;
      const data = await this.userService.listByIdWith(relation, id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserData = req.body as CreateUserDTO;
      const created = await this.userService.create(createUserData);
      return res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const createAdminData = req.body as CreateAdminDTO;
      const created = await this.userService.createAdmin(createAdminData);
      return res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const updateUserData = req.body as UpdateUserDTO;
      const user = await this.userService.update(id, updateUserData);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      await this.userService.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}