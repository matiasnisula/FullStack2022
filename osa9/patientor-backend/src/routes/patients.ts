import express from "express";
import patientService from "../services/patientService";
import utils from "../utils";

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
    const patientToAdd = utils.parseNewPatient(req.body);
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

router.post("/:id/entries", (req, res) => {
  const patientId = req.params.id;
  try {
    const entryToAdd = utils.parseNewEntry(req.body);
    const addedEntry = patientService.addEntryToPatient(patientId, entryToAdd);
    if (addedEntry) {
      res.json(addedEntry);
    } else {
      res.json(400).json({
        error: "Patient not found",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
});

export default router;
