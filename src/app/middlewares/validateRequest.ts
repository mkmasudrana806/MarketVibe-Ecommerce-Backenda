import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyZodObject } from "zod";
import asyncHanlder from "../utils/asyncHandler";

/**
 * ---------------------- validate Client Request Data ------------------
 * @param schema any zod validation schema
 * @returns return parsed data to the next middleware
 */
const validateRequestData = (schema: AnyZodObject) => {
  return asyncHanlder(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      next();
    }
  );
};

export default validateRequestData;
