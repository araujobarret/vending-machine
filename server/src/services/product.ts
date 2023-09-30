import { Product, ProductPayload, productModel } from "../models/product";
import { userModel } from "../models/user";

type ProductServiceError = { code: number; message: string };
type ProductErrorCode =
  | "product_not_found"
  | "seller_not_found"
  | "user_not_seller"
  | "seller_not_authorized";
type ProductError = Record<ProductErrorCode, ProductServiceError>;

export const saveProduct = async ({
  productName,
  cost,
  amountAvailable,
  sellerId,
}: ProductPayload): Promise<ProductPayload | ProductServiceError> => {
  const error = await checkSellerId(sellerId);
  if (error) {
    return error;
  }

  const product = new productModel({
    productName,
    cost,
    amountAvailable,
    sellerId,
  });
  await product.save();

  return getProductPayload(product);
};

export const getProduct = async (
  id: string
): Promise<ProductPayload | null> => {
  const product = await productModel.findOne({ _id: id });

  if (!product) {
    return null;
  }

  return getProductPayload(product);
};

export const getProducts = async (): Promise<ProductPayload[]> => {
  return productModel.find({});
};

export const updateProduct = async ({
  productName,
  cost,
  amountAvailable,
  sellerId,
  id,
}: ProductPayload): Promise<ProductPayload | ProductServiceError | null> => {
  const error = await checkSellerId(sellerId);
  if (error) {
    return error;
  }

  const product = await productModel.findOneAndUpdate(
    { _id: id },
    { productName, cost, amountAvailable, sellerId },
    { new: true }
  );

  if (!product) {
    return null;
  }

  return getProductPayload(product);
};

export const deleteProduct = async (productId: string, sellerId: string) => {
  const product = await productModel.findOneAndDelete({ _id: productId });

  if (!product) {
    return PRODUCT_ERROR.product_not_found;
  }
  if (product.sellerId !== sellerId) {
    return PRODUCT_ERROR.seller_not_authorized;
  }

  return getProductPayload(product);
};

export const isProductServiceError = (
  data: ProductPayload | ProductServiceError
): data is ProductServiceError => {
  return (data as ProductServiceError).code !== undefined;
};

const PRODUCT_ERROR: ProductError = {
  product_not_found: {
    code: 404,
    message: "product not found",
  },
  seller_not_authorized: {
    code: 403,
    message: "seller not authorized to execute the operation",
  },
  seller_not_found: {
    code: 404,
    message: "seller not found",
  },
  user_not_seller: {
    code: 422,
    message: "sellerId cannot belong to a buyer",
  },
};

const getProductPayload = (product: Product) => {
  return {
    id: product.id,
    productName: product.productName,
    cost: product.cost,
    amountAvailable: product.amountAvailable,
    sellerId: product.sellerId,
  };
};

const checkSellerId = async (
  sellerId: string
): Promise<ProductServiceError | null> => {
  const user = await userModel.findOne({ _id: sellerId });

  if (!user) {
    return PRODUCT_ERROR.seller_not_found;
  }
  if (user.role === "buyer") {
    return PRODUCT_ERROR.user_not_seller;
  }

  return null;
};
