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
exports.UserServices = void 0;
const allowedFieldUpdatedData_1 = __importDefault(require("../../utils/allowedFieldUpdatedData"));
const makeFlattenedObject_1 = __importDefault(require("../../utils/makeFlattenedObject"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendImageToCloudinary_1 = __importDefault(require("../../utils/sendImageToCloudinary"));
const queryBuilder_1 = __importDefault(require("../../queryBuilder/queryBuilder"));
/**
 * ----------------------- Create an user----------------------
 * @param file image file to upload (optional)
 * @param payload new user data
 * @returns return newly created user
 */
const createAnUserIntoDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // set profilePicture if image is provided
    if (file) {
        const imageName = `${payload.email}-${payload.name}`;
        const path = file.path;
        const uploadedImage = yield (0, sendImageToCloudinary_1.default)(path, imageName);
        payload.profilePicture = uploadedImage.secure_url;
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
/**
 * ----------------------- get all users ----------------------
 * @query req.query object containing metadata
 * @return return all users
 */
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new queryBuilder_1.default(user_model_1.User.find(), query)
        .search(user_constant_1.searchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const meta = yield userQuery.countTotal();
    const result = yield userQuery.modelQuery;
    return { meta, result };
});
/**
 * -----------------  get me  -----------------
 * @param email email address
 * @param role user role
 * @returns own user data based on jwt payload data
 */
const myProfile = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email, role });
    return result;
});
/**
 * --------------- delete an user form db ----------------
 * @param id user id
 * @returns return deleted user data
 */
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
/**
 * --------------- update an user form db ----------------
 * @param userId loggedin user
 * @param payload updated user data
 * @returns return updated user data
 */
const updateUserIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // filter allowed fileds only
    const allowedFieldData = (0, allowedFieldUpdatedData_1.default)(user_constant_1.allowedFieldsToUpdate, payload);
    // make flattened object
    const flattenedData = (0, makeFlattenedObject_1.default)(allowedFieldData);
    const result = yield user_model_1.User.findByIdAndUpdate(userId, flattenedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
/**
 * -------------------- change user status ----------------------
 * @param id user id
 * @param payload user status payload
 * @validatios check if the user exists,not deleted. only admin can change user status
 * @note admin can not change own status. admin can change only user status
 * @returns return updated user status
 */
const changeUserStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists, not deleted. find user that has role as user
    const user = yield user_model_1.User.findOne({
        _id: id,
        role: "user",
        isDeleted: false,
        status: "active",
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.UserServices = {
    createAnUserIntoDB,
    getAllUsersFromDB,
    myProfile,
    deleteUserFromDB,
    updateUserIntoDB,
    changeUserStatusIntoDB,
};
