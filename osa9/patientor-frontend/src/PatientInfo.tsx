import React from "react";
import axios from "axios";
import { apiBaseUrl } from "./constants";
import { useParams } from "react-router-dom";
import { useStateValue, updatePatient } from "./state";
import { Patient } from "./types";

const PatientInfo = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = React.useState<Patient>();

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
  }, []);

  if (!patient) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h2>{patient.name}</h2>
      <p>gender: {patient.gender}</p>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
    </div>
  );
};
export default PatientInfo;
