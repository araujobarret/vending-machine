import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { auth } from "../middleware/auth";
import { roles } from "../models/user";
import { deleteUser, getUser, saveUser, updateUser } from "../services/user";

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

const patchUserValidator = [
  body("role", "role cannot be empty").notEmpty(),
  body("deposit", "deposit cannot be empty").notEmpty(),
  body("deposit", "deposit must be a number").isFloat({
    min: 0.01,
    max: 999.99,
  }),
  body("deposit", "deposit's mantissa must be multiple of 5").custom(
    (value: number) => {
      const mantissa = parseInt(value.toFixed(2).split(".")[1]);

      return mantissa === 0 || mantissa % 5 === 0;
    }
  ),
];

const router: Router = express.Router();

router.post("/", postUserValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = await saveUser(req.body);
      return res.status(201).send(user);
    } catch (e) {
      return res.status(500).send({ message: "Internal server error" });
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

    return res.sendStatus(404);
  } catch (e) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.patch(
  "/:id",
  patchUserValidator,
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const user = await updateUser({ ...req.body, id: req.params.id });
        if (!user) {
          return res.sendStatus(404);
        }

        return res.status(200).send(user);
      } catch (e) {
        return res.status(500).send({ message: "Internal server error" });
      }
    }
    return res.status(422).send({ errors: errors.array() });
  }
);

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
    return res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
