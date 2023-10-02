import {
  Button,
  Card,
  Divider,
  Row,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import { useUser } from "../../../hooks/useUser";
import { useDeposit } from "../hooks/useDeposit";

const { Text } = Typography;

export const UserStatus: React.FC = () => {
  const { user } = useUser();
  const { deposit, isLoading } = useDeposit();
  const [api, contextHolder] = notification.useNotification();

  const handleCoinClick = async (coin: number) => {
    const data = await deposit(coin);
    if (data) {
      api.success({
        message: "Success",
        description: `You've deposited a coin of ${coin} cents.`,
      });
    } else {
      api.error({
        message: "Error",
        description: "Error depositing the coin, try again.",
      });
    }
  };

  return (
    <Card title={`Customer ${user?.email}`} style={{ flex: 1 }}>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Row>
          <Text>Credit: {user?.deposit.toFixed(2)}</Text>
        </Row>

        <Divider orientation="left">Deposit Coins</Divider>
        <Space size={[8, 8]} wrap>
          {[100, 50, 20, 10, 5].map((coin) => (
            <Button
              type="primary"
              onClick={() => handleCoinClick(coin)}
              key={`coin-${coin}`}
            >
              {coin}
            </Button>
          ))}
        </Space>
        <Divider orientation="left">More functions</Divider>
        <Button type="primary" danger>
          Reset coins
        </Button>
      </Spin>
    </Card>
  );
};
