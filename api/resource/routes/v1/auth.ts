/** @format */

import { Router } from "express";
import { requestLimiter } from "../../../utils/ratelimiter";
import controllers from "../../controllers";
const controller = controllers.v1.authController;
const router = Router();

router.post("/login", requestLimiter, controller.login);

router.post("/register", requestLimiter, controller.signup);

export default router;
