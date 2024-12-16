import express, { NextFunction, Request, Response } from "express";
import { VendorControllers } from "./vendor.controller";
import validateRequestData from "../../middlewares/validateRequest";
import { VendorValidationsSchema } from "./vendor.validation";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/upload";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";

const router = express.Router();

// create a new vendor
router.post(
  "/create-vendor",
  upload.single("file"),
  // parse text data to JSON data
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body?.data);
      next();
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Please provide vendor data");
    }
  },
  validateRequestData(VendorValidationsSchema.createVendor),
  VendorControllers.createVendor
);

// get all vendors (admin only)
router.get("/", auth("admin"), VendorControllers.getAllVendors);

// get a single vendor
router.get("/:id", VendorControllers.getSingleVendor);

// delete a vendor
router.delete("/:id", auth("admin"), VendorControllers.deleteVendor);

// update vendor
router.put(
  "/:id",
  auth("vendor"),
  validateRequestData(VendorValidationsSchema.updateVendor),
  VendorControllers.updateVendor
);

// follow unfollow vendor
router.patch(
  "/follow-unfollow/:id",
  auth("user"),
  VendorControllers.followUnfollowVendor
);

// change vendor status
router.patch(
  "/change-status/:id",
  auth("admin"),
  validateRequestData(VendorValidationsSchema.changeVendorStatusSchema),
  VendorControllers.changeVendorStatus
);
export const VendorRoutes = router;
