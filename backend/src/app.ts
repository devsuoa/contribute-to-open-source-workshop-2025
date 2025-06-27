import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { createServer } from "http";
import routes from "./routes/routes.js";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT ?? 3000;
const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

if (!dbConnectionString) {
  throw new Error("❌ MONGODB_CONNECTION_STRING is not defined in .env");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", routes);

// Connect to MongoDB and then start server
mongoose
  .connect(dbConnectionString)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ App server listening on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
