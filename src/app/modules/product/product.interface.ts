import { Types } from "mongoose";

type TProduct = {
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  inventoryCount: number;
  discount?: number;
  vendor: Types.ObjectId;
  flashSale?: boolean;
  flashSalePrice?: number;
  isDeleted: boolean;
};

export default TProduct;
