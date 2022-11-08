import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

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

app.post("/exercises", (req, res) => {
  /* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access
   */
  const body: any = req.body;
  const dailyExercises: any = body.daily_exercises;
  const target: any = body.target;

  if (!dailyExercises || !target) {
    return res.status(400).json({
      error: "parameters missing",
    });
  }
  if (!Array.isArray(dailyExercises) || isNaN(Number(target))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const dailyExercisesNumArr: Array<number> = [];
  for (const elem of dailyExercises) {
    if (isNaN(Number(elem))) {
      return res.status(400).json({
        error: "malformatted parameters",
      });
    }
    dailyExercisesNumArr.push(Number(elem));
  }

  const resultCalcExercises = calculateExercises(
    Number(target),
    dailyExercisesNumArr
  );
  /* eslint-enable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access
  */
  return res.json(resultCalcExercises);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
