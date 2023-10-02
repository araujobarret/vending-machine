export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginPayload {
  user: User;
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  deposit: number;
  role: UserRole;
}

export interface UserWithToken extends User {
  accessToken: string;
}

export type UserRole = "seller" | "buyer";
