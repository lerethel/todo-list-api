import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import userController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/users/login", authController.login);
userRouter.get("/users/refresh", authController.refresh);
userRouter.post("/users/logout", authController.logout);

userRouter.post("/users/signup", userController.create);
userRouter.get("/users/me/", userController.find);
userRouter.put("/users/me/name", userController.updateName);
userRouter.put("/users/me/email", userController.updateEmail);
userRouter.put("/users/me/password", userController.updatePassword);
userRouter.post("/users/me/delete", userController.delete);

export default userRouter;
