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
  const date = new Date();
  // don't care about the slight seconds diff from original exp
  const exp = date.setDate(date.getDate() + 7);
  return {
    accessToken: jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
      jwtid: uuid,
    }),
    jwtid: uuid,
    exp,
  };
};

export const createPasswordHash = (password: string) => {
  // generate a salt
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(password, salt);

  // TODO: error handling if hashing fails
  return hash;
};
