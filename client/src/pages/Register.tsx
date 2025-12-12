import axios from "axios";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const schema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

export default function Register() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container" style={{ marginTop: "120px", maxWidth: "520px" }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      {serverMessage && <div className="alert alert-success">{serverMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setServerMessage(null);
          setError(null);
          try {
            await axios.post(`${API_BASE_URL}/auth/register`, values);
            setServerMessage("Account created. You can log in now.");
            resetForm();
          } catch (e) {
            setError("Failed to register. Try a different username.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <Field id="username" name="username" className="form-control" />
              <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <Field id="password" name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
            </div>
            <button className="btn btn-success w-100" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
            <p className="mt-3 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-success fw-semibold">
                Login here
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}
