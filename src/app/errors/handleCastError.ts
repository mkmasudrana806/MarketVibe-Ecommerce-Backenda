import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import { Error } from "mongoose";

// handle cast error and return statusCode, message and errorSources
const handleCastError = (err: Error.CastError): TGenericErrorResponse => {
  let statusCode = 401;
  
  let errorSources: TErrorSources = [
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

export default handleCastError;
