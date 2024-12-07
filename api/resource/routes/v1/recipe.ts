/** @format */

import { Router } from "express";
import { requestLimiter } from "../../../utils/ratelimiter";
import controllers from "../../controllers";

const controller = controllers.v1.recipeController;

const router = Router();

router.post("/create", controller.create);

router.delete(
  "/delete/:recipeId",
  requestLimiter,
  controller.deleteById
);

router.get("/", controller.getAll);

router.get("/search", controller.search);

export default router;
