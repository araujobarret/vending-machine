import { AxiosResponse } from "axios";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { Product } from "../../../types/product";

type EditProductBody = {
  productName: string;
  cost: number;
  amountAvailable: number;
};

export const useEditProduct = () => {
  const { user } = useAuthContext();

  const editProduct = (body: EditProductBody, productId: string) => {
    return apiWithToken(user?.accessToken!).put<
      EditProductBody,
      AxiosResponse<Product>
    >(`/product/${productId}`, body);
  };

  return { editProduct };
};
