import express, { NextFunction, Request, Response } from "express";
import validateRequestData from "../../middlewares/validateRequest";
import { ProductValidationsSchema } from "./product.validation";
import auth from "../../middlewares/auth";
import { ProductControllers } from "./product.controller";
import { upload } from "../../utils/upload";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";

const router = express.Router();

// create a new product
router.post(
  "/create-product",
  auth("vendor"),
  upload.array("images", 5), // file uploading
  // parse text data to JSON data
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body?.data);
      next();
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Please provide user data");
    }
  },

  validateRequestData(ProductValidationsSchema.createProduct),
  ProductControllers.createProduct
);

// get all products
router.get("/", ProductControllers.getAllProducts);

// get a single product by id
router.get("/:id", ProductControllers.getSingleProduct);

// delete a product by id
router.delete(
  "/:id",
  auth("vendor", "admin"),
  ProductControllers.deleteProduct
);

// update a product by id
router.put(
  "/:id",
  auth("vendor"),
  validateRequestData(ProductValidationsSchema.updateProduct),
  ProductControllers.updateProduct
);

export const ProductRoutes = router;
