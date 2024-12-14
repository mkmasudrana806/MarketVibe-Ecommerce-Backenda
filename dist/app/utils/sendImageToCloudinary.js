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
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
/**
 *  ------------------- send image to cloudinary -----------------------
 *
 * @param path file path to remove and upload to cloudinary
 * @param imageName image name
 * @returns return uploaded file object
 */
const sendImageToCloudinary = (path, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: config_1.default.cloudinary_name,
        api_key: config_1.default.cloudinary_api_key,
        api_secret: config_1.default.cloudinary_secret_key,
    });
    // Upload an image
    const uploadResult = yield cloudinary_1.v2.uploader
        .upload(path, {
        public_id: imageName,
    })
        .catch((error) => {
        console.log(error);
    });
    // unlink the uploaded image to server
    fs_1.default.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("file uploaded successfully");
    });
    return uploadResult;
});
exports.default = sendImageToCloudinary;
