import express, { Request, Response, Router } from "express";
import { getProducts } from "../services/product";

const router: Router = express.Router();

router.get("/", async (_: Request, res: Response) => {
  const products = await getProducts();
  return res.status(200).send(products);
});

export default router;
