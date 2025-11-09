import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGODB_URI;

// connect MongoDB
(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
})();

// api routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// production build
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static("./Frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Frontend/dist", "index.html"));
  });
}

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server is Running on port ${PORT}`);
});

