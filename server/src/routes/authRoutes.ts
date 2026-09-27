import { Router } from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

router.get("/me", protect, getCurrentUser);

export default router;