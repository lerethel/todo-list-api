import express from "express";
import * as userController from "../controllers/user.js";

const router = express.Router();

router.post("/users/register", userController.registerUser);
router.post("/users/login", userController.loginUser);
router.get("/users/refresh", userController.refreshUser);
router.get("/users/logout", userController.logoutUser);
router
  .route("/users/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
