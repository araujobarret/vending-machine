import { Button, Card, Row, Space, Spin, Typography, notification } from "antd";
import { useVendingMachineContext } from "../providers/VendingMachineProvider";
import { useBuy } from "../hooks/useBuy";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { useProducts } from "../hooks/useProducts";

const { Text } = Typography;

export const Basket: React.FC = () => {
  const { user, mutateUser } = useUser();
  const { products, mutateProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { total, amountOfProducts, userDeposit, product, reset } =
    useVendingMachineContext();
  const { buy } = useBuy();

  const isBuyButtonDisabled =
    userDeposit < total || userDeposit === 0 || amountOfProducts === 0;

  const handleBuyClick = () => {
    if (!product) {
      return;
    }

    setIsLoading(true);
    buy({ productId: product._id, amountOfProducts })
      .then(({ data }) => {
        mutateUser({ ...user!, deposit: user!.deposit - data.total });
        mutateProducts(
          products?.map((p) => {
            if (p._id === product._id) {
              return {
                ...p,
                amountAvailable: p.amountAvailable - amountOfProducts,
              };
            }
            return p;
          })
        );
        reset();
        api.success({
          duration: 5,
          message: "Success",
          description: `You've completed your order of total ${data.total.toFixed(
            2
          )} and received the change in coins: ${data.change}.`,
        });
      })
      .catch((e) => {
        api.error({
          message: "Error",
          description: e?.message,
        });
        console.error(e);
      })
      .finally(() => setIsLoading(false));
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
