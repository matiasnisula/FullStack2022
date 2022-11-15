import React from "react";
import { Dialog, DialogTitle, DialogContent, Divider } from "@material-ui/core";
import AddEntryHealthCheckForm from "./AddEntryHealthCheckForm";
import AddEntryHospitalForm from "./AddEntryHospitalForm";
import AddEntryOccupationalHealthForm from "./AddEntryOccupationalHealthForm";
import { Diagnosis } from "../types";
import { EntryFormValues } from "../PatientInfo";

interface Props {
  entryType: string;
  diagnoses: Diagnosis[];
  onSubmit: (values: EntryFormValues) => void;
  modalOpen: boolean;
  onClose: () => void;
}

const AddEntryToPatientModal = ({
  entryType,
  diagnoses,
  onSubmit,
  modalOpen,
  onClose,
}: Props) => {
  const healthCheckForm = (
    <AddEntryHealthCheckForm
      diagnoses={diagnoses}
      onSubmit={onSubmit}
      onCancel={onClose}
    />
  );
  const hospitalForm = (
    <AddEntryHospitalForm
      diagnoses={diagnoses}
      onSubmit={onSubmit}
      onCancel={onClose}
    />
  );

  const occupationalHealthcareForm = (
    <AddEntryOccupationalHealthForm
      diagnoses={diagnoses}
      onSubmit={onSubmit}
      onCancel={onClose}
    />
  );

  let formToRender: JSX.Element | undefined;
  switch (entryType) {
    case "Hospital":
      formToRender = hospitalForm;
      break;
    case "HealthCheck":
      formToRender = healthCheckForm;
      break;
    case "OccupationalHealthcare":
      formToRender = occupationalHealthcareForm;
      break;
    default:
      console.log("Unknown entry type", entryType);
      break;
  }

  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new entry ({entryType})</DialogTitle>
      <Divider />
      <DialogContent>{formToRender}</DialogContent>
    </Dialog>
  );
};

export default AddEntryToPatientModal;
