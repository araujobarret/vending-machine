import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { auth, checkBuyerPermission } from "../middleware/auth";
import { incrementUserDeposit } from "../services/user";

const router: Router = express.Router();

const postValidator = [
  body("coin", "coin must not be empty").notEmpty(),
  body("coin", "const accepted are '5', '10', '20', '50', and '100'").isIn([
    5, 10, 20, 50, 100,
  ]),
];

// This route has relationship with user route, I am following some specs but personally
// I'd use /user/deposit
router.post(
  "/",
  postValidator,
  auth,
  checkBuyerPermission,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const user = await incrementUserDeposit({
          id: res.locals.user.id,
          coin: req.body.coin,
        });

        if (!user) {
          return res.sendStatus(404);
        }

        return res.status(200).send(user);
      } catch (e) {
        return res
          .status(400)
          .send({
            error: "Something went wrong when incrementing user's deposit",
          });
      }
    }

    return res.status(422).send({ errors: errors.array() });
  }
);

export default router;
