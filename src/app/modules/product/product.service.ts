import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import TProduct from "./product.interface";
import { TfileUpload } from "../../interface/fileUploadType";
import sendImageToCloudinary from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../queryBuilder/queryBuilder";
import { allowedFieldsToUpdate, searchableFields } from "./product.constant";
import { Product } from "./product.model";
import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";

/**
 * create a new product
 * @param payload product data
 * @returns newly created product
 */
const createProductIntoDB = async (
  images: TfileUpload[],
  payload: TProduct
) => {
  // upload all images to the cloudinary
  if (images.length > 0) {
    const liveImages: string[] = [];
    for (const file of images) {
      const imageName = `${payload.vendor}`;
      const path = file.path;
      const uploadedImage: any = await sendImageToCloudinary(path, imageName);
      liveImages.push(uploadedImage.secure_url);
    }
    payload.images = liveImages;
  }

  const product = await Product.create(payload);
  return product;
};

/**
 * get all products
 * @returns list of all products
 */
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }).populate("vendor"),
    query
  )
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { result, meta };
};

/**
 * get  single product by id
 * @param productId product id
 * @returns product details
 */
const getSingleProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId).populate("vendor");
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

/**
 * delete a product by id
 * @param productId product id
 */
const deleteProductFromDB = async (productId: string) => {
  const result = await Product.findByIdAndUpdate(productId, {
    isDeleted: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return result;
};

/**
 * update a product by id
 * @param productId product id
 * @param payload update payload data
 */
const updateProductIntoDB = async (
  productId: string,
  payload: Partial<TProduct>
) => {
  // filter allowed fileds only
  const allowedFieldData = makeAllowedFieldData<TProduct>(
    allowedFieldsToUpdate,
    payload
  );

  const result = await Product.findByIdAndUpdate(productId, allowedFieldData, {
    runValidators: true,
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProductIntoDB,
};
