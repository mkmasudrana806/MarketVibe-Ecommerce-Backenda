import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// handle zod error and return statusCode, message and errorSources
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  let statusCode = 401;
  let errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));

  return {
    statusCode,
    message: "Zod validation error",
    errorSources,
  };
};

export default handleZodError;
