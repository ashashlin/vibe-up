import express from "express";
import eventsRouter from "./api/routes/eventsRouter.js";
import usersRouter from "./api/routes/usersRouter.js";

const app = express();

app.use(express.json());

app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);

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
