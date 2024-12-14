"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = require("../../utils/upload");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const router = express_1.default.Router();
// create an user
router.post("/create-user", upload_1.upload.single("file"), // file uploading
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
}, (0, validateRequest_1.default)(user_validation_1.UserValidations.createUserValidationsSchema), user_controller_1.UserControllers.createAnUser);
// get all users
router.get("/", (0, auth_1.default)("admin"), user_controller_1.UserControllers.getAllUsers);
// get me route
router.get("/me", (0, auth_1.default)("user", "admin", "vendor"), user_controller_1.UserControllers.myProfile);
// delete an user
router.delete("/:id", (0, auth_1.default)("admin"), user_controller_1.UserControllers.deleteUser);
// update an user
router.patch("/", (0, auth_1.default)("user", "admin", "vendor"), (0, validateRequest_1.default)(user_validation_1.UserValidations.updateUserValidationsSchema), user_controller_1.UserControllers.updateUser);
// change user status
router.patch("/change-status/:id", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(user_validation_1.UserValidations.changeUserStatusSchema), user_controller_1.UserControllers.changeUserStatus);
exports.UserRoutes = router;
