// error scource type
export type TErrorSources = {
  path: string | number;
  message: string;
}[];

// common error type for all error response
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
