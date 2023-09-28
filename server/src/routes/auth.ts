import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/user";
import auth from "../middleware/auth";
import { randomUUID } from "crypto";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

const router: Router = express.Router();

const postLoginValidator = [
  body("email", "email cannot be empty").not().isEmpty(),
  body("email", "invalid email").isEmail(),
  body("password", "password cannot be empty").not().isEmpty(),
  body("password", "password minimum length is 6 characters").isLength({
    min: 6,
  }),
];

router.post(
  "/login",
  postLoginValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.sendStatus(400);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
      try {
        const uuid = randomUUID();
        const accessToken = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "7d",
          jwtid: uuid,
        });
        user.activeTokenId = uuid;
        await user.save();

        return res.status(200).send(accessToken);
      } catch (e) {
        console.error("[POST /login]", e);
        return res
          .status(400)
          .send({ message: "Something went wrong, try again" });
      }
    }

    return res.status(422).send({ errors: errors.array() });
  }
);

router.post("/logout/all", auth, (_, res: Response) => {
  return res
    .status(200)
    .send({ message: "successfully logged out from all sessions" });
});

export default router;
