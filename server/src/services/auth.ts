import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { User } from "../models/user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const createAccessToken = (user: User) => {
  const payload = {
    user: {
      id: user.id,
      email: user.email,
    },
  };
  const uuid = randomUUID();
  return {
    accessToken: jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
      jwtid: uuid,
    }),
    jwtid: uuid,
  };
};
