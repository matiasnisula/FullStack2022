import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSE_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY_TO_PATIENT";
      payload: {
        id: string;
        entry: Entry;
      };
    };

export const setPatientList = (patientList: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patientList,
  };
};

export const addNewPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient,
  };
};

export const updatePatient = (patient: Patient): Action => {
  return {
    type: "UPDATE_PATIENT",
    payload: patient,
  };
};

export const setDiagnoseList = (diagnoseList: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSE_LIST",
    payload: diagnoseList,
  };
};

export const addEntryToPatient = (id: string, entry: Entry): Action => {
  return {
    type: "ADD_ENTRY_TO_PATIENT",
    payload: { id, entry },
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "SET_DIAGNOSE_LIST":
      return {
        ...state,
        diagnoses: [...action.payload],
      };

    case "ADD_ENTRY_TO_PATIENT":
      const patient = {
        ...state.patients[action.payload.id],
      };
      const newEntries = patient.entries.concat(action.payload.entry);
      patient.entries = newEntries;
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: { ...patient },
        },
      };

    default:
      return state;
  }
};
