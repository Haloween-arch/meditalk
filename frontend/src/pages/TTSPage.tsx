import { useState } from "react";
import "./TTS.css";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh-cn", label: "Chinese (Simplified)" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
  // add more languages if needed
];

export default function TTSWithTranslate() {
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [finalText, setFinalText] = useState<string>("");
  const [detectedLang, setDetectedLang] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("en");
  const [slow, setSlow] = useState<boolean>(false);

  const generateAudio = async () => {
    if (!text.trim()) {
      setError("Please enter some text to convert to speech.");
      return;
    }

    setLoading(true);
    setAudioUrl("");
    setFinalText("");
    setDetectedLang("");
    setError("");

    try {
      // Prepare query parameters
      const params = new URLSearchParams();
      params.append("target_lang", targetLang);
      params.append("slow", slow ? "true" : "false");

      const response = await fetch(`http://localhost:8000/tts/?${params.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "TTS generation failed.");
      }

      setAudioUrl(`http://localhost:8000${data.audio_url}`);
      setFinalText(data.translated_text || "");
      setDetectedLang(data.detected_language || "");
    } catch (err: any) {
      setError(err.message || "Failed to generate audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Text to Speech with Translation</h2>

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="textarea"
      />

      <div className="controls">
        <label className="selectLabel">
          Target Language (TTS):
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            size={5}
            className="select"
          >
            {LANG_OPTIONS.map(({ code, label }) => (
              <option key={code} value={code}>
                {label} ({code})
              </option>
            ))}
          </select>
        </label>

        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={slow}
            onChange={() => setSlow(!slow)}
            className="checkboxInput"
          />
          Slow Speech
        </label>
      </div>

      <button
        onClick={generateAudio}
        disabled={loading}
        className="button"
      >
        {loading ? "Generating..." : "Generate Audio"}
      </button>

      {detectedLang && (
        <div className="infoBox detectedLang">
          <strong>Detected Input Language:</strong> {detectedLang.toUpperCase()}
        </div>
      )}

      {finalText && (
        <div className="infoBox translatedText">
          <strong>Translated Text:</strong>
          <p>{finalText}</p>
        </div>
      )}

      {audioUrl && (
        <div className="audioContainer">
          <audio controls src={audioUrl} />
        </div>
      )}

      {error && (
        <div className="errorBox">
          <strong>Error:</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
