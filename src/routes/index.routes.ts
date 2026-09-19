import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import territoryRoutes from "./territory.routes";
import cropRoutes from "./crop.routes";
import financeRoutes from "./finance.routes";
import stockRoutes from "./stock.routes";
import plantRoutes from "./plant.routes";
import seedRoutes from "./seed.routes";
import sensorRoutes from "./sensor.routes";
import weatherRoutes from "./weather.routes";
const router = Router();
router.use("/auth", authRoutes); // login, logout e checar senha
router.use("/users", userRoutes);
router.use("/territories", territoryRoutes);
router.use("/plants", plantRoutes);
router.use("/seeds", seedRoutes);
router.use("/crops", cropRoutes);
router.use("/finances", financeRoutes);
router.use("/stocks", stockRoutes);
router.use("/sensor", sensorRoutes);
router.use("/weather", weatherRoutes);

export default router;