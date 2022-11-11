import patientData from "../../data/patients";
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
      entries: patient.entries,
    };
  });
};

const findOne = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getAll,
  getAllExcludeSsn,
  addPatient,
  findOne,
};
