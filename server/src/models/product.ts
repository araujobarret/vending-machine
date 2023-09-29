import { Document, model, Schema } from "mongoose";

export interface ProductPayload {
  id: string;
  name: string;
  price: number;
}

export interface Product extends Document, ProductPayload {
  // id from Document is any, in order to suppress the error, we overwrite the type
  id: string;
}

const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.0,
    max: 99.0,
  },
});

export const productModel = model<Product>("product", productSchema);
