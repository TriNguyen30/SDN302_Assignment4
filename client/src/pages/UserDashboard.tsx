import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizzes } from "../store/slices/quizSlice";

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { items: quizzes, error, loading } = useAppSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <h2 className="mb-3">Get Started</h2>
      {loading && <div className="alert alert-info">Loading quizzes...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <p className="text-muted">Pick a quiz to start.</p>
      <div className="row g-3">
        {quizzes.map((quiz) => (
          <div className="col-md-4" key={quiz._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text text-muted">{quiz.description}</p>
                <a className="btn btn-outline-success" href={`/quizzes/${quiz._id}`}>
                  Take Quiz
                </a>
              </div>
            </div>
          </div>
        ))}
        {!quizzes.length && <div className="col-12">No quizzes available.</div>}
      </div>
    </div>
  );
}

