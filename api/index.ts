/** @format */
import express from "express";
const app = express();
const PORT = process.env.PORT || 8080;
/**
 * TODO
 */
app.get("/", (req, res, next) => {
  res.status(200).json({
    recipes: [],
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:PORT/`);
});
