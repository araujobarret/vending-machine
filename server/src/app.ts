import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./routes/user";
import auth from "./routes/auth";
import product from "./routes/product";
import products from "./routes/products";
import deposit from "./routes/deposit";
import buy from "./routes/buy";
import reset from "./routes/reset";

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "");
mongoose.connection.on("connected", () => {
  console.log("[info]: Connected to MongoDB");
});

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/", auth);
app.use("/user", user);
app.use("/product", product);
app.use("/products", products);
app.use("/deposit", deposit);
app.use("/buy", buy);
app.use("/reset", reset);

const PORT = process.env.PORT || 5000;
export const server = app.listen(PORT, () => {
  console.log(`[info]: Server is running on port ${PORT}`);
});

export default app;
