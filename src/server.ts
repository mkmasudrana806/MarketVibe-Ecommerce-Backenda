import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";
import { Server } from "http";
import seedAdmin from "./app/DB";

let server: Server;

// databas connection
main().catch((err) => console.log(err));
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/auth");
    console.log("Database is connected!");

    // seed admin to database
    await seedAdmin();
    // app listening
    server = app.listen(config.database_url, () => {
      console.log(`app listening on port ${config.database_url}`);
    });
  } catch (error) {
    console.log("Error while connecting to Database!", error);
  }
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
