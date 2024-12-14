"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
// product schema
const productSchema = new mongoose_1.Schema({
    vendor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vendor", required: true },
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
}, {
    timestamps: true,
});
// export product model
exports.Product = (0, mongoose_1.model)("Product", productSchema);
