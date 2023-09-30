import express, { Request, Response, Router } from "express";
import { auth, checkBuyerPermission } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import { buy, isBuyServiceError } from "../services/buy";

const router: Router = express.Router();

const postValidator = [
  body("productId", "productId cannot be empty").not().isEmpty(),
  body("amountOfProducts", "amountOfProducts cannot be empty").notEmpty(),
  body("amountOfProducts", "amountOfProducts cannot be empty").isInt({
    min: 1,
    max: 999,
  }),
];

router.post(
  "/",
  postValidator,
  auth,
  checkBuyerPermission,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const data = await buy({ ...req.body, userId: res.locals.user.id });

      if (isBuyServiceError(data)) {
        return res.status(data.statusCode).send(data);
      }

      return res.status(200).send(data);
    }
    return res.status(422).send({ errors: errors.array() });
  }
);

export default router;
