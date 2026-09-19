import { Request, Response, NextFunction } from "express";
import { DataSensorService } from "../services/DataSensorService";
import { CreateDataSensorDTO } from "../schemas/data-sensor.schema";

export class DataSensorController {
  private dataSensorService = new DataSensorService();

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const data = await this.dataSensorService.getById(id, loggedUser);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async listBySensor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const data = await this.dataSensorService.listBySensor(id, loggedUser);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const createDataSensor = req.body as CreateDataSensorDTO;
      const data = await this.dataSensorService.create(
        createDataSensor,
        id,
        loggedUser
      );
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}