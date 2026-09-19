import { Request, Response, NextFunction } from "express";
import { StockService } from "../services/StockService";
import { CreateStockDTO, UpdateStockDTO } from "../schemas/stock.schema";

export class StockController {
  private stockService = new StockService();
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const stocks = await this.stockService.listAll();
      return res.json(stocks);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const stock = await this.stockService.getById(id, loggedUser);
      return res.json(stock);
    } catch (error) {
      next(error);
    }
  }
  async listMyStock(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const stocks = await this.stockService.listByUserLogged(id);
      return res.status(200).json(stocks);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const loggedUser = req.user!.id;
      const createStockData = req.body as CreateStockDTO;
      const stock = await this.stockService.create(createStockData, loggedUser);
      return res.status(201).json(stock);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      const updateStockData = req.body as UpdateStockDTO;
      const stock = await this.stockService.update(
        id,
        updateStockData,
        loggedUser
      );
      return res.json(stock);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const loggedUser = req.user!.id;
      await this.stockService.delete(id, loggedUser);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}