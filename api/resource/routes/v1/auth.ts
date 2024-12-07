/** @format */

import { Router } from "express";
import { requestLimiter } from "../../../utils/ratelimiter";
import controllers from "../../controllers";

const router = Router();

router.post(
  "/login",
  requestLimiter,
  controllers.v1.authController.login
);

router.post(
  "/register",
  requestLimiter,
  controllers.v1.authController.signup
);

export default router;
