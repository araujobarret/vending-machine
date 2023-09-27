import express, { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import auth from "../middleware/auth";
import { roles } from "../models/user";

const postUserValidator = [
  body("email", "email cannot be empty").not().isEmpty(),
  body("email", "invalid email").isEmail(),
  body("password", "password cannot be empty").not().isEmpty(),
  body("password", "password minimum length is 6 characters").isLength({
    min: 6,
  }),
  body("role", "role cannot be empty").not().isEmpty(),
  body("role", "role must be seller or buyer").isIn(roles),
];

const getUserValidator = [query("id", "invalid user id").isUUID()];

const router: Router = express.Router();

router.post("/", postUserValidator, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email, role } = req.body;
    return res.status(201).send({ email, role, amount: 0, id: "temporary-id" });
  }

  return res.status(422).send({ errors: errors.array() });
});

router.get("/:id", getUserValidator, auth, (req: Request, res: Response) => {
  console.log("query", req.query);
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return res.status(200).send({});
  }

  return res.status(422).send({ errors: errors.array() });
});

export default router;
