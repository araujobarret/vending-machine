import { ProductPayload, productModel } from "../models/product";

export const saveProduct = async ({
  name,
  price,
}: {
  name: string;
  price: number;
}): Promise<ProductPayload> => {
  const product = new productModel({ name, price });
  const data = await product.save();

  return {
    id: data.id,
    name: data.name,
    price: data.price,
  };
};

export const getProduct = async (
  id: string
): Promise<ProductPayload | null> => {
  const product = await productModel.findOne({ _id: id });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
  };
};

export const getProducts = async (): Promise<ProductPayload[]> => {
  return productModel.find({});
};

export const updateProduct = async ({
  name,
  price,
  id,
}: ProductPayload): Promise<ProductPayload | null> => {
  const product = await productModel.findOneAndUpdate(
    { _id: id },
    { name, price },
    { new: true }
  );

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
  };
};

export const deleteProduct = (id: string) => {
  return productModel.findOneAndDelete({ _id: id });
};
