import express from "express";
import { ReviewValidations } from "./review.validation";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import validateRequestData from "../../middlewares/validateRequest";
const router = express.Router();

// create a Review
router.post(
  "/create-review",
  auth("user"),
  validateRequestData(ReviewValidations.createAReviewSchema),
  ReviewControllers.createAReview
);

// get user reviews
router.get("/user-reviews", auth("user"), ReviewControllers.getUserReviews);

// get vendor reviews
router.get(
  "/vendor-reviews",
  auth("vendor"),
  ReviewControllers.getVendorReviews
);

// delete a review
router.delete("/:id", auth("user", "admin"), ReviewControllers.deleteAReview);

// update a review
router.patch(
  "/:id",
  auth("user"),
  validateRequestData(ReviewValidations.updateAReviewSchema),
  ReviewControllers.updateAReview
);

export const ReviewRoutes = router;
