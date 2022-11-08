type Rating = 1 | 2 | 3;

interface Summary {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  target: number,
  dailyExerciseHours: number[]
): Summary => {
  const periodLength: number = dailyExerciseHours.length;
  let trainingDays = 0;
  let success = true;
  let rating: Rating;

  let sum = 0;
  const ratingDescriptionObj = {
    1: "really bad",
    2: "not too bad but could be better",
    3: "Good job! The target has been reached!",
  };

  for (let i = 0; i < periodLength; i++) {
    if (dailyExerciseHours[i] <= 0) {
      continue;
    }
    sum += dailyExerciseHours[i];
    trainingDays++;
  }
  const average = isNaN(sum / periodLength) ? 0 : sum / periodLength;

  if (average < target) {
    success = false;
  }

  if (average >= target) {
    rating = 3;
  } else if (target - average < 0.3) {
    rating = 2;
  } else {
    rating = 1;
  }
  const ratingDescription = ratingDescriptionObj[rating];

  const summary = {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };

  return summary;
};

interface ExerciseCalcValues {
  target: number;
  dailyExerciseHours: Array<number>;
}

const parseArgumentsExercisesCalc = (
  args: Array<string>
): ExerciseCalcValues => {
  if (args.length === 2) {
    return {
      target: 2,
      dailyExerciseHours: [3, 0, 2, 4.5, 0, 3, 1],
    };
  }
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }
  let target = 0;
  const dailyExerciseHours: Array<number> = [];
  for (let i = 2; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error("Provided values were not numbers");
    }
    if (i === 2) {
      target = Number(args[i]);
      continue;
    }
    dailyExerciseHours.push(Number(args[i]));
  }
  return {
    target,
    dailyExerciseHours,
  };
};

try {
  const { target, dailyExerciseHours } = parseArgumentsExercisesCalc(
    process.argv
  );
  console.log(calculateExercises(target, dailyExerciseHours));
} catch (error) {
  if (error instanceof Error) {
    console.log("ERROR:", error.message);
  }
}
