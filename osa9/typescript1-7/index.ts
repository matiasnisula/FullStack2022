import express from "express";
import { calculateBmi } from "./bmiCalculator";
const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  if (!height || !weight) {
    return res.status(400).json({
      error: "missing parameters",
    });
  }
  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }
  const resultBmi = calculateBmi(Number(height), Number(weight));
  return res.json({
    weight: Number(weight),
    height: Number(height),
    bmi: resultBmi,
  });
});

/*
app.use("/bmi", (req, _res, next) => {
  console.log("URL:", req.originalUrl);
  console.log("PATH:", req.path);
  console.log("baseUrl:", req.baseUrl);
  console.log("req.query:", req.query);
  next();
});
*/

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
