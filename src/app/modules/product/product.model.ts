import { Schema, model } from "mongoose";
import TProduct from "./product.interface";

// product schema
const productSchema = new Schema<TProduct>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    inventoryCount: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    flashSale: { type: Boolean, default: false },
    flashSalePrice: { type: Number, min: 0, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// export product model
export const Product = model<TProduct>("Product", productSchema);
