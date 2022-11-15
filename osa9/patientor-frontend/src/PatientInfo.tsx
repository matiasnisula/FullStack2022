import React from "react";
import axios from "axios";
import { apiBaseUrl } from "./constants";
import { useParams } from "react-router-dom";
import { useStateValue, updatePatient, addEntryToPatient } from "./state";
import { Entry, Patient } from "./types";
import AddEntryToPatientModal from "./AddEntryToPatientModal";
import { Button } from "@material-ui/core";
import { HealthCheckFormValues } from "./AddEntryToPatientModal/AddEntryHealthCheckForm";
import { HospitalFormValues } from "./AddEntryToPatientModal/AddEntryHospitalForm";
import { OccupationalHealthcareFormValues } from "./AddEntryToPatientModal/AddEntryOccupationalHealthForm";

export type EntryFormValues =
  | HealthCheckFormValues
  | HospitalFormValues
  | OccupationalHealthcareFormValues;

const PatientInfo = () => {
  const entryTypes = ["HealthCheck", "Hospital", "OccupationalHealthcare"];
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const [patient, setPatient] = React.useState<Patient>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [entryType, setEntryType] = React.useState<string>(entryTypes[0]);

  const closeModal = (): void => {
    setModalOpen(false);
  };

  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const foundFromState = Object.values(patients).find((patient) => {
      return patient.id === id;
    });
    if (foundFromState?.ssn) {
      setPatient(foundFromState);
      return;
    }
    const fetchPatientInfo = async () => {
      try {
        const { data: resultPatient } = await axios.get<Patient>(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(resultPatient));
        setPatient(resultPatient);
      } catch (error) {
        console.log(error);
      }
    };
    void fetchPatientInfo();
  }, [patients]);

  const submitNewEntryToPatient = async (values: EntryFormValues) => {
    try {
      if (!id) {
        return;
      }
      const { data: newEntry } = await axios.post<Entry>(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntryToPatient(id, newEntry));
      closeModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error?.response?.data || "Some axios error");
      } else {
        console.log("Unknown error:", error);
      }
    }
  };

  const handleEntryTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setEntryType(e.target.value);
  };

  const findDiagnose = (code: string) => {
    return diagnoses.find((diagnose) => {
      return diagnose.code === code;
    });
  };

  if (!patient) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h2>{patient.name}</h2>
      <p>gender: {patient.gender}</p>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <div>
        <h3>entries</h3>
      </div>
      {patient.entries.map((entry) => {
        return (
          <div key={entry.id}>
            <p>
              {entry.date} {entry.description}
            </p>
            <ul>
              {entry.diagnosisCodes?.map((code) => {
                const diagnose = findDiagnose(code);
                return (
                  <li key={code}>
                    {code} {diagnose ? diagnose.name : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <div>
        <AddEntryToPatientModal
          entryType={entryType}
          diagnoses={diagnoses}
          onSubmit={submitNewEntryToPatient}
          modalOpen={modalOpen}
          onClose={closeModal}
        />
      </div>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add New Entry
      </Button>
      <div>
        <strong>Choose entry type: </strong>
        <select name="types" value={entryType} onChange={handleEntryTypeChange}>
          {entryTypes.map((entry) => {
            return (
              <option key={entry} value={entry}>
                {entry}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
export default PatientInfo;
