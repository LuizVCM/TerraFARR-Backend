import { Router } from "express";
import { StockController } from "../controllers/StockController";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  validateStockCreate,
  validateStockUpdate,
} from "../middlewares/index.validate";
import { adminMiddleware } from "../middlewares/admin-middleware";

const stockRoutes = Router();
const stockController = new StockController();

stockRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("estoques"),
  stockController.listAll.bind(stockController)
);
stockRoutes.get(
  "/me",
  authMiddleware,
  stockController.listMyStock.bind(stockController)
);
stockRoutes.get(
  "/:id",
  authMiddleware,
  stockController.getById.bind(stockController)
);
stockRoutes.post(
  "/",
  authMiddleware,
  validateStockCreate,
  stockController.create.bind(stockController)
);
stockRoutes.put(
  "/:id",
  authMiddleware,
  validateStockUpdate,
  stockController.update.bind(stockController)
);
stockRoutes.delete(
  "/:id",
  authMiddleware,
  stockController.delete.bind(stockController)
);

export default stockRoutes;