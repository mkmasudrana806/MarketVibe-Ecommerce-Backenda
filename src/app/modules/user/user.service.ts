import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";
import makeFlattenedObject from "../../utils/makeFlattenedObject";
import { allowedFieldsToUpdate, searchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { TfileUpload } from "../../interface/fileUploadType";
import sendImageToCloudinary from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../queryBuilder/queryBuilder";

/**
 * ----------------------- Create an user----------------------
 * @param file image file to upload (optional)
 * @param payload new user data
 * @returns return newly created user
 */
const createAnUserIntoDB = async (file: TfileUpload, payload: TUser) => {
  // set profilePicture if image is provided
  if (file) {
    const imageName = `${payload.email}-${payload.name}`;
    const path = file.path;
    const uploadedImage: any = await sendImageToCloudinary(path, imageName);
    payload.profilePicture = uploadedImage.secure_url;
  }

  const result = await User.create(payload);
  return result;
};

/**
 * ----------------------- get all users ----------------------
 * @query req.query object containing metadata
 * @return return all users
 */
const getAllUsersFromDB = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();
  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;
  return { meta, result };
};

/**
 * -----------------  get me  -----------------
 * @param email email address
 * @param role user role
 * @returns own user data based on jwt payload data
 */
const myProfile = async (email: string, role: string) => {
  const result = await User.findOne({ email, role });
  return result;
};

/**
 * --------------- delete an user form db ----------------
 * @param id user id
 * @returns return deleted user data
 */
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

/**
 * --------------- update an user form db ----------------
 * @param userId loggedin user
 * @param payload updated user data
 * @returns return updated user data
 */
const updateUserIntoDB = async (userId: string, payload: Partial<TUser>) => {
  // filter allowed fileds only
  const allowedFieldData = makeAllowedFieldData<TUser>(
    allowedFieldsToUpdate,
    payload
  );
  // make flattened object
  const flattenedData = makeFlattenedObject(allowedFieldData);

  const result = await User.findByIdAndUpdate(userId, flattenedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

/**
 * -------------------- change user status ----------------------
 * @param id user id
 * @param payload user status payload
 * @validatios check if the user exists,not deleted. only admin can change user status
 * @note admin can not change own status. admin can change only user status
 * @returns return updated user status
 */
const changeUserStatusIntoDB = async (
  id: string,
  payload: { status: string }
) => {
  // check if user exists, not deleted. find user that has role as user
  const user = await User.findOne({
    _id: id,
    role: "user",
    isDeleted: false,
    status: "active",
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const UserServices = {
  createAnUserIntoDB,
  getAllUsersFromDB,
  myProfile,
  deleteUserFromDB,
  updateUserIntoDB,
  changeUserStatusIntoDB,
};
