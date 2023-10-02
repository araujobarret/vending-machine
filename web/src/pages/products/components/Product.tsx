import { useEffect, useState } from "react";
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
import { Product as ProductType } from "../../../types/product";
import { useUser } from "../../../hooks/useUser";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
interface ProductProps {
  product: ProductType;
  onChange: () => void;
}

export const Product: React.FC<ProductProps> = ({
  product: productProp,
  onChange,
}) => {
  const [product, setProduct] = useState(() => productProp);

  const { user } = useUser();
  const { updateProduct, isUpdateLoading } = useUpdateProduct();
  const { deleteProduct, isDeleteLoading } = useDeleteProduct(productProp);
  const [api, contextHolder] = notification.useNotification();

  const isTouched =
    productProp.cost !== product.cost ||
    productProp.amountAvailable !== product.amountAvailable ||
    productProp.productName !== product.productName;
  const isValid =
    product.cost > 0 &&
    product.amountAvailable > 0 &&
    product.productName.length > 1;

  useEffect(() => {
    if (productProp._id !== product._id) {
      setProduct(productProp);
    }
  }, [product, productProp]);

  const onDelete = async () => {
    const data = await deleteProduct();
    if (data) {
      api.success({ message: "Product removed with success." });
      onChange();
    } else {
      api.success({ message: "Error removing the product." });
    }
  };

  const onEdit = async () => {
    const data = await updateProduct(product);
    if (data) {
      api.success({ message: "Success updating the product" });
    } else {
      api.error({ message: "Error updating the product" });
    }
  };

  return (
    <Card title="Edit Product">
      {contextHolder}
      <Spin spinning={isUpdateLoading || isDeleteLoading}>
        <Space size={[10, 10]} direction="vertical">
          <Row>
            <Col span={12}>Product Name</Col>
            <Col span={12}>
              <Input
                onChange={({ currentTarget }) =>
                  setProduct({ ...product, productName: currentTarget.value })
                }
                value={product.productName}
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
                value={product.cost.toString()}
                onChange={(value) => {
                  if (value) {
                    setProduct({ ...product, cost: parseFloat(value) });
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
                value={product.amountAvailable.toString()}
                onChange={(value) => {
                  if (value) {
                    setProduct({
                      ...product,
                      amountAvailable: parseInt(value),
                    });
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
              {user?.id === productProp.sellerId && (
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
