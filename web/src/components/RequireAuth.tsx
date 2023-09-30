import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/Auth";

interface RequireAuthProps {
  children: React.ReactElement;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  let auth = useAuthContext();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
