import { Request, Response, NextFunction } from "express";
import { SeedService } from "../services/SeedService";
import { CreateSeedDTO, UpdateSeedDTO } from "../schemas/seed.schema";

export class SeedController {
  private seedService = new SeedService();
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const seeds = await this.seedService.listAll();
      return res.json(seeds);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const seed = await this.seedService.getById(id, loggedUser);
      return res.json(seed);
    } catch (error) {
      next(error);
    }
  }
  async listMySeeds(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const seeds = await this.seedService.listByUserLogged(id);
      return res.status(200).json(seeds);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const createSeedData = req.body as CreateSeedDTO;
      const seed = await this.seedService.create(createSeedData, id);
      return res.status(201).json(seed);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const updateSeedData = req.body as UpdateSeedDTO;
      const seed = await this.seedService.update(
        id,
        updateSeedData,
        loggedUser
      );

      return res.json(seed);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      await this.seedService.delete(id, loggedUser);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}