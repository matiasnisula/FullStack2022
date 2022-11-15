import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField";
import { OccupationalHealthcareEntry, Diagnosis } from "../types";

export type OccupationalHealthcareFormValues = Omit<
  OccupationalHealthcareEntry,
  "id"
>;

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: OccupationalHealthcareFormValues) => void;
  onCancel: () => void;
}

export const AddEntryOccupationalHealthForm = ({
  diagnoses,
  onSubmit,
  onCancel,
}: Props) => {
  return (
    <Formik
      initialValues={{
        type: "OccupationalHealthcare",
        date: "",
        description: "",
        specialist: "",
        diagnosisCodes: [""],
        employerName: "",
        sickLeave: { startDate: "", endDate: "" },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string | object } = {};

        if (!values.date.trim()) {
          errors.date = requiredError;
        }
        if (!Date.parse(values.date) && values.date) {
          errors.date = "Invalid date";
        }
        if (!values.description.trim()) {
          errors.description = requiredError;
        }
        if (!values.specialist.trim()) {
          errors.specialist = requiredError;
        }
        if (!values.employerName.trim()) {
          errors.employerName = requiredError;
        }
        if (
          (values.sickLeave?.startDate && !values.sickLeave?.endDate) ||
          (!values.sickLeave?.startDate && values.sickLeave?.endDate)
        ) {
          errors.sickLeave = {
            startDate: "Both fields are required or fields must be empty",
            endDate: "Both fields are required or fields must be empty",
          };
        }
        if (
          values.sickLeave?.startDate &&
          !Date.parse(values.sickLeave.startDate)
        ) {
          errors.sickLeave = {
            ...(errors.sickLeave as object),
            startDate: "Invalid date",
          };
        }
        if (
          values.sickLeave?.endDate &&
          !Date.parse(values.sickLeave.endDate)
        ) {
          errors.sickLeave = {
            ...(errors.sickLeave as object),
            endDate: "Invalid date",
          };
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form occupationalHealthcare">
            <Field label="Date" name="date" component={TextField} />
            <Field
              label="Description"
              name="description"
              component={TextField}
            />
            <Field label="Specialist" name="specialist" component={TextField} />
            <DiagnosisSelection
              diagnoses={diagnoses}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
            <Field
              label="EmployerName"
              name="employerName"
              component={TextField}
            />
            <h3>Sick leave</h3>
            <Field
              label="StartDate"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="EndDate"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryOccupationalHealthForm;
