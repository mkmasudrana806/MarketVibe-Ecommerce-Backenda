"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_validation_1 = require("./review.validation");
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
// create a Review
router.post("/create-review", (0, auth_1.default)("user"), (0, validateRequest_1.default)(review_validation_1.ReviewValidations.createAReviewSchema), review_controller_1.ReviewControllers.createAReview);
// get user reviews
router.get("/user-reviews", (0, auth_1.default)("user"), review_controller_1.ReviewControllers.getUserReviews);
// get vendor reviews
router.get("/vendor-reviews", (0, auth_1.default)("vendor"), review_controller_1.ReviewControllers.getVendorReviews);
// delete a review
router.delete("/:id", (0, auth_1.default)("user", "admin"), review_controller_1.ReviewControllers.deleteAReview);
// update a review
router.patch("/:id", (0, auth_1.default)("user"), (0, validateRequest_1.default)(review_validation_1.ReviewValidations.updateAReviewSchema), review_controller_1.ReviewControllers.updateAReview);
exports.ReviewRoutes = router;
