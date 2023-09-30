import { Document, model, Schema } from "mongoose";

export interface ProductPayload {
  id: string;
  productName: string;
  cost: number;
  amountAvailable: number;
  sellerId: string;
}

export interface Product extends Document, ProductPayload {
  // id from Document is any, in order to suppress the error, we overwrite the type
  id: string;
}

const productSchema = new Schema<Product>({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0.0,
    max: 99.0,
  },
  amountAvailable: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
  },
  sellerId: {
    type: String,
    required: true,
  },
});

export const productModel = model<Product>("product", productSchema);
