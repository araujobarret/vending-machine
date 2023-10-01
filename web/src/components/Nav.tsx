import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../providers/Auth";

export const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      onClick={({ key }) => navigate(`/${key}`)}
      selectedKeys={[pathname.replace("/", "")]}
      items={isAuthenticated ? sellerItems : buyerItems}
    />
  );
};

const buyerItems = [
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
];

const sellerItems = [
  { key: "vending-machine", label: "Vending Machine" },
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
];
