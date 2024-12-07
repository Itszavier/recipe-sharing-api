/** @format */
import { Router } from "express";
import v1Routes from "./v1";
import apiKeyAuth from "../../middleware/apikeyToken";

const router = Router();

router.use(apiKeyAuth);

router.use("/api/v1", v1Routes);

export default router;
