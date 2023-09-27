import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("authorization");

  if (!authorization || !authorization.includes("Bearer ")) {
    return res.status(401).send();
  }

  try {
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    next();
  } catch (err) {
    res.status(401).send();
  }
}
