import express from "express";
import requireBody from "../../middleware/requireBody.js";
import { createUser, getUserByEmail } from "../../db/queries/users.js";
import { createToken } from "../../utils/jwt.js";
import getUserFromToken from "../../middleware/getUserFromToken.js";
import requireUser from "../../middleware/requireUser.js";

const usersRouter = express.Router();

usersRouter.post(
  "/signup",
  requireBody(["email", "password", "firstName", "lastName"]),
  async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      // create a user in the db
      const user = await createUser(email, password, firstName, lastName);
      // create and send the access token
      const payload = { id: user.id };
      const accessToken = createToken(payload);
      res.status(201).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // check if user exists and verify the password
      const user = await getUserByEmail(email, password);
      if (!user) return res.status(401).send("Invalid username or password.");

      // create and send the access token
      const payload = { id: user.id };
      const accessToken = createToken(payload);
      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/dashboard",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
