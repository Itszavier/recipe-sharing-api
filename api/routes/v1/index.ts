/** @format */

import express from "express";
import authRoutes from "./auth";
import recipeRoutes from "./recipe";
import apiKeysRoutes from "./keys";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api_keys", apiKeysRoutes);
router.use("/recipe", recipeRoutes);


export default router;
