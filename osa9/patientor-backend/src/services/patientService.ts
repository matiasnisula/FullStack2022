import patientData from "../../data/patients.json";
import { PatientEntry } from "../types";

const patients: Array<PatientEntry> = patientData;

const getAll = (): Array<PatientEntry> => {
  return patients;
};

const getAllExcludeSsn = (): Array<Omit<PatientEntry, "ssn">> => {
  return patients.map((patient) => {
    return {
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      occupation: patient.occupation,
    };
  });
};

export default {
  getAll,
  getAllExcludeSsn,
};
