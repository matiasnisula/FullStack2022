import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField";
import { HospitalEntry, Diagnosis } from "../types";

export type HospitalFormValues = Omit<HospitalEntry, "id">;

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: HospitalFormValues) => void;
  onCancel: () => void;
}

export const AddEntryHospitalForm = ({
  diagnoses,
  onSubmit,
  onCancel,
}: Props) => {
  return (
    <Formik
      initialValues={{
        type: "Hospital",
        date: "",
        description: "",
        specialist: "",
        diagnosisCodes: [""],
        discharge: { date: "", criteria: "" },
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
        if (!Date.parse(values.discharge.date)) {
          errors.discharge = {
            date: "Invalid date!",
            ...(errors.discharge as object),
          };
        }
        if (!values.discharge.date) {
          errors.discharge = {
            date: requiredError,
            ...(errors.discharge as object),
          };
        }
        if (!values.discharge.criteria) {
          errors.discharge = {
            ...(errors.discharge as object),
            criteria: requiredError,
          };
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form hospital">
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
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
            <h3>Discharge</h3>
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />
            <Field
              label="Criteria"
              name="discharge.criteria"
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

export default AddEntryHospitalForm;
