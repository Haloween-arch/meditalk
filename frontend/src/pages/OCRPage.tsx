import { useState } from "react";
import axios from "axios";
import './OCRPage.css';

function OCRPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }

      setExtractedText("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExtractedText(res.data.text);
    } catch (err) {
      console.error("OCR failed:", err);
      setExtractedText("Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocr-container">
      <h2>OCR Tool</h2>
      <p>
        Upload an <strong>image (JPG, PNG)</strong> or a <strong>PDF</strong> to extract medical text.
      </p>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="ocr-preview"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="ocr-button"
      >
        {loading ? "Extracting..." : "Extract Text"}
      </button>

      {extractedText && (
        <div className="ocr-extracted-text">
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
}

export default OCRPage;
