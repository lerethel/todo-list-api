import express from "express";
import * as userController from "../controllers/user.js";

const router = express.Router();

router.post("/users/register", userController.registerUser);
router.post("/users/login", userController.loginUser);
router.get("/users/refresh", userController.refreshUser);
router.post("/users/logout", userController.logoutUser);

router
  .route("/users/me")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.put("/users/me/user", userController.updateUserName);
router.put("/users/me/email", userController.updateUserEmail);
router.put("/users/me/password", userController.updateUserPassword);

export default router;
