import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./routes/user";
import auth from "./routes/auth";

dotenv.config();

const app: Express = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "");

mongoose.connection.on("connected", () => {
  console.log("[info]: Connected to MongoDB");
});

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/test", (req, res) => {
  res.status(200).send();
});
app.use("/", auth);
app.use("/user", user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[info]: Server is running on port ${PORT}`);
});
