import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  SelectField,
  HealthCheckOption,
  DiagnosisSelection,
} from "../AddPatientModal/FormField";
import { HealthCheckRating, HealthCheckEntry, Diagnosis } from "../types";

export type HealthCheckFormValues = Omit<HealthCheckEntry, "id">;

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: HealthCheckFormValues) => void;
  onCancel: () => void;
}

const healthCheckOptions: HealthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "LowRisk" },
  { value: HealthCheckRating.HighRisk, label: "HighRisk" },
  { value: HealthCheckRating.CriticalRisk, label: "CriticalRisk" },
];

export const AddEntryHealthCheckForm = ({
  diagnoses,
  onSubmit,
  onCancel,
}: Props) => {
  return (
    <Formik
      initialValues={{
        type: "HealthCheck",
        date: "",
        description: "",
        specialist: "",
        diagnosisCodes: [""],
        healthCheckRating: HealthCheckRating.Healthy,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder=""
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder=""
              name="specialist"
              component={TextField}
            />
            <SelectField
              label="HealthCheckRating"
              name="healthCheckRating"
              options={healthCheckOptions}
            />
            <DiagnosisSelection
              diagnoses={diagnoses}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
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

export default AddEntryHealthCheckForm;
