import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import TVendor from "./vendor.interface";
import { Vendor } from "./vendor.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import { TfileUpload } from "../../interface/fileUploadType";
import sendImageToCloudinary from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../queryBuilder/queryBuilder";
import { allowedFieldsToUpdate, searchableFields } from "./constant.vendor";
import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";

/**
 * ------------------ create a new vendor ------------------
 * @param payload vendor data with vendor user data
 * @returns newly created vendor
 */
const createVendorInDB = async (logo: TfileUpload, payload: TVendor) => {
  const { user, ...vendorData } = payload;
  // check if the vendor is already exists
  const isVendorExists = await User.findOne({ email: user.email });
  if (isVendorExists) {
    throw new AppError(httpStatus.CONFLICT, "Vendor already exists");
  }

  // check if the same vendor name is already exists
  const isVendorNameExists = await Vendor.findOne({
    shopName: vendorData.shopName,
  });
  if (isVendorNameExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Same vendor name is not allowed!"
    );
  }

  // assign user role to vendor
  user.role = "vendor";
  // assign logo to vendorData
  if (logo) {
    const imageName = `${payload.shopName}`;
    const path = logo.path;
    const uploadedImage: any = await sendImageToCloudinary(path, imageName);
    vendorData.logo = uploadedImage.secure_url;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Logo is not uploaded!");
  }

  // start transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // create new vendor user
    const vendorUser = await User.create([user], { session });
    if (!(vendorUser.length > 0)) {
      throw new AppError(httpStatus.FORBIDDEN, "Vendor user is not created");
    }

    // create a new vendor
    vendorData.vendor = vendorUser[0]._id; // assign user reference to vendor
    const vendor = await Vendor.create([vendorData], { session });
    if (!(vendor.length > 0)) {
      throw new AppError(httpStatus.FORBIDDEN, "Vendor is not created");
    }

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return vendor;
  } catch (error) {
    // abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor is not created!");
  }
};

/**
 * ------------------ get all vendors ------------------
 * @returns list of all vendors
 */
const getAllVendorsFromDB = async (query: Record<string, unknown>) => {
  const vendorQuery = new QueryBuilder(Vendor.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();
  const meta = await vendorQuery.countTotal();
  const result = await vendorQuery.modelQuery;
  return { meta, result };
};

/**
 * ------------------ get a single vendor ------------------
 * @param vendorId vendor _id
 * @returns vendor details
 */
const getSingleVendorFromDB = async (vendorId: string) => {
  const vendor = await Vendor.findOne({ _id: vendorId, isDeleted: false });
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  return vendor;
};

/**
 * ------------------ Delete a vendor by ID ------------------
 * @param vendorId Vendor ID
 */
const deleteVendorFromDB = async (vendorId: string) => {
  // start transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // delete vendor
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { isDeleted: true },
      { session, new: true }
    );
    if (!vendor) {
      throw new AppError(httpStatus.FORBIDDEN, "Vendor is not deleted");
    }

    // delete vendor user
    const vendorUser = await User.findOneAndUpdate(
      { _id: vendor.vendor, role: "vendor" },
      { isDeleted: true },
      { session, new: true }
    );
    if (!vendorUser) {
      throw new AppError(httpStatus.FORBIDDEN, "Vendor user is not deleted");
    }

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return vendor;
  } catch (error) {
    // abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor is not created!");
  }
};

/**
 * ------------------ Update a vendor by ID ------------------
 * @param vendorId Vendor ID
 * @param payload Updated vendor data
 */
const updateVendorIntoDB = async (
  vendorId: string,
  payload: Partial<TVendor>
) => {
  if (payload?.shopName) {
    // check if the shopName is already exists
    const isVendorNameExists = await Vendor.findOne({
      shopName: payload.shopName,
    });
    if (isVendorNameExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Shop name is already exists");
    }
  }

  // filter allowed fileds only
  const allowedFieldData = makeAllowedFieldData<TVendor>(
    allowedFieldsToUpdate,
    payload
  );

  const result = await Vendor.findOneAndUpdate(
    { _id: vendorId, isDeleted: false },
    allowedFieldData,
    { runValidators: true, new: true }
  );

  return result;
};

/**
 * ------------------ follow unfollow vendor ------------------
 * @param userId userId
 * @param vendorId VendorId
 * @return message
 */
const followUnfollowVendorIntoDB = async (userId: string, vendorId: string) => {
  // check if the user already exists in followers array
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const alreadyFollowing = vendor.followers?.includes(userId);
  let updatedVendor;
  // Unfollow the vendor
  if (alreadyFollowing) {
    updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $pull: { followers: userId } },
      { new: true }
    );
  } else {
    // Follow the vendor
    updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $addToSet: { followers: userId } },
      { new: true }
    );
  }

  return updatedVendor;
};

/**
 * -------------------- change vendor status ----------------------
 * @param id vendor id
 * @param payload vendor status payload
 * @validatios check if the vendor exists,not deleted. only admin can change vendor status
 * @returns return updated user status
 */
const changeVendorStatusIntoDB = async (
  id: string,
  payload: { status: string }
) => {
  // check if vendor exists, not deleted
  const user = await Vendor.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor is not found!");
  }

  const result = await Vendor.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const VendorServices = {
  createVendorInDB,
  getAllVendorsFromDB,
  getSingleVendorFromDB,
  deleteVendorFromDB,
  updateVendorIntoDB,
  followUnfollowVendorIntoDB,
  changeVendorStatusIntoDB,
};
