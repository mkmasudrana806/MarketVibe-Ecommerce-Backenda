"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    /**
     * @param statusCode custom status code
     * @param message custom error message
     * @param stack error stack (optional)
     */
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
