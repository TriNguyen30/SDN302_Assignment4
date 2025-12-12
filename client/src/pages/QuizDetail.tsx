import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchQuizById, clearCurrent } from "../store/slices/quizSlice";

export default function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const dispatch = useAppDispatch();
  const { current: quiz, error, loading } = useAppSelector((state) => state.quizzes);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!quizId) return;
    dispatch(fetchQuizById(quizId));
    return () => {
      dispatch(clearCurrent());
      setSelectedAnswers({});
      setSubmitted(false);
      setScore(null);
    };
  }, [dispatch, quizId]);

  const handleSubmit = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q._id] === q.correctAnswerIndex) correct += 1;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      {loading && <div className="alert alert-info">Loading quiz...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {quiz && (
        <>
          <h2 className="mb-2">{quiz.title}</h2>
          <p className="text-muted">{quiz.description}</p>
          {submitted && score !== null && (
            <div className="alert alert-success">
              Quiz completed. Your score: {score} / {quiz.questions.length}
            </div>
          )}
          <div className="list-group">
            {quiz.questions?.map((q, idx) => (
              <div key={q._id} className="list-group-item">
                <h6 className="mb-2">
                  {idx + 1}. {q.text}
                </h6>
                {q.options.map((opt, optIdx) => {
                  const selected = selectedAnswers[q._id];
                  const isCorrect = submitted && optIdx === q.correctAnswerIndex;
                  const isWrongChoice = submitted && selected === optIdx && optIdx !== q.correctAnswerIndex;
                  return (
                    <label
                      key={optIdx}
                      className={`d-block border rounded p-2 mb-2 ${isCorrect ? "border-success" : ""} ${isWrongChoice ? "border-danger" : ""}`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={optIdx}
                        checked={selected === optIdx}
                        onChange={() =>
                          setSelectedAnswers({
                            ...selectedAnswers,
                            [q._id]: optIdx,
                          })
                        }
                        className="form-check-input me-2"
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  );
                })}
                {submitted && (
                  <div className="small">
                    Correct answer: {q.options[q.correctAnswerIndex]}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-success mt-3" onClick={handleSubmit} disabled={submitted}>
            {submitted ? "Submitted" : "Submit Answers"}
          </button>
          {submitted && (
            <button className="btn btn-outline-secondary mt-3 ms-2" onClick={handleRestart}>
              Restart Quiz
            </button>
          )}
        </>
      )}
    </div>
  );
}

