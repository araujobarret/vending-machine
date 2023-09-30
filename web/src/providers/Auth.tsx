import React from "react";
import { fakeAuthProvider } from "../services/auth";

interface AuthContextType {
  user: any;
  login: (user: string, callback: VoidFunction) => void;
  logout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = React.useState<any>(null);

  let login = (email: string, callback: VoidFunction) => {
    return fakeAuthProvider.login(() => {
      setUser(email);
      callback();
    });
  };

  let logout = (callback: VoidFunction) => {
    return fakeAuthProvider.logout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};
