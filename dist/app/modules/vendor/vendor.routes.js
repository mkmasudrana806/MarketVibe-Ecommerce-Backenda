"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vendor_controller_1 = require("./vendor.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vendor_validation_1 = require("./vendor.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const multerUploadVercel_1 = require("../../utils/multerUploadVercel");
const router = express_1.default.Router();
// create a new vendor
router.post("/create-vendor", multerUploadVercel_1.multerUploadVercel.single("file"), 
// parse text data to JSON data
(req, res, next) => {
    var _a, _b;
    if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
        req.body = JSON.parse((_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
        next();
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide vendor data");
    }
}, (0, validateRequest_1.default)(vendor_validation_1.VendorValidationsSchema.createVendor), vendor_controller_1.VendorControllers.createVendor);
// get all vendors (admin only)
router.get("/", (0, auth_1.default)("admin"), vendor_controller_1.VendorControllers.getAllVendors);
// get a single vendor
router.get("/:id", vendor_controller_1.VendorControllers.getSingleVendor);
// delete a vendor
router.delete("/:id", (0, auth_1.default)("admin"), vendor_controller_1.VendorControllers.deleteVendor);
// update vendor
router.put("/:id", (0, auth_1.default)("vendor"), (0, validateRequest_1.default)(vendor_validation_1.VendorValidationsSchema.updateVendor), vendor_controller_1.VendorControllers.updateVendor);
// follow unfollow vendor
router.patch("/follow-unfollow/:id", (0, auth_1.default)("user"), vendor_controller_1.VendorControllers.followUnfollowVendor);
// change vendor status
router.patch("/change-status/:id", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(vendor_validation_1.VendorValidationsSchema.changeVendorStatusSchema), vendor_controller_1.VendorControllers.changeVendorStatus);
exports.VendorRoutes = router;
