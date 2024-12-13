import { Response } from "express";

type TSendResponse<T, U> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: U;
  data: T;
};

/**
 * @param res res  object
 * @param data data
 */
const sendResponse = <T, U>(res: Response, data: TSendResponse<T, U>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data?.meta,
    data: data.data,
  });
};

export default sendResponse;
