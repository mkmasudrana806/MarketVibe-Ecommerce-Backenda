import { JwtPayload } from "jsonwebtoken";

// add user property to Request object
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
