import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.rotues";
import { ProductRoutes } from "../modules/product/product.routes";
import { VendorRoutes } from "../modules/vendor/vendor.routes";
import { OrderRoutes } from "../modules/order/order.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
const router = express.Router();

// user
router.use("/users", UserRoutes);

// auth
router.use("/auth", AuthRoutes);

// products
router.use("/products", ProductRoutes);

// vendors
router.use("/vendors", VendorRoutes);

// orders
router.use("/orders", OrderRoutes);

// reviews
router.use("/reviews", ReviewRoutes);

export const ApiRoutes = router;
