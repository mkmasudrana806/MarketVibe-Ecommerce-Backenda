"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// handle validation error and return statusCode, message and errorSources
const handleValidationError = (err) => {
    let statusCode = 401;
    let errorSources = Object.values(err.errors).map((error) => ({
        path: error.path,
        message: error.message,
    }));
    return {
        statusCode,
        message: "Mongoose validation error",
        errorSources,
    };
};
exports.default = handleValidationError;
