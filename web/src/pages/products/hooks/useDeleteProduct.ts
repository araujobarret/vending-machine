import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";

export const useDeleteProduct = () => {
  const { user } = useAuthContext();

  const deleteProduct = (productId: string) => {
    return apiWithToken(user?.accessToken!).delete(`/product/${productId}`);
  };

  return { deleteProduct };
};
