import { useState } from "react";
import { AxiosResponse } from "axios";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { Product } from "../../../types/product";
import { useProducts } from "../../../hooks/useProducts";

type UpdateProductBody = {
  productName: string;
  cost: number;
  amountAvailable: number;
};

export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateProducts, products } = useProducts();
  const { user } = useAuthContext();

  const updateProduct = async ({
    productName,
    cost,
    amountAvailable,
    _id,
  }: Product) => {
    try {
      const { data } = await apiWithToken(user?.accessToken!).put<
        UpdateProductBody,
        AxiosResponse<Product>
      >(`/product/${_id}`, { productName, cost, amountAvailable });
      mutateProducts(
        products?.map((p) => {
          if (p._id === data.id) {
            return {
              ...p,
              ...data,
            };
          }
          return p;
        })
      );
      setIsLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      return null;
    }
  };

  return { updateProduct, isUpdateLoading: isLoading };
};
