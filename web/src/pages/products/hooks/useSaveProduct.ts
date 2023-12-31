import { useState } from "react";
import { AxiosResponse } from "axios";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { Product } from "../../../types/product";
import { useProducts } from "../../../hooks/useProducts";

type SaveProductBody = {
  productName: string;
  cost: number;
  amountAvailable: number;
};

export const useSaveProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const { mutateProducts, products } = useProducts();

  const saveProduct = async (body: SaveProductBody) => {
    setIsLoading(true);
    try {
      const { data } = await apiWithToken(user?.accessToken!).post<
        SaveProductBody,
        AxiosResponse<Product>
      >("/product", body);
      mutateProducts([...products!, data]);
      setIsLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      return null;
    }
  };

  return { saveProduct, isSaveLoading: isLoading };
};
