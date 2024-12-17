"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// make payment
router.post("/make-payment", payment_controller_1.PaymentControllers.makePayment);
// get all payments history
router.get("/", (0, auth_1.default)("admin"), payment_controller_1.PaymentControllers.allPaymentHistory);
// get user payments history
router.get("/user-payments", (0, auth_1.default)("user"), payment_controller_1.PaymentControllers.userPaymentHistory);
// get user payments history
router.get("/vendor-payments", (0, auth_1.default)("vendor"), payment_controller_1.PaymentControllers.vendorPaymentHistory);
exports.PaymentRoutes = router;
