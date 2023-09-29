import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { auth } from "../middleware/auth";
import { roles } from "../models/user";
import { deleteUser, getUser, saveUser } from "../services/user";

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

const router: Router = express.Router();

router.post("/", postUserValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = saveUser(req.body);
      return res.status(200).send(user);
    } catch (e) {
      return res
        .status(400)
        .send({ error: "Something went wrong when trying to register" });
    }
  }

  return res.status(422).send({ errors: errors.array() });
});

router.delete("/", auth, async (_, res: Response) => {
  try {
    const user = await deleteUser(res.locals.user.id);
    if (user !== null) {
      return res.sendStatus(200);
    }

    return res.status(400).send({ message: "user not found" });
  } catch (e) {
    return res.send(400).send({ message: "error when deleting the user" });
  }
});

router.patch("/", auth, async (req: Request, res: Response) => {});

router.get("/:id", auth, async (req: Request, res: Response) => {
  // Users are only allowed to get their own information, not about the other users
  if (req.params.id !== res.locals.user.id) {
    return res.sendStatus(403);
  }

  try {
    const user = await getUser(req.params.id);
    if (user) {
      return res.status(200).send(user);
    }

    return res.sendStatus(404);
  } catch (e) {
    return res
      .status(400)
      .send({ error: "Something went wrong when getting the user" });
  }
});

export default router;
