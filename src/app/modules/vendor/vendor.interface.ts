import { Types } from "mongoose";
import { TUser } from "../user/user.interface";

// social link
export type TSocialLink = {
  socialName: string;
  socialLink: string;
};

// vendor
type TVendor = {
  user: TUser;
  vendor: Types.ObjectId;
  shopName: string;
  logo?: string;
  description: string;
  address: string;
  contact: string;
  socialLinks: TSocialLink[];
  followers?: string[];
  status: "active" | "blocked";
  isDeleted?: boolean;
};

export default TVendor;
