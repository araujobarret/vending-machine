import { Col, Row } from "antd";
import { Products } from "../../components/Products";
import { Basket } from "./components/Basket";
import { VendingMachineProvider } from "./providers/VendingMachineProvider";
import { UserStatus } from "./components/UserStatus";

export const VendingMachinePage: React.FC = () => {
  return (
    <VendingMachineProvider>
      <Row gutter={40}>
        <Col span={10}>
          <Products />
        </Col>

        <Col span={8}>
          <Row gutter={40} style={{ display: "flex" }}>
            <Basket />
          </Row>
          <Row gutter={40}>
            <UserStatus />
          </Row>
        </Col>
      </Row>
    </VendingMachineProvider>
  );
};
