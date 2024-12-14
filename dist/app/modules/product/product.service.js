"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendImageToCloudinary_1 = __importDefault(require("../../utils/sendImageToCloudinary"));
const queryBuilder_1 = __importDefault(require("../../queryBuilder/queryBuilder"));
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
const allowedFieldUpdatedData_1 = __importDefault(require("../../utils/allowedFieldUpdatedData"));
/**
 * create a new product
 * @param payload product data
 * @returns newly created product
 */
const createProductIntoDB = (images, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // upload all images to the cloudinary
    if (images.length > 0) {
        const liveImages = [];
        for (const file of images) {
            const imageName = `${payload.vendor}`;
            const path = file.path;
            const uploadedImage = yield (0, sendImageToCloudinary_1.default)(path, imageName);
            liveImages.push(uploadedImage.secure_url);
        }
        payload.images = liveImages;
    }
    const product = yield product_model_1.Product.create(payload);
    return product;
});
/**
 * get all products
 * @returns list of all products
 */
const getAllProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new queryBuilder_1.default(product_model_1.Product.find({ isDeleted: false }).populate("vendor"), query)
        .filter()
        .search(product_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { result, meta };
});
/**
 * get  single product by id
 * @param productId product id
 * @returns product details
 */
const getSingleProductFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId).populate("vendor");
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return product;
});
/**
 * delete a product by id
 * @param productId product id
 */
const deleteProductFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findByIdAndUpdate(productId, {
        isDeleted: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return result;
});
/**
 * update a product by id
 * @param productId product id
 * @param payload update payload data
 */
const updateProductIntoDB = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // filter allowed fileds only
    const allowedFieldData = (0, allowedFieldUpdatedData_1.default)(product_constant_1.allowedFieldsToUpdate, payload);
    const result = yield product_model_1.Product.findByIdAndUpdate(productId, allowedFieldData, {
        runValidators: true,
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return result;
});
exports.ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductFromDB,
    deleteProductFromDB,
    updateProductIntoDB,
};
