import patientData from "../../data/patients.json";
import { PatientEntry, NewPatientEntry } from "../types";
import parseNewPatientEntry from "../utils";
import { v1 as uuid } from "uuid";

const patients: Array<PatientEntry> = patientData.map((obj) => {
  const patient = parseNewPatientEntry(obj) as PatientEntry;
  patient.id = obj.id;
  return patient;
});

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

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getAll,
  getAllExcludeSsn,
  addPatient,
};
