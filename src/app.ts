import { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiRoutes } from "./app/routes";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import globalErrorHandler from "./app/middlewares/globalErrorHandlerRoute";

const app = express();

// parsers (middleware)
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // your client url
app.use(cookieParser());

// api routes (middleware)
app.use("/api", ApiRoutes);

// base api route
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

// not found route
app.use(notFoundRoute);

// global error handler
app.use(globalErrorHandler);

export default app;
