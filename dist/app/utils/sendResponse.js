"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param res res  object
 * @param data data
 */
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data === null || data === void 0 ? void 0 : data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
