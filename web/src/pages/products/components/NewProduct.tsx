import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  notification,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSaveProduct } from "../hooks/useSaveProduct";
import { useProducts } from "../../../hooks/useProducts";

export const NewProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { saveProduct } = useSaveProduct();
  const [api, contextHolder] = notification.useNotification();
  const { mutateProducts, products } = useProducts();

  const isValid = name.length > 1 && cost > 0 && amount > 0;

  const onSubmit = () => {
    setIsLoading(true);
    saveProduct({
      productName: name,
      cost,
      amountAvailable: amount,
    })
      .then(({ data }) => {
        mutateProducts([...products!, data]);
        setName("");
        setCost(0);
        setAmount(0);
        api.success({ message: "Success" });
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
    <Card title="New Product">
      {contextHolder}
      <Spin spinning={isLoading}>
        <Space size={[10, 10]} direction="vertical">
          <Row>
            <Col span={12}>Product Name</Col>
            <Col span={12}>
              <Input
                onChange={({ currentTarget }) => setName(currentTarget.value)}
                value={name}
              />
            </Col>
          </Row>

          <Row>
            <Col span={12}>Cost</Col>
            <Col span={12}>
              <InputNumber
                step="0.05"
                min="0.05"
                max="999.99"
                value={cost.toString()}
                onChange={(value) => {
                  if (value) {
                    setCost(parseFloat(value));
                  }
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col span={12}>Amount Available</Col>
            <Col span={12}>
              <InputNumber
                min="1"
                max="999"
                step="1"
                value={amount.toString()}
                onChange={(value) => {
                  if (value) {
                    setAmount(parseInt(value));
                  }
                }}
              />
            </Col>
          </Row>

          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              disabled={!isValid}
              onClick={onSubmit}
            >
              Save
            </Button>
          </Row>
        </Space>
      </Spin>
    </Card>
  );
};
