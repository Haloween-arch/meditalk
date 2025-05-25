from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import ocr, simplify, qa, tts

app = FastAPI(
    title="MediTalk API",
    description="Backend for OCR, text summarization, Q&A, and TTS",
    version="1.0.0"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://meditalk-1.onrender.com"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for audio or file access
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register all routers
app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
app.include_router(simplify.router, prefix="/simplify", tags=["Simplify"])
app.include_router(qa.router, prefix="/qa", tags=["Q&A"])
app.include_router(tts.router, prefix="/tts", tags=["TTS"])
