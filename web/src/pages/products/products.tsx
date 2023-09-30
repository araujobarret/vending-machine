// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Button, Space } from "antd";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  // Render your product list here

  return (
    <Space>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
    </Space>
  );
}

export default ProductList;
