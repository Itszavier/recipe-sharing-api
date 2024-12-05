/** @format */
import { Router } from "express";
import recipeRoutes from "./recipe";
import apiKeyAuth from "../middleware/apikeyToken";

const router = Router();

router.use(apiKeyAuth);

router.use("/recipe", recipeRoutes);

export default router;
