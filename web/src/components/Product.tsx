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
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";

import { Product as ProductType } from "../types/product";
import { useUser } from "../hooks/useUser";
import { useState } from "react";
import { useEditProduct } from "../hooks/useEditProduct";
import { useProducts } from "../hooks/useProducts";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
interface ProductProps {
  product: ProductType;
  onEdit: () => void;
}

export const Product: React.FC<ProductProps> = ({
  product,
  onEdit: onEditCallback,
}) => {
  const [name, setName] = useState(product.productName);
  const [cost, setCost] = useState(product.cost);
  const [amount, setAmount] = useState(product.amountAvailable);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { editProduct } = useEditProduct();
  const { deleteProduct } = useDeleteProduct();
  const [api, contextHolder] = notification.useNotification();
  const { mutateProducts, products } = useProducts();

  const isTouched =
    product.cost !== cost ||
    product.amountAvailable !== amount ||
    product.productName !== name;
  const isValid = cost > 0 && amount > 0 && name.length > 1;

  const onDelete = () => {
    setIsLoading(true);
    deleteProduct(product._id)
      .then(() => {
        mutateProducts(products?.filter((p) => p._id !== product._id));
        api.success({ message: "Product removed with success" });
        onEditCallback();
      })
      .catch((e) => {})
      .finally(() => setIsLoading(false));
  };

  const onEdit = () => {
    setIsLoading(true);
    editProduct(
      { productName: name, cost, amountAvailable: amount },
      product._id
    )
      .then(({ data }) => {
        mutateProducts(
          products?.map((p) => {
            if (p._id === data.id) {
              return {
                ...p,
                ...data,
              };
            }
            return p;
          })
        );
        api.success({ message: "Success" });
        onEditCallback();
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
    <Card title={product.productName}>
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
            <Space size={[10, 10]}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                disabled={!isTouched || !isValid}
                onClick={onEdit}
              >
                Save
              </Button>
              {user?.id === product.sellerId && (
                <Button
                  danger
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
            </Space>
          </Row>
        </Space>
      </Spin>
    </Card>
  );
};
