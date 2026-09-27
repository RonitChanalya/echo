import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} from "../controllers/memoryController.js";

const router = Router();

router.get("/", protect, getMemories);

router.get("/:id", protect, getMemoryById);

router.post(
  "/",
  protect,
  upload.single("image"),
  createMemory
);

router.patch(
  "/:id",
  protect,
  updateMemory
);

router.delete(
  "/:id",
  protect,
  deleteMemory
);

export default router;