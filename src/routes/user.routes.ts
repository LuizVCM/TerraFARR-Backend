import {
  validateAdminCreate,
  validateUserCreate,
  validateUserUpdate,
} from "../middlewares/index.validate";
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { adminTokenMiddleware } from "../middlewares/admin-token-middleware";
import { adminMiddleware } from "../middlewares/admin-middleware";

const userRoutes = Router();
const userController = new UserController();

// criar admin. é necessário o token vindo do env enviado via header "x-admin-token"
userRoutes.post(
  "/admin",
  adminTokenMiddleware,
  validateAdminCreate,
  userController.createAdmin.bind(userController)
);
userRoutes.get(
  "/all",
  authMiddleware,
  adminMiddleware("usuários"),
  userController.listAllWithRelations.bind(userController)
);
userRoutes.get(
  "/me",
  authMiddleware,
  userController.getInfoUserLogged.bind(userController)
);
userRoutes.post(
  "/",
  validateUserCreate,
  userController.create.bind(userController)
);
userRoutes.put(
  "/",
  authMiddleware,
  validateUserUpdate,
  userController.update.bind(userController)
);
userRoutes.delete(
  "/",
  authMiddleware,
  userController.delete.bind(userController)
);

export default userRoutes;