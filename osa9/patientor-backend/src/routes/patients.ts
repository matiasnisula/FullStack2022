import express from "express";
import patientService from "../services/patientService";
import parseNewPatientEntry from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const result = patientService.getAllExcludeSsn();
  res.send(result);
});

router.post("/", (req, res) => {
  try {
    const patientToAdd = parseNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(patientToAdd);
    return res.json(addedPatient);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(400);
  }
});

export default router;
