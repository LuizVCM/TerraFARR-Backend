import { Router } from "express";
import { TerritoryController } from "../controllers/TerritoryController";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  validateTerritoryCreate,
  validateTerritoryUpdate,
} from "../middlewares/index.validate";
import { adminMiddleware } from "../middlewares/admin-middleware";

const territoryRoutes = Router();
const territoryController = new TerritoryController();

territoryRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("territórios"),
  territoryController.listAll.bind(territoryController)
);
territoryRoutes.get(
  "/me",
  authMiddleware,
  territoryController.listMyTerritories.bind(territoryController)
);
territoryRoutes.get(
  "/:id",
  authMiddleware,
  territoryController.getById.bind(territoryController)
);
territoryRoutes.post(
  "/",
  authMiddleware,
  validateTerritoryCreate,
  territoryController.create.bind(territoryController)
);
territoryRoutes.put(
  "/:id",
  authMiddleware,
  validateTerritoryUpdate,
  territoryController.update.bind(territoryController)
);
territoryRoutes.delete(
  "/:id",
  authMiddleware,
  territoryController.delete.bind(territoryController)
);

export default territoryRoutes;