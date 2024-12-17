import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import validateRequestData from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/upload";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { multerUploadVercel } from "../../utils/multerUploadVercel";
const router = express.Router();

// create an user
router.post(
  "/create-user",
  multerUploadVercel.single("file"), // file uploading
  // parse text data to JSON data
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body?.data);
      next();
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Please provide user data");
    }
  },
  validateRequestData(UserValidations.createUserValidationsSchema),
  UserControllers.createAnUser
);

// get all users
router.get("/", auth("admin"), UserControllers.getAllUsers);

// get me route
router.get("/me", auth("user", "admin", "vendor"), UserControllers.myProfile);

// delete an user
router.delete("/:id", auth("admin"), UserControllers.deleteUser);

// update an user
router.patch(
  "/",
  auth("user", "admin", "vendor"),
  validateRequestData(UserValidations.updateUserValidationsSchema),
  UserControllers.updateUser
);

// change user status
router.patch(
  "/change-status/:id",
  auth("admin"),
  validateRequestData(UserValidations.changeUserStatusSchema),
  UserControllers.changeUserStatus
);

export const UserRoutes = router;
