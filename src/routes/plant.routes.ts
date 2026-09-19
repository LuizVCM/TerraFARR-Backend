import { Router } from "express";
import { PlantController } from "../controllers/PlantController";
import { authMiddleware } from "../middlewares/auth-middleware";

const plantRoutes = Router();
const plantController = new PlantController();

plantRoutes.get("/all", plantController.listAll.bind(plantController));
plantRoutes.get(
  "/me",
  authMiddleware,
  plantController.listByUserLogged.bind(plantController)
);
plantRoutes.get("/seed/:id", authMiddleware, plantController.listBySeedId.bind(plantController));
plantRoutes.get("/:id", plantController.getById.bind(plantController));

export default plantRoutes;