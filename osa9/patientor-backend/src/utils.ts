import { NewPatientEntry, Gender } from "./types";

const isString = (str: unknown): str is string => {
  return typeof str === "string" || str instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isSsn = (ssn: string): boolean => {
  const re = /\d{6}-\w{3,4}/;
  return re.test(ssn);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(`Invalid gender ${gender}`);
  }
  return gender;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn) || !isSsn(ssn)) {
    throw new Error("Invalid ssn");
  }
  return ssn;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Invalid or missing date: ${date}`);
  }
  return date;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name) || !name.trim()) {
    throw new Error(`Name ${name} is not valid`);
  }

  return name;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error(`Invalid occupation: ${occupation}`);
  }
  return occupation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseNewPatientEntry = (object: any): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
  };
  return newEntry;
};

export default parseNewPatientEntry;
