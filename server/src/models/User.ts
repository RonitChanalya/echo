import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;