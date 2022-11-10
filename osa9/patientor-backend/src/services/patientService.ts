import patientData from "../../data/patients.json";
import { Patient, NewPatient } from "../types";
import parseNewPatient from "../utils";
import { v1 as uuid } from "uuid";

const patients: Array<Patient> = patientData.map((obj) => {
  const patient = parseNewPatient(obj) as Patient;
  patient.id = obj.id;
  return patient;
});

const getAll = (): Array<Patient> => {
  return patients;
};

const getAllExcludeSsn = (): Array<Omit<Patient, "ssn">> => {
  return patients.map((patient) => {
    return {
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      occupation: patient.occupation,
      entries: [],
    };
  });
};

const findOne = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
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
  findOne,
};
