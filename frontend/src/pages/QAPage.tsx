import { useState } from "react";
import "./QA.css";

export default function MedicalQA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) {
      setError("⚠️ Please enter a medical question.");
      return;
    }
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch("http://localhost:8000/qa/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Something went wrong.");
      } else {
        const data = await res.json();
        setAnswer(data.answer);
      }
    } catch (e) {
      setError("❌ Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">
        Ask a Medical Question <span className="bounceEmoji">💬</span>
      </h2>

      <textarea
        rows={4}
        className="textarea"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your medical question here..."
      />

      <button
        onClick={askQuestion}
        disabled={loading}
        className="askButton"
      >
        {loading ? "⏳ Asking..." : "🩺 Ask"}
      </button>

      {answer && (
        <div className="answerBox">
          <strong className="answerTitle">
            Answer <span className="bounceEmoji">📋</span>:
          </strong>
          <p>{answer}</p>
        </div>
      )}

      {error && (
        <div className="errorBox">
          <strong>Error: </strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
