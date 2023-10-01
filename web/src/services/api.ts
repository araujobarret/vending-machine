import axios, { AxiosResponse } from "axios";

const baseURL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiWithToken = (accessToken: string) =>
  axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const fetcher = <T>(url: string, accessToken: string): Promise<T> =>
  apiWithToken(accessToken)
    .get(url)
    .then((res: AxiosResponse<T>) => res.data);
