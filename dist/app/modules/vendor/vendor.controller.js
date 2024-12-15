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
exports.VendorControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const vendor_service_1 = require("./vendor.service");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// ------------------- Create a vendor -------------------
const createVendor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.createVendorInDB(req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Vendor created successfully",
        data: result,
    });
}));
// ------------------- Get all vendors -------------------
const getAllVendors = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.getAllVendorsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Vendors fetched successfully",
        data: result,
    });
}));
// ------------------- Get a single vendor -------------------
const getSingleVendor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.getSingleVendorFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Vendor fetched successfully",
        data: result,
    });
}));
// ------------------- Delete a vendor -------------------
const deleteVendor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.deleteVendorFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Vendor deleted successfully",
    });
}));
// ------------------- update a vendor -------------------
const updateVendor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.updateVendorIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Vendor updated successfully",
    });
}));
// ------------------- follow or unfollow a vendor -------------------
const followUnfollowVendor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.followUnfollowVendorIntoDB(req.user.userId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Vendor followed successfully",
    });
}));
// ------------------- change vendor status -------------------
const changeVendorStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.changeVendorStatusIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Vendor status is changed successfull",
        data: result,
    });
}));
exports.VendorControllers = {
    createVendor,
    getAllVendors,
    getSingleVendor,
    deleteVendor,
    updateVendor,
    followUnfollowVendor,
    changeVendorStatus,
};
