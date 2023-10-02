import { AxiosResponse } from "axios";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useVendingMachineContext } from "../providers/VendingMachineProvider";
import { useUser } from "../../../hooks/useUser";

type BuyBody = {
  productId: string;
  amountOfProducts: number;
};

type BuyPayload = {
  change: number[];
  total: number;
};

export const useBuy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, mutateUser } = useUser();
  const { user: userContext } = useAuthContext();
  const { products, mutateProducts } = useProducts();
  const { amountOfProducts, product, reset } = useVendingMachineContext();

  const buy = async () => {
    if (!product) {
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiWithToken(userContext?.accessToken!).post<
        BuyBody,
        AxiosResponse<BuyPayload>
      >("/buy", { productId: product._id, amountOfProducts });
      mutateUser({ ...user!, deposit: user!.deposit - data.total });
      mutateProducts(
        products?.map((p) => {
          if (p._id === product._id) {
            return {
              ...p,
              amountAvailable: p.amountAvailable - amountOfProducts,
            };
          }
          return p;
        })
      );
      reset();
      setIsLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      return null;
    }
  };

  return { buy, isLoading };
};
