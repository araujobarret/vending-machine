import axios from "axios";

const baseURL = process.env.API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
