import express from "express";
import "dotenv/config";
import { createServer } from "http";
import routes from "./routes/routes.js";
import cors from "cors";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT ?? 3000;
const ORIGIN = process.env.ORIGIN ?? "http://localhost:5173";

// Middleware
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use("/", routes);

server.listen(PORT, () => {
  console.log(`✅ App server listening on port ${PORT}!`);
});
