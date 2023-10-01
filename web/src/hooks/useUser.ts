import useSWR from "swr";
import { useAuthContext } from "../providers/Auth";
import { fetcher } from "../services/api";
import { User } from "../types/user";

export const useUser = () => {
  const { user } = useAuthContext();
  const { data, error, isLoading, mutate } = useSWR(
    `/user/${user?.id}`,
    (url) => fetcher<User>(url, user?.accessToken!)
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutateUser: mutate,
  };
};
