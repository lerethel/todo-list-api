import express from "express";
import * as userController from "../controllers/user.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/refresh", userController.refreshUser);
router.get("/logout", userController.logoutUser);

export default router;
