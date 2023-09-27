import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

const router: Router = express.Router();

const postLoginValidator = [
  body("email", "email cannot be empty").not().isEmpty(),
  body("email", "invalid email").isEmail(),
  body("password", "password cannot be empty").not().isEmpty(),
  body("password", "password minimum length is 6 characters").isLength({
    min: 6,
  }),
];

router.post("/login", postLoginValidator, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return res.status(200).send("random-access-token");
  }

  return res.status(422).send({ errors: errors.array() });
});

router.post("/logout/all", (req: Request, res: Response) => {
  return res
    .status(200)
    .send({ message: "successfully logged out all sessions" });
});

export default router;
