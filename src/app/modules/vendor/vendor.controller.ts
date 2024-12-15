import httpStatus from "http-status";
import { VendorServices } from "./vendor.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { TfileUpload } from "../../interface/fileUploadType";

// ------------------- Create a vendor -------------------
const createVendor = asyncHandler(async (req, res) => {
  const result = await VendorServices.createVendorInDB(
    req.file as TfileUpload,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vendor created successfully",
    data: result,
  });
});

// ------------------- Get all vendors -------------------
const getAllVendors = asyncHandler(async (req, res) => {
  const result = await VendorServices.getAllVendorsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Vendors fetched successfully",
    data: result,
  });
});

// ------------------- Get a single vendor -------------------
const getSingleVendor = asyncHandler(async (req, res) => {
  const result = await VendorServices.getSingleVendorFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor fetched successfully",
    data: result,
  });
});

// ------------------- Delete a vendor -------------------
const deleteVendor = asyncHandler(async (req, res) => {
  const result = await VendorServices.deleteVendorFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Vendor deleted successfully",
  });
});

// ------------------- update a vendor -------------------
const updateVendor = asyncHandler(async (req, res) => {
  const result = await VendorServices.updateVendorIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Vendor updated successfully",
  });
});

// ------------------- follow or unfollow a vendor -------------------
const followUnfollowVendor = asyncHandler(async (req, res) => {
  const result = await VendorServices.followUnfollowVendorIntoDB(
    req.user.userId,
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Vendor followed successfully",
  });
});

// ------------------- change vendor status -------------------
const changeVendorStatus = asyncHandler(async (req, res) => {
  const result = await VendorServices.changeVendorStatusIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor status is changed successfull",
    data: result,
  });
});

export const VendorControllers = {
  createVendor,
  getAllVendors,
  getSingleVendor,
  deleteVendor,
  updateVendor,
  followUnfollowVendor,
  changeVendorStatus,
};
