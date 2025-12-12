import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "../lib/axios";
import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizzes } from "../store/slices/quizSlice";
import type { Question, QuizRef } from "../types/api";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AdminQuestions() {
  const query = useQuery();
  const initialQuizId = query.get("quizId") || "";

  const dispatch = useAppDispatch();
  const { items: quizzes } = useAppSelector((state) => state.quizzes);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizFilter, setQuizFilter] = useState(initialQuizId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    quizId: initialQuizId || "",
    text: "",
    options: ["", ""],
    correctAnswerIndex: 0,
  });


  const loadQuestions = async () => {
    try {
      setLoading(true);
      const url = quizFilter ? `/questions?quizId=${quizFilter}` : "/questions";
      const { data } = await axios.get<Question[]>(url);
      setQuestions(data);
    } catch {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchQuizzes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    loadQuestions();
  }, [quizFilter]);

  const resetForm = () => {
    setForm({
      quizId: quizFilter || "",
      text: "",
      options: ["", ""],
      correctAnswerIndex: 0,
    });
    setEditId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editId) {
        await axios.put(`/questions/${editId}`, form);
        setSuccess("Question updated");
      } else {
        await axios.post("/questions", form);
        setSuccess("Question created");
      }
      resetForm();
      loadQuestions();
    } catch {
      setError("Save failed");
    }
  };

  const handleEdit = (q: Question) => {
    const quizIdValue = typeof q.quizId === "string" ? q.quizId : (q.quizId as QuizRef)._id;
    setEditId(q._id);
    setForm({
      quizId: quizIdValue,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/questions/${id}`);
      setSuccess("Question deleted");
      if (editId === id) resetForm();
      loadQuestions();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Manage Questions</h2>
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
          <h5 className="card-title">
            {editId ? "Edit Question" : "Create Question"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Quiz</label>
              <select
                className="form-select"
                value={form.quizId}
                onChange={(e) => setForm({ ...form, quizId: e.target.value })}
                required
              >
                <option value="">Select quiz</option>
                {quizzes.map((q) => (
                  <option key={q._id} value={q._id}>
                    {q.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Question</label>
              <input
                className="form-control"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Options</label>
              {form.options.map((opt, idx) => (
                <input
                  key={idx}
                  className="form-control mb-2"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...form.options];
                    newOpts[idx] = e.target.value;
                    setForm({ ...form, options: newOpts });
                  }}
                  required
                />
              ))}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() =>
                  setForm({ ...form, options: [...form.options, ""] })
                }
              >
                + Add option
              </button>
            </div>
            <div className="mb-3">
              <label className="form-label">Correct Answer Index</label>
              <input
                type="number"
                className="form-control"
                min={0}
                max={form.options.length - 1}
                value={form.correctAnswerIndex}
                onChange={(e) =>
                  setForm({
                    ...form,
                    correctAnswerIndex: Number(e.target.value),
                  })
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

      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5>Existing Questions</h5>
        <select
          className="form-select w-auto"
          value={quizFilter}
          onChange={(e) => setQuizFilter(e.target.value)}
        >
          <option value="">All quizzes</option>
          {quizzes.map((q) => (
            <option key={q._id} value={q._id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      <div className="list-group">
        {questions.map((q) => (
          <div key={q._id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div className="me-3">
                <div className="fw-bold">{q.text}</div>
                <div className="small text-muted">
                  {(() => {
                    const quizIdValue =
                      typeof q.quizId === "string" ? q.quizId : (q.quizId as QuizRef)?._id;
                    const quizTitle =
                      typeof q.quizId === "object" && q.quizId?.title
                        ? q.quizId.title
                        : quizzes.find((z) => z._id === quizIdValue)?.title;
                    return `Quiz: ${quizTitle || quizIdValue || "Unknown"}`;
                  })()}
                </div>
                <ol className="mt-2">
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={
                        idx === q.correctAnswerIndex
                          ? "fw-semibold text-success"
                          : ""
                      }
                    >
                      {opt}
                    </li>
                  ))}
                </ol>
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
              </div>
            </div>
          </div>
        ))}
        {!questions.length && (
          <div className="list-group-item">No questions yet</div>
        )}
      </div>
    </div>
  );
}

