import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export type Role = "buyer" | "seller";
export const roles: Role[] = ["buyer", "seller"];

const SALT_WORK_FACTOR = 10;

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
  deposit: number;
}

export interface User extends Document, UserPayload {
  // id from Document is any, in order to suppress the error, we overwrite the type
  id: string;
  password: string;
  activeTokenId?: string;
}

const userSchema = new Schema<User>({
  // TODO: fix uniqueness of email
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: roles,
  },
  deposit: {
    type: Number,
    default: 0,
  },
  activeTokenId: String,
});

userSchema.pre("save", function (next) {
  var user = this;

  // generate a salt
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(user.password, salt);

  // TODO: error handling if hashing fails
  user.password = hash;
  next();
});

export const userModel = model<User>("user", userSchema);
