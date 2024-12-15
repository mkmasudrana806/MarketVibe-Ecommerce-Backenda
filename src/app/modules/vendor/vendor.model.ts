import { Schema, model } from "mongoose";
import TVendor, { TSocialLink } from "./vendor.interface";

// social link schema
const socialLinkSchema = new Schema<TSocialLink>({
  socialName: { type: String },
  socialLink: { type: String },
});

// vendor schema
const vendorSchema = new Schema<TVendor>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  },
  {
    timestamps: true,
  }
);

export const Vendor = model<TVendor>("Vendor", vendorSchema);
