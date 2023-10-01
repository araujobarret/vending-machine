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
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import { useVendingMachineContext } from "../providers/VendingMachineProvider";
import { useDeposit } from "../hooks/useDeposit";

const { Text } = Typography;

export const UserStatus: React.FC = () => {
  const { user, mutateUser } = useUser();
  const { userDeposit, setUserDeposit } = useVendingMachineContext();
  const [isLoading, setIsLoading] = useState(false);
  const { deposit } = useDeposit();
  const [api, contextHolder] = notification.useNotification();

  const currentDeposit = user?.deposit ?? 0;
  const userDepositHasChanged = user?.deposit !== userDeposit;

  useEffect(() => {
    if (userDepositHasChanged && currentDeposit !== 0) {
      setUserDeposit(currentDeposit);
    }
  }, [userDepositHasChanged, currentDeposit, setUserDeposit]);

  const handleCoinClick = (coin: number) => {
    setIsLoading(true);
    deposit(coin)
      .then(({ data }) => {
        mutateUser({ ...user!, deposit: data.deposit });
        api.success({
          message: "Success",
          description: `You've deposited a coin of ${coin} cents.`,
        });
      })
      .catch((e) => {
        console.error(e);
        api.error({
          message: "Error",
          description: e?.message,
        });
      })
      .finally(() => setIsLoading(false));
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
            <Button type="primary" onClick={() => handleCoinClick(coin)}>
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
