/** @format */
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 8080;

/**
 * TODO
 */
app.use(cors());
app.use(express.json());
//routes
app.use("/auth", authRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({
    recipes: [],
  });
});

app.listen(PORT, () => {
  console.log(`Alive on http://localhost:${PORT}/`);
});
