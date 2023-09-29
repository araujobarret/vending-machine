import { Role, UserPayload, userModel } from "../models/user";
import { convertCoinToFloat } from "../utils/money";

export const saveUser = async ({
  email,
  role,
  password,
}: {
  email: string;
  role: Role;
  password: string;
}): Promise<UserPayload> => {
  const user = new userModel({ email, role, password });

  const data = await user.save();

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    deposit: data.deposit,
  };
};

export const unsetActiveTokenId = async (id: string) => {
  await userModel.findOneAndUpdate(
    { _id: id },
    { $unset: { activeTokenId: true } }
  );
};

export const deleteUser = (id: string) => {
  return userModel.findOneAndDelete({ _id: id });
};

export const getUser = async (id: string): Promise<UserPayload | null> => {
  const user = await userModel.findOne({ _id: id });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    deposit: user.deposit,
  };
};

export const incrementUserDeposit = async ({
  id,
  coin,
}: {
  id: string;
  coin: number;
}): Promise<UserPayload | null> => {
  const user = await userModel.findOneAndUpdate(
    {
      _id: id,
    },
    { $inc: { deposit: convertCoinToFloat(coin) } },
    { new: true }
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    deposit: user.deposit,
  };
};

export const resetUserDeposit = async (
  id: string
): Promise<UserPayload | null> => {
  const user = await userModel.findOneAndUpdate(
    {
      _id: id,
    },
    { $set: { deposit: 0 } },
    { new: true }
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    deposit: user.deposit,
  };
};
