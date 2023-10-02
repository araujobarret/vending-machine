import { Product } from "../types/product";
import { Button, Empty, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useVendingMachineContext } from "../pages/vending-machine/providers/VendingMachineProvider";
import { useProducts } from "../hooks/useProducts";

interface ProductsProps {
  withVendingActions?: boolean;
  onSelectProduct?: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({
  withVendingActions = true,
  onSelectProduct,
}) => {
  const { products, isLoading } = useProducts();

  if (products?.length === 0 && !isLoading) {
    return <Empty />;
  }

  return (
    <Spin spinning={isLoading}>
      {withVendingActions ? (
        <Table
          dataSource={products ?? []}
          rowKey={(p) => p._id ?? p.id}
          columns={columnsWithVendingActions}
          pagination={false}
        />
      ) : (
        <Table
          dataSource={products ?? []}
          columns={columns}
          pagination={false}
          rowKey={(p) => p._id ?? p.id}
          rowSelection={{
            type: "radio",
            onChange: (_, selectedRows) => {
              if (selectedRows.length > 0) {
                onSelectProduct?.(selectedRows[0]);
              }
            },
          }}
        />
      )}
    </Spin>
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
];

const columnsWithVendingActions: ColumnsType<Product> = [
  ...columns,
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
