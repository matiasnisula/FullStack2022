import express from "express";
import patientService from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  const result = patientService.getAllExcludeSsn();
  res.send(result);
});

export default router;
