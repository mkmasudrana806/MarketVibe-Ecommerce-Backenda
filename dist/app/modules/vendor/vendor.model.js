"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const mongoose_1 = require("mongoose");
// social link schema
const socialLinkSchema = new mongoose_1.Schema({
    socialName: { type: String },
    socialLink: { type: String },
});
// vendor schema
const vendorSchema = new mongoose_1.Schema({
    vendor: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    logo: {
        type: String,
        required: true,
        default: "https://logodix.com/logo/501470.png",
    },
    description: { type: String, required: true },
    followers: [{ type: String }],
    address: { type: String, required: true },
    contact: { type: String, required: true },
    socialLinks: [socialLinkSchema],
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
        required: true,
    },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});
exports.Vendor = (0, mongoose_1.model)("Vendor", vendorSchema);
