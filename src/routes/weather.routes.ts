import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { authMiddleware } from "../middlewares/auth-middleware";
import { validateWeatherCreate } from "../middlewares/index.validate";

const weatherRoutes = Router();
const weatherController = new WeatherController();

weatherRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("registros climáticos"),
  weatherController.listAll.bind(weatherController)
);
weatherRoutes.get(
  "/me",
  authMiddleware,
  weatherController.listMyWeathers.bind(weatherController)
);
weatherRoutes.get(
  "/territory/:id",
  authMiddleware,
  weatherController.listByTerritoryId.bind(weatherController)
);
weatherRoutes.get(
  "/:id",
  authMiddleware,
  weatherController.getById.bind(weatherController)
);
weatherRoutes.post(
  "/territory/:id",
  authMiddleware,
  validateWeatherCreate,
  weatherController.create.bind(weatherController)
);

export default weatherRoutes;