import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import memoryRoutes from "./routes/memoryRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "ECHO API is running",
  });
});

app.listen(PORT, () => {
  console.log(`ECHO server running on port ${PORT}`);
});