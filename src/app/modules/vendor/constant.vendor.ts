import TVendor from "./vendor.interface";

// allowed fields to update user
export const allowedFieldsToUpdate: (keyof TVendor)[] = [
  "shopName",
  "description",
  "address",
  "contact",
];

// search able fields to search
export const searchableFields = ["shopName", "address", "contact"];
