import TProduct from "./product.interface";

// allowed fields to update user
export const allowedFieldsToUpdate: (keyof TProduct)[] = [
  "name",
  "price",
  "category",
  "description",
  "tags",
  "inventoryCount",
  "discount",
  "flashSale",
  "flashSalePrice",
];

// search able fields to search
export const searchableFields = ["name", "category", "description", "tags"];
