import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { UserPayload } from "../models/user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const SALT_WORK_FACTOR = 10;

export const createAccessToken = (user: Pick<UserPayload, "id" | "email">) => {
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

export const createPasswordHash = (password: string) => {
  // generate a salt
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(password, salt);

  // TODO: error handling if hashing fails
  return hash;
};
