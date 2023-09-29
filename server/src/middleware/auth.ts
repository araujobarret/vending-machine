import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");

  if (!authorization || !authorization.includes("Bearer ")) {
    return res.sendStatus(401);
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

// No harm on having some duplicated code in checkSellerPermission and checkBuyerPermission
export const checkSellerPermission = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await userModel.findById(res.locals.user.id);

  if (!user) {
    return res.sendStatus(401);
  }

  if (user.role === "buyer") {
    return res.sendStatus(403);
  }

  return next();
};

export const checkBuyerPermission = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await userModel.findById(res.locals.user.id);

  if (!user) {
    return res.sendStatus(401);
  }

  if (user.role === "seller") {
    return res.sendStatus(403);
  }

  return next();
};
