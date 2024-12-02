/** @format */

import { Router } from "express";
import accessTokenAuth from "../middleware/accessToken";

const router = Router();

router.use(accessTokenAuth);

router.get("/", (req, res, next) => {});

router.post("/create", (req, res, next) => {});

router.delete("/delete", (req, res, next) => {});

export default router;
