import axios from "axios";
import { Field, Form, Formik, ErrorMessage, type FormikHelpers } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../store/hooks";
import { setToken, setUser } from "../store/slices/authSlice";
import type { AuthUser } from "../types/api";

type LoginFormValues = {
  username: string;
  password: string;
};

const loginSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const loginUrl = API_BASE_URL ? `${API_BASE_URL}/auth/login` : "/auth/login";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>
  ) => {
    const { setSubmitting, resetForm } = formikHelpers;
    setServerError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axios.post<{
        token: string;
        user: AuthUser;
      }>(loginUrl, values);
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
      setSuccessMessage("Login successful. Redirecting...");
      resetForm();
      setTimeout(() => navigate(data.user?.admin ? "/admin" : "/quizzes"), 800);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Unable to login. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "120px", maxWidth: "520px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            {serverError && <div className="alert alert-danger">{serverError}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <Field
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                autoComplete="username"
              />
              <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
            </div>

            <button className="btn btn-success w-100" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
            <p className="mt-3 text-center">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-success fw-semibold">
                Register here
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}
