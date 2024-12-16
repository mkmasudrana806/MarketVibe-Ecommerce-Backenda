import { Date, Types } from "mongoose";

export type TReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  vendor: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};
