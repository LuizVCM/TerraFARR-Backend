import { Request, Response, NextFunction } from "express";
import { TerritoryService } from "../services/TerritoryService";
import {
  CreateTerritoryDTO,
  UpdateTerritoryDTO,
} from "../schemas/territory.schema";

export class TerritoryController {
  private territoryService = new TerritoryService();
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const territories = await this.territoryService.listAll();
      return res.json(territories);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const territory = await this.territoryService.getById(id, loggedUser);
      return res.json(territory);
    } catch (error) {
      next(error);
    }
  }
  async listMyTerritories(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const myTerritories = await this.territoryService.listByUserLogged(id);
      return res.status(200).json(myTerritories);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const createTerritoryData = req.body as CreateTerritoryDTO;
      const territory = await this.territoryService.create(
        createTerritoryData,
        id
      );
      return res.status(201).json(territory);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const updateTerritoryData = req.body as UpdateTerritoryDTO;
      const territory = await this.territoryService.update(
        id,
        updateTerritoryData,
        loggedUser
      );
      return res.json(territory);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      await this.territoryService.delete(id, loggedUser);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}