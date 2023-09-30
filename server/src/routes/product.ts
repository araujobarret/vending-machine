import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { auth, checkSellerPermission } from "../middleware/auth";
import {
  getProduct,
  isProductServiceError,
  saveProduct,
  updateProduct,
} from "../services/product";

const postPutValidator = [
  body("productName", "productName cannot be empty").notEmpty(),
  body("productName", "productName minimum length is 1 character").isLength({
    min: 1,
  }),
  body("cost", "cost cannot be empty").notEmpty(),
  body("cost", "cost must be a number between 0 and 99").isFloat({
    min: 0,
    max: 99,
  }),
  body("cost", "cost's mantissa must be multiple of 5").custom(
    (value: number) => {
      const mantissa = parseInt(value.toFixed(2).split(".")[1]);

      return mantissa === 0 || mantissa % 5 === 0;
    }
  ),
  body("amountAvailable", "amountAvailable cannot be empty").notEmpty(),
  body(
    "amountAvailable",
    "amountAvailable must be a number between 1 and 999"
  ).isInt({ max: 999, min: 1 }),
];

const router: Router = express.Router();

router.post(
  "/",
  postPutValidator,
  auth,
  checkSellerPermission,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const product = await saveProduct({
        ...req.body,
        sellerId: res.locals.user.id,
      });

      if (isProductServiceError(product)) {
        return res.status(product.code).send(product);
      }

      return res.status(200).send(product);
    }

    return res.status(422).send({ errors: errors.array() });
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await getProduct(req.params.id);
    if (product) {
      return res.status(200).send(product);
    }

    return res.sendStatus(404);
  } catch (e) {
    return res
      .status(400)
      .send({ error: "Something went wrong when getting the product" });
  }
});

router.put(
  "/:id",
  postPutValidator,
  auth,
  checkSellerPermission,
  async (req: Request, res: Response) => {
    try {
      const product = await updateProduct({ ...req.body, id: req.params.id });

      if (!product) {
        return res.sendStatus(404);
      }

      if (isProductServiceError(product)) {
        return res.status(product.code).send(product);
      }

      return res.status(200).send(product);
    } catch (e) {
      return res
        .status(400)
        .send({ error: "Something went wrong when getting the product" });
    }
  }
);

router.delete(
  "/:id",
  auth,
  checkSellerPermission,
  async (req: Request, res: Response) => {
    try {
      const product = await updateProduct({ ...req.body, id: req.params.id });
      if (product) {
        return res.sendStatus(200);
      }

      return res.sendStatus(404);
    } catch (e) {
      return res
        .status(400)
        .send({ error: "Something went wrong when deleting the product" });
    }
  }
);

export default router;
