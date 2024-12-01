import express from "express";
import * as userController from "../controllers/user.js";

const router = express.Router();

router.post("/users/signup", userController.signupUser);
router.post("/users/login", userController.loginUser);
router.get("/users/refresh", userController.refreshUser);
router.post("/users/logout", userController.logoutUser);

router.get("/users/me/", userController.getUser);
router.put("/users/me/name", userController.updateUserName);
router.put("/users/me/email", userController.updateUserEmail);
router.put("/users/me/password", userController.updateUserPassword);
router.post("/users/me/delete", userController.deleteUser);

export default router;
