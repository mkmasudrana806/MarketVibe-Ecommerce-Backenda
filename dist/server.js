"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const DB_1 = __importDefault(require("./app/DB"));
let server;
// databas connection
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // await mongoose.connect("mongodb://127.0.0.1:27017/marketvibe");
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log("Database is connected!");
            // seed admin to database
            yield (0, DB_1.default)();
            // app listening
            server = app_1.default.listen(config_1.default.app_port, () => {
                console.log(`app listening on port ${config_1.default.app_port}`);
            });
        }
        catch (error) {
            console.log("Error while connecting to Database!", error);
        }
    });
}
// unhandledRejection error
process.on("unhandledRejection", () => {
    console.log("Unhandled rejection detected");
    if (server) {
        server.close(() => process.exit(1));
    }
    process.exit(1);
});
// uncaught exception handling
process.on("uncaughtException", () => {
    console.log("Uncaught exception detected");
    process.exit(1);
});
