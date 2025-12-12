import { FormEvent, useEffect, useState } from "react";
import axios from "../lib/axios";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizzes, setQuizzes } from "../store/slices/quizSlice";
import type { Quiz } from "../types/api";

export default function AdminQuizzes() {
  const dispatch = useAppDispatch();
  const { items: quizzes } = useAppSelector((state) => state.quizzes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Quiz[]>("/quizzes");
      dispatch(setQuizzes(data));
    } catch (err) {
      setError("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchQuizzes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setEditId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editId) {
        await axios.put(`/quizzes/${editId}`, form);
        setSuccess("Quiz updated");
      } else {
        await axios.post("/quizzes", form);
        setSuccess("Quiz created");
      }
      resetForm();
      loadQuizzes();
    } catch {
      setError("Save failed");
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditId(quiz._id);
    setForm({ title: quiz.title, description: quiz.description });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quiz?")) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/quizzes/${id}`);
      setSuccess("Quiz deleted");
      if (editId === id) resetForm();
      loadQuizzes();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Manage Quizzes</h2>
        <NavLink
          className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
          to="/admin"
        >
          Back to Dashboard
        </NavLink>
      </div>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editId ? "Edit Quiz" : "Create Quiz"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit">
                {editId ? "Update" : "Create"}
              </button>
              {editId && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <h5>Existing Quizzes</h5>
      <div className="list-group">
        {quizzes.map((q) => (
          <div
            key={q._id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div className="me-3">
              <div className="fw-bold">{q.title}</div>
              <div className="text-muted">{q.description}</div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleEdit(q)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(q._id)}
              >
                Delete
              </button>
              <NavLink
                className="btn btn-sm btn-outline-secondary"
                to={`/admin/questions?quizId=${q._id}`}
              >
                Questions
              </NavLink>
            </div>
          </div>
        ))}
        {!quizzes.length && (
          <div className="list-group-item">No quizzes yet</div>
        )}
      </div>
    </div>
  );
}

