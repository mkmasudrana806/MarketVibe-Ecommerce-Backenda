import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";
import { TfileUpload } from "../../interface/fileUploadType";

// ------------------- Create a product -------------------
const createProduct = asyncHandler(async (req, res) => {
  const images = req.files;
  const result = await ProductServices.createProductIntoDB(
    images as TfileUpload[],
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// ------------------- Get all products -------------------
const getAllProducts = asyncHandler(async (req, res) => {
  const { result, meta } = await ProductServices.getAllProductsFromDB(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    data: result,
    meta: meta,
  });
});

// ------------------- Get a single product -------------------
const getSingleProduct = asyncHandler(async (req, res) => {
  const result = await ProductServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

// ------------------- Delete a product -------------------
const deleteProduct = asyncHandler(async (req, res) => {
  const result = await ProductServices.deleteProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Product deleted successfully",
  });
});

// ------------------- update a product -------------------
const updateProduct = asyncHandler(async (req, res) => {
  const result = await ProductServices.updateProductIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Product updated successfully",
  });
});
export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
