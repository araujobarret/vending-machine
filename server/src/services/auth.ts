import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User, UserPayload, userModel } from "../models/user";
import { getUserPayload } from "./user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const SALT_WORK_FACTOR = 10;

type AuthServiceError = {
  statusCode: number;
  code: AuthErrorCode;
  message: string;
};
type AuthErrorCode = "user_not_found" | "invalid_credentials";
type AuthError = Record<AuthErrorCode, AuthServiceError>;

interface LoginPayload {
  user: UserPayload;
  accessToken: string;
  jwtid: string;
}

export const login = async ({
  email,
  password,
}: Pick<User, "email" | "password">): Promise<
  LoginPayload | AuthServiceError
> => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return AUTH_ERROR.user_not_found;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return AUTH_ERROR.invalid_credentials;
  }

  // TODO: check for already logged-in session
  const { accessToken, jwtid } = createAccessToken({
    id: user.id,
    email: user.email,
  });
  await userModel.findOneAndUpdate(
    { _id: user.id },
    { $set: { activeTokenId: jwtid } }
  );

  return {
    user: getUserPayload(user),
    accessToken,
    jwtid,
  };
};

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

export const isAuthServiceError = (
  data: LoginPayload | AuthServiceError
): data is AuthServiceError => {
  return (data as AuthServiceError).code !== undefined;
};

const AUTH_ERROR: AuthError = {
  user_not_found: {
    statusCode: 404,
    code: "user_not_found",
    message: "User not found",
  },
  invalid_credentials: {
    statusCode: 400,
    code: "invalid_credentials",
    message: "Invalid credentials",
  },
};
