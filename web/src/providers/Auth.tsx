import React from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, callback?: VoidFunction) => void;
  logout: (callback?: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: re-check permissions if has changed
  let [user, setUser] = React.useState<User | null>(() =>
    getLocalStorageUser()
  );

  let login = (user: User, callback?: VoidFunction) => {
    setUser(user);
    setLocalStorageUser(user);
    callback?.();
  };

  let logout = (callback?: VoidFunction) => {
    setUser(null);
    callback?.();
  };

  let value = { user, isAuthenticated: !!user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};

interface User {
  email: string;
  accessToken: string;
}

const STORAGE_KEY = "vending-machine-user";

const setLocalStorageUser = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const getLocalStorageUser = (): User | null => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return user.email ? user : null;
  } catch (e) {
    return null;
  }
};
