import dotenv from "dotenv";
dotenv.config();
import express from "express";
import routes from "./routes/index.js";
import { pool } from "./db/connection.js";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// cleanup

function shutdown() {
  server.close(() => {
    pool
      .end()
      .then(() => {
        console.log("Server and database pool closed");
        process.exit(0);
      })
      .catch((err) => {
        console.error("Error closing pool:", err);
        process.exit(1);
      });
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
