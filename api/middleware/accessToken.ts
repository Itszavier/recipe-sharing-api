/** @format */

import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/functions";

export default function accessTokenAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <accessToken>

  if (!token) {
    res.status(401).json({ message: "Access token missing" });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  req.user = decoded;
  next();
}
