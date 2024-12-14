"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const product_controller_1 = require("./product.controller");
const upload_1 = require("../../utils/upload");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const router = express_1.default.Router();
// create a new product
router.post("/create-product", (0, auth_1.default)("vendor"), upload_1.upload.array("images", 5), // file uploading
// parse text data to JSON data
(req, res, next) => {
    var _a, _b;
    if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
        req.body = JSON.parse((_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
        next();
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide user data");
    }
}, (0, validateRequest_1.default)(product_validation_1.ProductValidationsSchema.createProduct), product_controller_1.ProductControllers.createProduct);
// get all products
router.get("/", product_controller_1.ProductControllers.getAllProducts);
// get a single product by id
router.get("/:id", product_controller_1.ProductControllers.getSingleProduct);
// delete a product by id
router.delete("/:id", (0, auth_1.default)("vendor", "admin"), product_controller_1.ProductControllers.deleteProduct);
// update a product by id
router.put("/:id", (0, auth_1.default)("vendor"), (0, validateRequest_1.default)(product_validation_1.ProductValidationsSchema.updateProduct), product_controller_1.ProductControllers.updateProduct);
exports.ProductRoutes = router;
