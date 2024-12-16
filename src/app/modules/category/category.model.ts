import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";

// category schema
const categorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

export const Category = model<TCategory>("Category", categorySchema);
