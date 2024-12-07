/** @format */
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import apiRoutes from "./resource/routes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", function (req, res, next) {
  res.status(200).send("welcome to our recipe libaray");
});

app.use(function (req, res, next) {
  res.status(404).json({
    message:
      "Oops! Seems like you've wandered out of the library's bounds. 📚 Let's get you back on track!",
  });
});

app.use(function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message,
    err,
  });
});

app.listen(PORT, () => {
  console.log(`Alive on http://localhost:${PORT}/`);
});
