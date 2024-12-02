/** @format */
import express from "express";
import authRoutes from "./routes/auth";
const app = express();
const PORT = process.env.PORT || 8080;

/**
 * TODO
*/

app.use(express.json());
app.use(authRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({
    recipes: [],
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:PORT/`);
});
