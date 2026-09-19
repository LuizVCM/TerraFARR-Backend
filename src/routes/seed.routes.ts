import { Router } from "express";
import { SeedController } from "../controllers/SeedController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { adminMiddleware } from "../middlewares/admin-middleware";
import {
  validateSeedCreate,
  validateSeedUpdate,
} from "../middlewares/index.validate";

const seedRoutes = Router();
const seedController = new SeedController();

seedRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("sementes"),
  seedController.listAll.bind(seedController)
);
seedRoutes.get(
  "/me",
  authMiddleware,
  seedController.listMySeeds.bind(seedController)
);
seedRoutes.get(
  "/:id",
  authMiddleware,
  seedController.getById.bind(seedController)
);
seedRoutes.post(
  "/",
  authMiddleware,
  validateSeedCreate,
  seedController.create.bind(seedController)
);
seedRoutes.put(
  "/:id",
  authMiddleware,
  validateSeedUpdate,
  seedController.update.bind(seedController)
);
seedRoutes.delete(
  "/:id",
  authMiddleware,
  seedController.delete.bind(seedController)
);

export default seedRoutes;
