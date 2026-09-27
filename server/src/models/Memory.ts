import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMemory extends Document {
  ownerId: Types.ObjectId;

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
    latitude?: number;
    longitude?: number;
  };

  aiStatus: "not_processed" | "processing" | "processed" | "failed";

  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    media: [
      {
        url: {
          type: String,
          required: true,
        },

        storageKey: {
          type: String,
          required: true,
        },

        mimeType: {
          type: String,
          required: true,
        },

        size: {
          type: Number,
        },
      },
    ],

    capturedAt: {
      type: Date,
    },

    location: {
      name: {
        type: String,
        trim: true,
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    aiStatus: {
      type: String,
      enum: [
        "not_processed",
        "processing",
        "processed",
        "failed",
      ],
      default: "not_processed",
    },
  },
  {
    timestamps: true,
  }
);

const Memory = mongoose.model<IMemory>("Memory", memorySchema);

export default Memory;