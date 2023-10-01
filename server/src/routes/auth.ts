import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { auth } from "../middleware/auth";
import { userModel } from "../models/user";
import { createAccessToken } from "../services/auth";
import { unsetActiveTokenId } from "../services/user";

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
        return res.status(400).json({ message: "Invalid credentials" });
      }

      try {
        // TODO: check for already logged-in session
        const { accessToken, jwtid, exp } = createAccessToken(user);
        await userModel.findOneAndUpdate(
          { _id: user.id },
          { $set: { activeTokenId: jwtid } }
        );

        return res.status(200).send({ accessToken, exp });
      } catch (e) {
        return res.status(500).send({ message: "Login has failed" });
      }
    }

    return res.status(422).send({ errors: errors.array() });
  }
);

router.post("/logout/all", auth, async (_, res: Response) => {
  try {
    await unsetActiveTokenId(res.locals?.user?.id);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send({ message: "Logout has failed" });
  }
});

export default router;
