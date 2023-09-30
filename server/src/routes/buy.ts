import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  // TODO: racing condition control to avoid leaving a user
  // deposit in debt

  return res.sendStatus(200);
});

export default router;
