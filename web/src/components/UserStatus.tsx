import { Button, Card, Divider, Row, Space, Spin, Typography } from "antd";
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
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };

  return (
    <Card title={`Customer ${user?.email}`} style={{ flex: 1 }}>
      <Row>
        <Text>Credit: {user?.deposit.toFixed(2)}</Text>
      </Row>

      <Spin spinning={isLoading}>
        <Divider orientation="left">Coins</Divider>
        <Space size={[8, 8]} wrap>
          {[100, 50, 20, 10, 5].map((coin) => (
            <Button type="primary" danger onClick={() => handleCoinClick(coin)}>
              {coin}
            </Button>
          ))}
        </Space>
      </Spin>
    </Card>
  );
};
