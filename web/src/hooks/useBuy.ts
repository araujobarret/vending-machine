import { AxiosResponse } from "axios";
import { useAuthContext } from "../providers/Auth";
import { apiWithToken } from "../services/api";

type BuyBody = {
  productId: string;
  amountOfProducts: number;
};

type BuyPayload = {
  change: number[];
  total: number;
};

export const useBuy = () => {
  const { user } = useAuthContext();

  const buy = (body: BuyBody) => {
    return apiWithToken(user?.accessToken!).post<
      BuyBody,
      AxiosResponse<BuyPayload>
    >("/buy", body);
  };

  return { buy };
};
