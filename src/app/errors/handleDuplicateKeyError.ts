import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// handle duplicate key error and return statusCode, message and errorSources
const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
  let statusCode = 401;
  // extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // extracted value will be in the first capturing group
  const extracted_message = match && match[1];
  let errorSources: TErrorSources = [
    {
      path: "",
      message: `${extracted_message} is already exists`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate key error",
    errorSources,
  };
};

export default handleDuplicateKeyError;
