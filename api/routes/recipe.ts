/** @format */

import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const recipes = await prisma.recipe.findMany();

    res
      .status(200)
      .json({ message: "here is the list ", recipes });

  } catch (error) {
    next(error);
  }
});

router.post("/create", (req, res, next) => {

});

router.delete("/delete", (req, res, next) => {});

export default router;
