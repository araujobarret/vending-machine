import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { auth } from "../middleware/auth";
import { isAuthServiceError, login } from "../services/auth";
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
      try {
        const userOrError = await login(req.body);

        if (isAuthServiceError(userOrError)) {
          return res.status(userOrError.statusCode).send(userOrError);
        }

        return res.status(200).send(userOrError);
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
