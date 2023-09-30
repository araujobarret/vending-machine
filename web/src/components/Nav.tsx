import { Menu } from "antd";
import { useLocation } from "react-router-dom";

export const Nav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[pathname.replace("/", "")]}
      items={buyerItems}
    />
  );
};

const buyerItems = [
  { key: "login", label: "Login" },
  { key: "vending-machine", label: "Vending Machine" },
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
];

const sellerItems = [
  { key: "vending-machine", label: "Vending Machine" },
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
];
