import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { auth, checkBuyerPermission } from "../middleware/auth";
import { resetUserDeposit } from "../services/user";

const router: Router = express.Router();

// This route has relationship with user route, I am following some specs but personally
// I'd use /user/deposit/reset
router.post(
  "/",
  auth,
  checkBuyerPermission,
  async (req: Request, res: Response) => {
    try {
      const user = await resetUserDeposit(res.locals.user.id);

      if (!user) {
        return res.sendStatus(404);
      }

      return res.status(200).send(user);
    } catch (e) {
      return res
        .status(400)
        .send({ error: "Something went wrong when resetting user's deposit" });
    }
  }
);

export default router;