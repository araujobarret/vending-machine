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
        if (key !== "logout") {
          navigate(`/${key}`);
          return;
        }
        logout();
        navigate("/login");
      }}
      selectedKeys={[pathname.replace("/", "")]}
      items={items}
    />
  );
};

const unAuthenticatedItems = [
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
];

const buyerItems = [
  { key: "vending-machine", label: "Vending Machine" },
  { key: "users", label: "Users" },
  { key: "logout", label: "Logout" },
];

const sellerItems = [
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
  { key: "logout", label: "Logout" },
];
