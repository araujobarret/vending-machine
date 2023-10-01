import React, { useState } from "react";

import { Product } from "../types/product";

interface VendingMachineContextType {
  product: Product | null;
  userDeposit: number;
  amountOfProducts: number;
  total: number;
  incrementProduct: (product: Product) => void;
  decrementProduct: () => void;
  reset: () => void;
  setUserDeposit: React.Dispatch<React.SetStateAction<number>>;
}

let VendingMachineContext = React.createContext<VendingMachineContextType>(
  null!
);

export const VendingMachineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [userDeposit, setUserDeposit] = useState<number>(0);
  const [amountOfProducts, setAmountOfProducts] = useState(0);

  const total = product ? amountOfProducts * product.cost : 0;

  const incrementProduct = (_product: Product) => {
    if (!product) {
      setProduct(_product);
      setAmountOfProducts((amount) => amount + 1);
      return;
    }

    setAmountOfProducts((amount) => amount + 1);
  };

  const decrementProduct = () => {
    if (!product) {
      return;
    }

    if (amountOfProducts === 1) {
      setProduct(null);
    }
    setAmountOfProducts((amount) => amount - 1);
  };

  const reset = () => {
    setProduct(null);
    setAmountOfProducts(0);
  };

  let value = {
    userDeposit,
    setUserDeposit,
    product,
    amountOfProducts,
    incrementProduct,
    decrementProduct,
    reset,
    total,
  };

  return (
    <VendingMachineContext.Provider value={value}>
      {children}
    </VendingMachineContext.Provider>
  );
};

export const useVendingMachineContext = () => {
  return React.useContext(VendingMachineContext);
};
