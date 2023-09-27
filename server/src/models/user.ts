import { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export type Role = "buyer" | "seller";
export const roles: Role[] = ["buyer", "seller"];

const SALT_WORK_FACTOR = 10;

interface User extends Document {
  id?: string;
  email: string;
  password: string;
  role: Role;
  deposit: number;
  activeToken?: string;
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
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
  activeToken: String,
});

userSchema.pre("save", function (next) {
  var user = this;

  // generate a salt
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(user.password, salt);

  // TODO: error control if hashing fails
  user.password = hash;
  next();
});

export const userModel: Model<User> = model<User>("user", userSchema);
