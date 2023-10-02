import { useState } from "react";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { Product } from "../../../types/product";
import { useProducts } from "../../../hooks/useProducts";

export const useDeleteProduct = (product: Product) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateProducts, products } = useProducts();
  const { user } = useAuthContext();

  const deleteProduct = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiWithToken(user?.accessToken!).delete(
        `/product/${product._id}`
      );
      mutateProducts(products?.filter((p) => p._id !== product._id));
      setIsLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      return null;
    }
  };

  return { deleteProduct, isDeleteLoading: isLoading };
};
