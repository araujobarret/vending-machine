import { useState } from "react";
import { User, UserRole } from "../../../types/user";
import { useUser } from "../../../hooks/useUser";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { AxiosResponse } from "axios";

type UpdateUserBody = {
  role: UserRole;
  deposit: number;
};

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, mutateUser } = useUser();
  const { user: userContext, changeUserRole } = useAuthContext();

  const updateUser = async (body: UpdateUserBody) => {
    if (!user || !userContext) {
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiWithToken(userContext.accessToken).patch<
        UpdateUserBody,
        AxiosResponse<User>
      >(`/user/${user.id}`, body);
      setIsLoading(false);
      mutateUser({ ...user, role: data.role, deposit: data.deposit });
      changeUserRole(data.role);
      return data;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      return null;
    }
  };

  return { updateUser, isLoading };
};
