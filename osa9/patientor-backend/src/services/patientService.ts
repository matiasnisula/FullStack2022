import patientData from "../../data/patients";
import { Patient, NewPatient, EntryWithoutId, Entry } from "../types";
import utils from "../utils";
import { v1 as uuid } from "uuid";

const patients: Array<Patient> = patientData.map((obj) => {
  const patient = utils.parseNewPatient(obj) as Patient;
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

const addEntryToPatient = (
  id: string,
  entry: EntryWithoutId
): Entry | undefined => {
  const patient = findOne(id);
  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient?.entries.push(newEntry);
  return newEntry;
};

export default {
  getAll,
  getAllExcludeSsn,
  addPatient,
  findOne,
  addEntryToPatient,
};
