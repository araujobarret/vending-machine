import { AxiosResponse } from "axios";
import { useAuthContext } from "../providers/Auth";
import { apiWithToken } from "../services/api";
import { Product } from "../types/product";

type SaveProductBody = {
  productName: string;
  cost: number;
  amountAvailable: number;
};

export const useSaveProduct = () => {
  const { user } = useAuthContext();

  const saveProduct = (body: SaveProductBody) => {
    return apiWithToken(user?.accessToken!).post<
      SaveProductBody,
      AxiosResponse<Product>
    >("/product", body);
  };

  return { saveProduct };
};
