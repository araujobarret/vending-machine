import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");

  if (!authorization || !authorization.includes("Bearer ")) {
    return res.status(401).send();
  }

  try {
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET);
    const payload = jwt.decode(token) as jwt.JwtPayload;

    // Check if the token still valid in the database
    const user = await userModel.findOne({
      _id: payload.user?.id,
      activeTokenId: payload.jti,
    });

    if (!user) {
      return res.sendStatus(401);
    }

    res.locals.user = payload.user;
    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
};
