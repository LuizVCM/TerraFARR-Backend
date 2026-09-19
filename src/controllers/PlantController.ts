import { NextFunction, Request, Response } from "express";
import { PlantService } from "../services/PlantService";

export class PlantController {
  private plantService = new PlantService();
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const plants = await this.plantService.listAll();
      return res.status(200).json(plants);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const plant = await this.plantService.getById(id);
      return res.status(200).json(plant);
    } catch (error) {
      next(error);
    }
  }
  async listBySeedId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const plants = await this.plantService.getPlantBySeedId(id, loggedUser);
      return res.status(200).json(plants);
    } catch (error) {
      next(error);
    }
  }
  async listByUserLogged(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const plants = await this.plantService.listUsedByUser(id);
      return res.status(200).json(plants);
    } catch (error) {
      next(error);
    }
  }
}