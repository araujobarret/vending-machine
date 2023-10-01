import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Product } from "../types/product";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useVendingMachineContext } from "../providers/VendingMachineProvider";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[] | null>(null);

  const hasProducts = products !== null;

  useEffect(() => {
    if (!hasProducts) {
      api.get<Product[]>("/products").then(({ data }) => setProducts(data));
    }
  }, [hasProducts]);

  if (!hasProducts) {
    return null;
  }

  return (
    <>
      <Table dataSource={products} columns={columns} pagination={false} />
    </>
  );
};

const columns: ColumnsType<Product> = [
  { title: "Product ", dataIndex: "productName", key: "productName" },
  { title: "Price ", dataIndex: "cost", key: "cost" },
  {
    title: "Items Available ",
    dataIndex: "amountAvailable",
    key: "amountAvailable",
  },
  {
    title: "Add",
    key: "addToOrder",
    dataIndex: "",
    render: (value: Product) => <ProductAddButton product={value} />,
  },
  {
    title: "Remove",
    key: "removeFromOrder",
    dataIndex: "",
    render: (value: Product) => <ProductRemoveButton product={value} />,
  },
];

const ProductAddButton: React.FC<{ product: Product }> = ({ product }) => {
  const {
    incrementProduct,
    product: contextProduct,
    amountOfProducts,
  } = useVendingMachineContext();
  const { amountAvailable, _id } = product;

  const showAddButton =
    amountAvailable > amountOfProducts &&
    (!contextProduct || _id === contextProduct._id);

  if (showAddButton) {
    return (
      <Button type="primary" onClick={() => incrementProduct(product)}>
        +
      </Button>
    );
  }

  return null;
};

const ProductRemoveButton: React.FC<{ product: Product }> = ({ product }) => {
  const {
    decrementProduct,
    product: contextProduct,
    amountOfProducts,
  } = useVendingMachineContext();
  const { _id } = product;

  const showRemoveButton =
    amountOfProducts > 0 && contextProduct && _id === contextProduct._id;

  if (showRemoveButton) {
    return (
      <Button type="primary" onClick={() => decrementProduct()}>
        -
      </Button>
    );
  }

  return null;
};
