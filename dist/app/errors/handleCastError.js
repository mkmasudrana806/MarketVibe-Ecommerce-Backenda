"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// handle cast error and return statusCode, message and errorSources
const handleCastError = (err) => {
    let statusCode = 401;
    let errorSources = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        statusCode,
        message: "Mongoose cast error",
        errorSources,
    };
};
exports.default = handleCastError;
