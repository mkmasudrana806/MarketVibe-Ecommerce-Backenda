"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchableFields = exports.allowedFieldsToUpdate = void 0;
// allowed fields to update user
exports.allowedFieldsToUpdate = [
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
exports.searchableFields = ["name", "category", "description", "tags"];
