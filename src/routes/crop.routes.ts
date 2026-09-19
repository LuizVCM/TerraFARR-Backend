import { Router } from "express";
import { CropController } from "../controllers/CropController";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  validateCropCreate,
  validateCropUpdate,
} from "../middlewares/index.validate";
import { adminMiddleware } from "../middlewares/admin-middleware";

const cropRoutes = Router();
const cropController = new CropController();

cropRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("plantações"),
  cropController.listAll.bind(cropController)
);
cropRoutes.get(
  "/me",
  authMiddleware,
  cropController.listMyCrops.bind(cropController)
);
cropRoutes.get(
  "/:id",
  authMiddleware,
  cropController.getById.bind(cropController)
);
cropRoutes.post(
  "/:id",
  authMiddleware,
  validateCropCreate,
  cropController.create.bind(cropController)
);
cropRoutes.put(
  "/:id",
  authMiddleware,
  validateCropUpdate,
  cropController.update.bind(cropController)
);
cropRoutes.delete(
  "/:id",
  authMiddleware,
  cropController.delete.bind(cropController)
);

export default cropRoutes;