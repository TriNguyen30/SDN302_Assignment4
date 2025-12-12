import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizzes } from "../store/slices/quizSlice";
import type { Quiz } from "../types/api";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items: quizzes, error, loading } = useAppSelector((state) => state.quizzes);
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, token]);

  if (!token || !user) {
    return (
      <div className="container" style={{ marginTop: "120px" }}>
        <h1 className="text-center">Oops! Nothing to show here</h1>
        <p className="text-center">Please login to view quizzes</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <h2 className="mb-3 text-center">Quizzes</h2>
      {loading && <div className="alert alert-info">Loading quizzes...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {quizzes.map((quiz: Quiz) => (
          <div className="col-md-4" key={quiz._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text text-muted">{quiz.description}</p>
                <a className="btn btn-outline-success" href={`/quizzes/${quiz._id}`}>
                  View Quiz
                </a>
              </div>
            </div>
          </div>
        ))}
        {!quizzes.length && !loading && !error && <div className="col-12 text-center">No quizzes available.</div>}
      </div>
    </div>
  );
}
