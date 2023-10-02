import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useAuthContext } from "../../../providers/Auth";
import { apiWithToken } from "../../../services/api";
import { User } from "../../../types/user";
import { useVendingMachineContext } from "../providers/VendingMachineProvider";
import { useUser } from "../../../hooks/useUser";

type DepositBody = {
  coin: number;
};

export const useDeposit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userDeposit, setUserDeposit } = useVendingMachineContext();
  const { user: userContext } = useAuthContext();
  const { user, mutateUser } = useUser();

  const currentDeposit = user?.deposit ?? 0;
  const userDepositHasChanged = user?.deposit !== userDeposit;

  useEffect(() => {
    if (userDepositHasChanged && currentDeposit !== 0) {
      setUserDeposit(currentDeposit);
    }
  }, [userDepositHasChanged, currentDeposit, setUserDeposit]);

  const deposit = async (coin: number) => {
    setIsLoading(true);
    try {
      const { data } = await apiWithToken(userContext?.accessToken!).post<
        DepositBody,
        AxiosResponse<User>
      >("/deposit", { coin });
      mutateUser({ ...user!, deposit: data.deposit });
      setIsLoading(false);
      return data;
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      return null;
    }
  };

  return { deposit, isLoading };
};
