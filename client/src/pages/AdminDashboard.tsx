import { FormEvent, useEffect, useState } from "react";
import axios from "../lib/axios";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizzes, setQuizzes } from "../store/slices/quizSlice";
import type { Quiz } from "../types/api";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { items: quizzes } = useAppSelector((state) => state.quizzes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState({ title: "", description: "" });
  const [questionForm, setQuestionForm] = useState({
    quizId: "",
    text: "",
    options: ["", ""],
    correctAnswerIndex: 0,
  });

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

  const handleCreateQuiz = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post("/quizzes", quizForm);
      setQuizForm({ title: "", description: "" });
      setSuccess("Quiz created");
      loadQuizzes();
    } catch (err) {
      setError("Failed to create quiz");
    }
  };

  const handleCreateQuestion = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!questionForm.quizId) {
      setError("Select a quiz first");
      return;
    }
    try {
      await axios.post(`/quizzes/${questionForm.quizId}/question`, {
        text: questionForm.text,
        options: questionForm.options,
        correctAnswerIndex: questionForm.correctAnswerIndex,
      });
      setQuestionForm({
        quizId: questionForm.quizId,
        text: "",
        options: ["", ""],
        correctAnswerIndex: 0,
      });
      setSuccess("Question created");
      loadQuizzes();
    } catch (err) {
      setError("Failed to create question");
    }
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <div className="d-flex gap-3">
          <NavLink
            className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            to="/admin/quizzes"
          >
            Manage Quizzes
          </NavLink>
          <NavLink
            className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            to="/admin/questions"
          >
            Manage Questions
          </NavLink>
        </div>
      </div>
      {loading && <div className="alert alert-info">Loading quizzes...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create Quiz</h5>
              <form onSubmit={handleCreateQuiz}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={quizForm.title}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={quizForm.description}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, description: e.target.value })
                    }
                    required
                  />
                </div>
                <button className="btn btn-success" type="submit">
                  Save Quiz
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create Question</h5>
              <form onSubmit={handleCreateQuestion}>
                <div className="mb-3">
                  <label className="form-label">Quiz</label>
                  <select
                    className="form-select"
                    value={questionForm.quizId}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        quizId: e.target.value,
                      })
                    }
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
                    value={questionForm.text}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, text: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Options</label>
                  {questionForm.options.map((opt, idx) => (
                    <input
                      key={idx}
                      className="form-control mb-2"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...questionForm.options];
                        newOpts[idx] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOpts });
                      }}
                      required
                    />
                  ))}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() =>
                      setQuestionForm({
                        ...questionForm,
                        options: [...questionForm.options, ""],
                      })
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
                    max={questionForm.options.length - 1}
                    value={questionForm.correctAnswerIndex}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        correctAnswerIndex: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Save Question
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Existing Quizzes</h5>
        <ul className="list-group">
          {quizzes.map((q) => (
            <li
              key={q._id}
              className="list-group-item d-flex justify-content-between"
            >
              <div>
                <strong>{q.title}</strong>
                <div className="text-muted">{q.description}</div>
              </div>
            </li>
          ))}
          {!quizzes.length && (
            <li className="list-group-item">No quizzes yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}

