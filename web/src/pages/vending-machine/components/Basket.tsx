import { Button, Card, Row, Space, Spin, Typography, notification } from "antd";
import { useVendingMachineContext } from "../providers/VendingMachineProvider";
import { useBuy } from "../hooks/useBuy";

const { Text } = Typography;

export const Basket: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const { total, amountOfProducts, userDeposit } = useVendingMachineContext();
  const { buy, isLoading } = useBuy();

  const isBuyButtonDisabled =
    userDeposit < total || userDeposit === 0 || amountOfProducts === 0;

  const handleBuyClick = async () => {
    const data = await buy();
    if (data) {
      api.success({
        duration: 5,
        message: "Success",
        description: `You've completed your order of total ${data.total.toFixed(
          2
        )} and received the change in coins: ${data.change}.`,
      });
    } else {
      api.error({
        message: "Error",
        description: "Error completing the order, try again.",
      });
    }
  };

  return (
    <Card title="Order" style={{ flex: 1 }}>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Space size={[20, 20]} direction="vertical">
          <Row>
            <Text>Total: {total.toFixed(2)}</Text>
          </Row>

          <Row>
            <Text>Quantity: {amountOfProducts}</Text>
          </Row>

          <Row>
            <Button
              type="primary"
              disabled={isBuyButtonDisabled}
              onClick={handleBuyClick}
            >
              Buy now
            </Button>
          </Row>
        </Space>
      </Spin>
    </Card>
  );
};
