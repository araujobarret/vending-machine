import { AxiosResponse } from "axios";
import { useAuthContext } from "../providers/Auth";
import { apiWithToken } from "../services/api";
import { User } from "../types/user";

type DepositBody = {
  coin: number;
};

export const useDeposit = () => {
  const { user } = useAuthContext();

  const deposit = (coin: number) => {
    return apiWithToken(user?.accessToken!).post<
      DepositBody,
      AxiosResponse<User>
    >("/deposit", { coin });
  };

  return { deposit };
};
