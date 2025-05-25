# 🏥 MediTalk for Patient

MediTalk is an AI-powered medical assistant platform designed to assist patients in understanding health documents and interactions. It combines OCR (Optical Character Recognition), text summarization, medical question answering, and speech synthesis into a seamless experience.

---

## ✨ Features

- 📸 **OCR**: Extract text from medical reports, prescriptions, or documents using Tesseract.
- 📄 **Summarization**: Get simplified summaries of complex medical text using a transformer-based model (BART).
- ❓ **Medical Q&A**: Ask health-related questions and get AI-driven answers based on context.
- 🔡 **Text-to-Speech (TTS)**: Convert translated or summarized content into speech across multiple languages.
- 🌐 **Translation**: Translate input to different languages before speech synthesis.
- 🧠 **Language Detection**: Automatically detects the language of input text.

---

## 📦 Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS (or custom CSS), Streamlit (optional prototype UI)
- **Backend**: FastAPI (Python)

### AI/ML:

- `transformers` (HuggingFace) for summarization and QA
- `gTTS` or another TTS engine
- `langdetect` for detecting input language
- `Tesseract OCR` for image-to-text

---

## 📁 Project Structure

```
meditalk/
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── ocr.py
│   │   ├── tts.py
│   │   ├── summarize.py
│   │   └── qa.py
│   └── models/ (optional if you're fine-tuning)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── styles/
│   │   └── pages/
├── README.md
├── requirements.txt
└── package.json
```

---

## ✨ Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- Tesseract installed locally (`brew install tesseract` or `sudo apt install tesseract-ocr`)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📷 OCR Example

Send a base64 image or file to `/ocr/` to extract text.

---

## 🔊 TTS + Translation

POST to `/tts/?target_lang=hi&slow=false` with body:

```json
{
  "text": "Take this medicine twice a day after food."
}
```

Response will include translated text, detected language, and audio URL.

---

## 🔍 Summarization

POST to `/` (e.g. `/summarize/`) with:

```json
{
  "text": "This is a long medical paragraph that needs summarization."
}
```

---

## 📖 Medical Q&A

POST to `/qa/` with:

```json
{
  "question": "What are the side effects of paracetamol?",
  "context": "Paracetamol may cause liver damage if taken in excess..."
}
```

---

## 💡 Use Cases

- Helping patients understand prescriptions
- Voice-assistive accessibility for elderly or visually impaired
- Instant language translation of medical advice
- Offline chatbot mode for remote health support

---

## frontend
https://meditalk-1.onrender.com

## backend can be run over local server as it can't be deployed over free
http://localhost:8000

## 🛡️ License

MIT License
