import express from "express";
import diagnoseService from "../services/diagnoseService";

const router = express.Router();

router.get("/", (_req, res) => {
  const result = diagnoseService.getAll();
  res.send(result);
});

export default router;
