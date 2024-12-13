import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import { Error } from "mongoose";

// handle validation error and return statusCode, message and errorSources
const handleValidationError = (
  err: Error.ValidationError
): TGenericErrorResponse => {
  let statusCode = 401;
  let errorSources: TErrorSources = Object.values(err.errors).map(
    (error: Error.ValidatorError | Error.CastError) => ({
      path: error.path,
      message: error.message,
    })
  );

  return {
    statusCode,
    message: "Mongoose validation error",
    errorSources,
  };
};

export default handleValidationError;
