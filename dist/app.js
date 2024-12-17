"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const notFoundRoute_1 = __importDefault(require("./app/middlewares/notFoundRoute"));
const globalErrorHandlerRoute_1 = __importDefault(require("./app/middlewares/globalErrorHandlerRoute"));
const app = (0, express_1.default)();
// parsers (middleware)
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true })); // your client url
app.use((0, cookie_parser_1.default)());
// api routes (middleware)
app.use("/api", routes_1.ApiRoutes);
// base api route
app.get("/", (req, res) => {
    res.send("Server is running...");
});
// not found route
app.use(notFoundRoute_1.default);
// global error handler
app.use(globalErrorHandlerRoute_1.default);
exports.default = app;
