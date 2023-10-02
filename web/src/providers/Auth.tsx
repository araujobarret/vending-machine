import React from "react";
import { UserRole, UserWithToken } from "../types/user";

interface AuthContextType {
  user: UserWithToken | null;
  isAuthenticated: boolean;
  login: (user: UserWithToken, callback?: VoidFunction) => void;
  logout: (callback?: VoidFunction) => void;
  changeUserRole: (role: UserRole) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: re-check permissions if has changed
  let [user, setUser] = React.useState<UserWithToken | null>(() =>
    getLocalStorageUser()
  );

  const isAuthenticated = !!user;

  let login = (user: UserWithToken, callback?: VoidFunction) => {
    setUser(user);
    setLocalStorageUser(user);
    callback?.();
  };

  let logout = (callback?: VoidFunction) => {
    setUser(null);
    deleteLocalStorageUser();
    callback?.();
  };

  let changeUserRole = (role: UserRole) => {
    if (!user || role === user.role) {
      return;
    }

    const newUser = { ...user, role };
    setLocalStorageUser(newUser);
    setUser(newUser);
  };

  let value = { user, isAuthenticated, login, logout, changeUserRole };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};

const STORAGE_KEY = "vending-machine-user";

const setLocalStorageUser = (user: UserWithToken) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const getLocalStorageUser = (): UserWithToken | null => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return user.id ? user : null;
  } catch (e) {
    return null;
  }
};

const deleteLocalStorageUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
