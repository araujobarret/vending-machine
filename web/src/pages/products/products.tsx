import { useState } from "react";
import { Products } from "../../components/Products";
import { Product as ProductType } from "../../types/product";
import { Button, Col, Row } from "antd";
import { Product } from "./components/Product";
import { NewProduct } from "./components/NewProduct";

export const ProductsPage: React.FC = () => {
  const [product, setProduct] = useState<ProductType | null>(null);

  return (
    <Row gutter={40}>
      <Col span={12} style={{ flex: 1 }}>
        <Products withVendingActions={false} onEditProduct={setProduct} />
        <Button type="primary" onClick={() => setProduct(null)}>
          New
        </Button>
      </Col>

      <Col span={8} style={{ flex: 1 }}>
        {!product ? (
          <NewProduct />
        ) : (
          <Product product={product} onEdit={() => setProduct(null)} />
        )}
      </Col>
    </Row>
  );
};
