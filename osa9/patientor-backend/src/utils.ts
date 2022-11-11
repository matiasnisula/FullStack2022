import { NewPatient, Gender, EntryWithoutId, HealthCheckRating } from "./types";

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
const parseNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    entries: object.entries ? object.entries : [],
  };
  return newPatient;
};

//parse fields description, specialist, employerName, discharge.criteria
const parseEntryString = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error("Invalid input");
  }
  return str;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating)) {
    throw new Error(`Invalid healthcheck rating ${rating}`);
  }
  return rating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseOccupationalHealthCareEntry = (object: any): EntryWithoutId => {
  const newEntry: EntryWithoutId = {
    date: parseDate(object.date),
    description: parseEntryString(object.description),
    specialist: parseEntryString(object.specialist),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: object.type,
    employerName: parseEntryString(object.employerName),
  };
  if (object.diagnosisCodes) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    newEntry.diagnosisCodes = object.diagnosisCodes;
  }
  if (object.sickLeave) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    newEntry.sickLeave = object.sickLeave;
  }
  return newEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseHospitalEntry = (object: any): EntryWithoutId => {
  const newHospitalEntry: EntryWithoutId = {
    date: parseDate(object.date),
    description: parseEntryString(object.description),
    specialist: parseEntryString(object.specialist),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: object.type,
    discharge: {
      date: parseDate(object.discharge.date),
      criteria: parseEntryString(object.discharge.criteria),
    },
  };
  if (object.diagnosisCodes) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    newHospitalEntry.diagnosisCodes = object.diagnosisCodes;
  }
  return newHospitalEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseHealthCheckEntry = (object: any): EntryWithoutId => {
  const newHealthCheckEntry: EntryWithoutId = {
    date: parseDate(object.date),
    description: parseEntryString(object.description),
    specialist: parseEntryString(object.specialist),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: object.type,
    healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
  };
  if (object.diagnosisCodes) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    newHealthCheckEntry.diagnosisCodes = object.diagnosisCodes;
  }
  return newHealthCheckEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseNewEntry = (object: any): EntryWithoutId => {
  switch (object.type) {
    case "OccupationalHealthcare":
      return parseOccupationalHealthCareEntry(object);
    case "Hospital":
      return parseHospitalEntry(object);
    case "HealthCheck":
      return parseHealthCheckEntry(object);
    default:
      throw new Error("Invalid entry type");
  }
};

export default { parseNewPatient, parseNewEntry };
