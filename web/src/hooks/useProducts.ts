import useSWR from "swr";
import { useAuthContext } from "../providers/Auth";
import { fetcher } from "../services/api";
import { Product } from "../types/product";

export const useProducts = () => {
  const { user } = useAuthContext();
  const { data, error, isLoading, mutate } = useSWR(`/products`, (url) =>
    fetcher<Product[]>(url, user?.accessToken!)
  );

  return {
    products: data,
    isLoading,
    isError: error,
    mutateProducts: mutate,
  };
};
