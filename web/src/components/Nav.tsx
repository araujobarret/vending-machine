import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../providers/Auth";

export const Nav: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  let items = unAuthenticatedItems;
  if (!!user) {
    items = user.role === "buyer" ? buyerItems : sellerItems;
  }

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      onClick={({ key }) => navigate(`/${key}`)}
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
];

const sellerItems = [
  { key: "vending-machine", label: "Vending Machine" },
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
];
