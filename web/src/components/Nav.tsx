import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../providers/Auth";

export const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  let items = unAuthenticatedItems;
  if (!!user) {
    items = user.role === "buyer" ? buyerItems : sellerItems;
  }

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      onClick={({ key }) => {
        if (key !== "/logout") {
          navigate(`${key}`);
          return;
        }
        logout();
        navigate("/");
      }}
      selectedKeys={[pathname]}
      items={items}
    />
  );
};

const unAuthenticatedItems = [
  { key: "/", label: "Login" },
  { key: "/register", label: "Register" },
];

const buyerItems = [
  { key: "/", label: "Vending Machine" },
  { key: "/users", label: "Users" },
  { key: "/logout", label: "Logout" },
];

const sellerItems = [
  { key: "/", label: "Products" },
  { key: "/users", label: "Users" },
  { key: "/logout", label: "Logout" },
];
