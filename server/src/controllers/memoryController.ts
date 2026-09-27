import type { Response } from "express";
import mongoose from "mongoose";

import Memory from "../models/Memory.js";
import cloudinary from "../config/cloudinary.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const createMemory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const file = req.file;

    const {
      title,
      description,
      capturedAt,
      locationName,
    } = req.body;

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "echo/memories",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error ??
                new Error("Cloudinary upload failed")
            );

            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      stream.end(file.buffer);
    });

    const memoryData: {
      ownerId: mongoose.Types.ObjectId;
      title?: string;
      description?: string;

      media: {
        url: string;
        storageKey: string;
        mimeType: string;
        size?: number;
      }[];

      capturedAt?: Date;

      location?: {
        name?: string;
      };

      aiStatus: "not_processed";
    } = {
      ownerId: new mongoose.Types.ObjectId(
        req.userId
      ),

      media: [
        {
          url: uploadResult.secure_url,
          storageKey: uploadResult.public_id,
          mimeType: file.mimetype,
          size: file.size,
        },
      ],

      aiStatus: "not_processed",
    };

    if (title) {
      memoryData.title = title;
    }

    if (description) {
      memoryData.description = description;
    }

    if (capturedAt) {
      const parsedDate = new Date(capturedAt);

      if (!Number.isNaN(parsedDate.getTime())) {
        memoryData.capturedAt = parsedDate;
      }
    }

    if (locationName) {
      memoryData.location = {
        name: locationName,
      };
    }

    const memory = await Memory.create(
      memoryData
    );

    return res.status(201).json({
      message: "Memory created successfully",
      memory,
    });
  } catch (error) {
    console.error(
      "Create memory error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create memory",
    });
  }
};

export const getMemories = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const memories = await Memory.find({
      ownerId: req.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      memories,
    });
  } catch (error) {
    console.error("Get memories error:", error);

    return res.status(500).json({
      message: "Failed to fetch memories",
    });
  }
};

export const getMemoryById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const memoryId = req.params.id;

    if (
      typeof memoryId !== "string" ||
      !mongoose.Types.ObjectId.isValid(memoryId)
    ) {
      return res.status(400).json({
        message: "Invalid memory ID",
      });
    }

    const memory = await Memory.findOne({
      _id: new mongoose.Types.ObjectId(memoryId),
      ownerId: new mongoose.Types.ObjectId(req.userId),
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    return res.status(200).json({
      memory,
    });
  } catch (error) {
    console.error("Get memory by id error:", error);

    return res.status(500).json({
      message: "Failed to fetch memory",
    });
  }
};

export const updateMemory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const memoryId = req.params.id;

    if (
      typeof memoryId !== "string" ||
      !mongoose.Types.ObjectId.isValid(memoryId)
    ) {
      return res.status(400).json({
        message: "Invalid memory ID",
      });
    }

    const memory = await Memory.findOne({
      _id: new mongoose.Types.ObjectId(memoryId),
      ownerId: new mongoose.Types.ObjectId(req.userId),
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    const {
      title,
      description,
      capturedAt,
      locationName,
    } = req.body;

    if (title !== undefined) {
      memory.title = title;
    }

    if (description !== undefined) {
      memory.description = description;
    }

    if (capturedAt !== undefined) {
        if (capturedAt === "") {
        memory.set("capturedAt", undefined);
      } else {
        const parsedDate = new Date(capturedAt);

        if (!Number.isNaN(parsedDate.getTime())) {
          memory.capturedAt = parsedDate;
        }
      }
    }

    if (locationName !== undefined) {
      if (locationName === "") {
        memory.set("location", undefined);
      } else {
        memory.location = {
          name: locationName,
        };
      }
    }

    await memory.save();

    return res.status(200).json({
      message: "Memory updated successfully",
      memory,
    });
  } catch (error) {
    console.error("Update memory error:", error);

    return res.status(500).json({
      message: "Failed to update memory",
    });
  }
};

export const deleteMemory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const memoryId = req.params.id;

    if (
      typeof memoryId !== "string" ||
      !mongoose.Types.ObjectId.isValid(memoryId)
    ) {
      return res.status(400).json({
        message: "Invalid memory ID",
      });
    }

    const memory = await Memory.findOne({
      _id: new mongoose.Types.ObjectId(memoryId),
      ownerId: new mongoose.Types.ObjectId(req.userId),
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found",
      });
    }

    for (const media of memory.media) {
      await cloudinary.uploader.destroy(media.storageKey);
    }

    await memory.deleteOne();

    return res.status(200).json({
      message: "Memory deleted successfully",
    });
  } catch (error) {
    console.error("Delete memory error:", error);

    return res.status(500).json({
      message: "Failed to delete memory",
    });
  }
};