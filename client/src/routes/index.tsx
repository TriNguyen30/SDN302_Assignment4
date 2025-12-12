import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/index";
import Home from "../pages/Home";
import Questions from "../pages/Questions";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import AdminQuizzes from "../pages/AdminQuizzes";
import AdminQuestions from "../pages/AdminQuestions";
import UserDashboard from "../pages/UserDashboard";
import QuizDetail from "../pages/QuizDetail";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quizzes/:quizId" element={<QuizDetail />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute requireAdmin>
              <AdminQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute requireAdmin>
              <AdminQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
