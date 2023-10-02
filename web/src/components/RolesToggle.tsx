import { Radio } from "antd";
import { UserRole } from "../types/user";

const options = [
  { label: "Buyer", value: "buyer" },
  { label: "Seller", value: "seller" },
];

interface RolesToggleProps {
  role: UserRole;
  onSelect: (role: UserRole) => void;
}

export const RolesToggle: React.FC<RolesToggleProps> = ({ role, onSelect }) => {
  return (
    <Radio.Group
      options={options}
      onChange={({ target }) => onSelect(target.value)}
      value={role}
      optionType="button"
    />
  );
};
