
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routes/api.js";

const app = express();

// If behind a proxy (Heroku/Render/NGINX), keep this ON
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Mount API routes
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
