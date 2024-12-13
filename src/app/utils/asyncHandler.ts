import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * ---------------------- async handler -----------------------
 *
 * @param fn controller function that need to resolve async requests
 * @returns return a promise
 */
const asyncHanlder = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default asyncHanlder;
