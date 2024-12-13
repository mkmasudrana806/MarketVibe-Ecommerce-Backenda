import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import { Error, MongooseError } from "mongoose";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateKeyError from "../errors/handleDuplicateKeyError";
import AppError from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || "INTERNAL SERVER ERROR";
  let errorSources: TErrorSources = [
    { path: "", message: "Someting went wrong!" },
  ];

  // handle zod validation errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // handle mongoose validation errors
  else if (err instanceof Error.ValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // handle mongodb cast errors
  else if (err instanceof Error.CastError) {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // handle duplicate key errors
  else if (err.code === 11000) {
    const simplifiedError = handleDuplicateKeyError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // handle AppError class errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err?.message }];
  }
  // handle express Error errors
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err?.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_environment === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;
