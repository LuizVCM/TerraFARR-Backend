import { Router } from "express";
import { SensorController } from "../controllers/SensorController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { adminMiddleware } from "../middlewares/admin-middleware";

const sensorRoutes = Router();
const sensorController = new SensorController();

sensorRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("sensores"),
  sensorController.listAll.bind(sensorController)
);
sensorRoutes.get(
  "/me",
  authMiddleware,
  sensorController.listMySensors.bind(sensorController)
);
sensorRoutes.get(
  "/:id",
  authMiddleware,
  sensorController.getById.bind(sensorController)
);
sensorRoutes.post(
  "/territory/:id",
  authMiddleware,
  sensorController.create.bind(sensorController)
);
sensorRoutes.put(
  "/:id",
  authMiddleware,
  sensorController.update.bind(sensorController)
);
sensorRoutes.delete(
  "/:id",
  authMiddleware,
  sensorController.delete.bind(sensorController)
);

export default sensorRoutes;