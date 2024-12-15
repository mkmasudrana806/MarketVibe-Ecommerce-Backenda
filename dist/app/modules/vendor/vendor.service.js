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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorServices = void 0;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const vendor_model_1 = require("./vendor.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const sendImageToCloudinary_1 = __importDefault(require("../../utils/sendImageToCloudinary"));
const queryBuilder_1 = __importDefault(require("../../queryBuilder/queryBuilder"));
const constant_vendor_1 = require("./constant.vendor");
const allowedFieldUpdatedData_1 = __importDefault(require("../../utils/allowedFieldUpdatedData"));
/**
 * ------------------ create a new vendor ------------------
 * @param payload vendor data with vendor user data
 * @returns newly created vendor
 */
const createVendorInDB = (logo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = payload, vendorData = __rest(payload, ["user"]);
    // check if the vendor is already exists
    const isVendorExists = yield user_model_1.User.findOne({ email: user.email });
    if (isVendorExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Vendor already exists");
    }
    // check if the same vendor name is already exists
    const isVendorNameExists = yield vendor_model_1.Vendor.findOne({
        shopName: vendorData.shopName,
    });
    if (isVendorNameExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Same vendor name is not allowed!");
    }
    // assign user role to vendor
    user.role = "vendor";
    // assign logo to vendorData
    if (logo) {
        const imageName = `${payload.shopName}`;
        const path = logo.path;
        const uploadedImage = yield (0, sendImageToCloudinary_1.default)(path, imageName);
        vendorData.logo = uploadedImage.secure_url;
    }
    // start transaction
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create new vendor user
        const vendorUser = yield user_model_1.User.create([user], { session });
        if (!(vendorUser.length > 0)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Vendor user is not created");
        }
        // create a new vendor
        vendorData.vendor = vendorUser[0]._id; // assign user reference to vendor
        const vendor = yield vendor_model_1.Vendor.create([vendorData], { session });
        if (!(vendor.length > 0)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Vendor is not created");
        }
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return vendor;
    }
    catch (error) {
        // abort the transaction
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Vendor is not created!");
    }
});
/**
 * ------------------ get all vendors ------------------
 * @returns list of all vendors
 */
const getAllVendorsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorQuery = new queryBuilder_1.default(vendor_model_1.Vendor.find(), query)
        .search(constant_vendor_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const meta = yield vendorQuery.countTotal();
    const result = yield vendorQuery.modelQuery;
    return { meta, result };
});
/**
 * ------------------ get a single vendor ------------------
 * @param vendorId vendor _id
 * @returns vendor details
 */
const getSingleVendorFromDB = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_model_1.Vendor.findOne({ _id: vendorId, isDeleted: false });
    if (!vendor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Vendor not found");
    }
    return vendor;
});
/**
 * ------------------ Delete a vendor by ID ------------------
 * @param vendorId Vendor ID
 */
const deleteVendorFromDB = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // start transaction
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete vendor
        const vendor = yield vendor_model_1.Vendor.findByIdAndUpdate(vendorId, { isDeleted: true }, { session, new: true });
        if (!vendor) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Vendor is not deleted");
        }
        // delete vendor user
        const vendorUser = yield user_model_1.User.findOneAndUpdate({ _id: vendor.vendor, role: "vendor" }, { isDeleted: true }, { session, new: true });
        if (!vendorUser) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Vendor user is not deleted");
        }
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return vendor;
    }
    catch (error) {
        // abort the transaction
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Vendor is not created!");
    }
});
/**
 * ------------------ Update a vendor by ID ------------------
 * @param vendorId Vendor ID
 * @param payload Updated vendor data
 */
const updateVendorIntoDB = (vendorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.shopName) {
        // check if the shopName is already exists
        const isVendorNameExists = yield vendor_model_1.Vendor.findOne({
            shopName: payload.shopName,
        });
        if (isVendorNameExists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Shop name is already exists");
        }
    }
    // filter allowed fileds only
    const allowedFieldData = (0, allowedFieldUpdatedData_1.default)(constant_vendor_1.allowedFieldsToUpdate, payload);
    const result = yield vendor_model_1.Vendor.findOneAndUpdate({ _id: vendorId, isDeleted: false }, allowedFieldData, { runValidators: true, new: true });
    return result;
});
/**
 * ------------------ follow unfollow vendor ------------------
 * @param userId userId
 * @param vendorId VendorId
 * @return message
 */
const followUnfollowVendorIntoDB = (userId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check if the user already exists in followers array
    const vendor = yield vendor_model_1.Vendor.findById(vendorId);
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    const alreadyFollowing = (_a = vendor.followers) === null || _a === void 0 ? void 0 : _a.includes(userId);
    let updatedVendor;
    // Unfollow the vendor
    if (alreadyFollowing) {
        updatedVendor = yield vendor_model_1.Vendor.findByIdAndUpdate(vendorId, { $pull: { followers: userId } }, { new: true });
    }
    else {
        // Follow the vendor
        updatedVendor = yield vendor_model_1.Vendor.findByIdAndUpdate(vendorId, { $addToSet: { followers: userId } }, { new: true });
    }
    return updatedVendor;
});
/**
 * -------------------- change vendor status ----------------------
 * @param id vendor id
 * @param payload vendor status payload
 * @validatios check if the vendor exists,not deleted. only admin can change vendor status
 * @returns return updated user status
 */
const changeVendorStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if vendor exists, not deleted
    const user = yield vendor_model_1.Vendor.findOne({
        _id: id,
        isDeleted: false,
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Vendor is not found!");
    }
    const result = yield vendor_model_1.Vendor.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.VendorServices = {
    createVendorInDB,
    getAllVendorsFromDB,
    getSingleVendorFromDB,
    deleteVendorFromDB,
    updateVendorIntoDB,
    followUnfollowVendorIntoDB,
    changeVendorStatusIntoDB,
};
