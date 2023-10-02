import { Document, model, Schema } from "mongoose";
import { createPasswordHash } from "../services/auth";
import { productModel } from "./product";

export type Role = "buyer" | "seller";
export const roles: Role[] = ["buyer", "seller"];

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
  const user = this;

  try {
    user.password = createPasswordHash(user.password);
    next();
  } catch (e) {
    throw new Error("Internal server error");
  }
});

userSchema.post("findOneAndDelete", async function (doc) {
  try {
    await productModel.deleteMany({ sellerId: doc._id });
  } catch (e) {
    console.error(e);
    throw new Error("Internal server error");
  }
});

export const userModel = model<User>("user", userSchema);
