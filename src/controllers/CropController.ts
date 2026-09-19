import { NextFunction, Request, Response } from "express";
import { CropService } from "./../services/CropService";
import { CreateCropDTO, UpdateCropDTO } from "../schemas/crop.schema";
export class CropController {
  private cropService = new CropService();
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const crops = await this.cropService.listAll();
      return res.json(crops);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const crop = await this.cropService.getById(id, loggedUser);
      return res.json(crop);
    } catch (error) {
      next(error);
    }
  }
  async listMyCrops(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const myCrops = await this.cropService.listByUserLogged(id);
      return res.status(200).json(myCrops);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const loggedUser = req.user!.id;
      const territoryId = Number(req.params.id);
      const createCropData = req.body as CreateCropDTO;
      const crop = await this.cropService.create(
        createCropData,
        territoryId,
        loggedUser
      );
      return res.status(201).json(crop);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const updateCropData = req.body as UpdateCropDTO;
      const crop = await this.cropService.update(
        id,
        updateCropData,
        loggedUser
      );
      return res.json(crop);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      await this.cropService.delete(id, loggedUser);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}