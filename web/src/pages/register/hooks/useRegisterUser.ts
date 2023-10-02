import { AxiosResponse } from "axios";
import { api } from "../../../services/api";
import { User } from "../../../types/user";

type UserBody = {
  email: string;
  password: string;
  role: "buyer" | "seller";
};

export const useRegisterUser = () => {
  const register = (body: UserBody) => {
    return api.post<UserBody, AxiosResponse<User>>("/user", body);
  };

  return { register };
};
