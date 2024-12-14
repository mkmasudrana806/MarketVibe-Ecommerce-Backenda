"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// storage configuration for multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
// filter out allowed file types
// const fileFilter = function fileFilter(req, file, cb) {
//   const acceptableFiles = /.png|.jpg|.jpeg/;
//   // The function should call `cb` with a boolean
//   // to indicate if the file should be accepted
//   // To reject this file pass `false`, like so:
//   cb(null, false);
//   // To accept the file pass `true`, like so:
//   cb(null, true);
//   // You can always pass an error if something goes wrong:
//   cb(new Error("I don't have a clue!"));
// };
// multer take options object as parameter, which contains storage, fileFilter, limits
exports.upload = (0, multer_1.default)({ storage: storage });
