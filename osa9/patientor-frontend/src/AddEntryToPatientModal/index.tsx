import React from "react";
import { Dialog, DialogTitle, DialogContent, Divider } from "@material-ui/core";
import AddEntryHealthCheckForm, {
  HealthCheckFormValues,
} from "./AddEntryHealthCheckForm";
import { Diagnosis } from "../types";

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: HealthCheckFormValues) => void;
  modalOpen: boolean;
  onClose: () => void;
}

const AddEntryToPatientModal = ({
  diagnoses,
  onSubmit,
  modalOpen,
  onClose,
}: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      <AddEntryHealthCheckForm
        diagnoses={diagnoses}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </DialogContent>
  </Dialog>
);

export default AddEntryToPatientModal;
