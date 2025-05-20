import { useState } from "react";
import "./SummarizePage.css";

function SummarizePage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("⚠️ Please enter some medical text to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");

    try {
      const res = await fetch("http://localhost:8000/simplify/?min_length=30&max_length=100", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to summarize text.");
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      setError("❌ Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Text Summarizer 📝</h2>
      <p className="description">Paste medical text below to simplify or summarize.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="textarea"
        placeholder="Enter medical text here..."
      />

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="button"
      >
        {loading ? "⏳ Summarizing..." : "🔍 Summarize"}
      </button>

      {summary && (
        <div className="summaryBox">
          <h3 className="font-semibold text-green-700">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <div className="errorBox">
          <h3 className="font-semibold text-red-700">Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default SummarizePage;
