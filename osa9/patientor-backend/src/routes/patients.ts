import express from "express";
import patientService from "../services/patientService";
import parseNewPatient from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const result = patientService.getAllExcludeSsn();
  res.send(result);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const patient = patientService.findOne(id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({
      error: "Patient not found",
    });
  }
});

router.post("/", (req, res) => {
  try {
    const patientToAdd = parseNewPatient(req.body);
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
