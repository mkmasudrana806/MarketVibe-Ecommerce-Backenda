"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../utils/AppError"));
const adminData = {
    name: "Masud Rana",
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
    age: 20,
    contact: "017234324324",
    address: "Sirajganj",
    gender: "male",
};
// ---------  seed admin data to database at database connection ----------
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ role: "admin" });
    if (!user) {
        try {
            yield user_model_1.User.create(adminData);
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to seed admin data");
        }
    }
});
exports.default = seedAdmin;
