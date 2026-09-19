import { adminMiddleware } from "../middlewares/admin-middleware";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  validateFinanceCreate,
  validateFinanceUpdate,
} from "../middlewares/index.validate";
import { FinanceController } from "./../controllers/FinanceController";
import { Router } from "express";

const financeRoutes = Router();
const financeController = new FinanceController();

financeRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("registros financeiros"),
  financeController.listAll.bind(financeController)
);
financeRoutes.get(
  "/me",
  authMiddleware,
  financeController.listMyFinances.bind(financeController)
);
financeRoutes.get(
  "/:id",
  authMiddleware,
  financeController.getById.bind(financeController)
);
financeRoutes.post(
  "/",
  authMiddleware,
  validateFinanceCreate,
  financeController.create.bind(financeController)
);
financeRoutes.put(
  "/:id",
  authMiddleware,
  validateFinanceUpdate,
  financeController.update.bind(financeController)
);
financeRoutes.delete(
  "/:id",
  authMiddleware,
  financeController.delete.bind(financeController)
);

export default financeRoutes;