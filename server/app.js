import express from "express";
import cors from "cors";
import eventsRouter from "./api/routes/eventsRouter.js";
import usersRouter from "./api/routes/usersRouter.js";
import favoritesRouter from "./api/routes/favoritesRouter.js";

const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? process.env.CORS_ORIGIN // production frontend URL
  : "http://localhost:5173";

const app = express();

app.use(express.json());

// Allow requests from frontend origin in development
app.use(
  cors({
    origin: corsOrigin,
  })
);

app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);
app.use("/api/favorites", favoritesRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong. Please try again later.");
});

export default app;
