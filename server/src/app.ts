import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import user from "./routes/user";
import auth from "./routes/auth";

dotenv.config();

const app: Express = express();

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
  console.log(`Server is running on port ${PORT}`);
});
