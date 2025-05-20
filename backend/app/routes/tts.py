from langdetect import detect, LangDetectException
from deep_translator import GoogleTranslator
import os
from fastapi import APIRouter, Body, HTTPException, Query
from gtts import gTTS
from uuid import uuid4

router = APIRouter()

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

SUPPORTED_LANGS = {
    "en", "hi", "es", "fr", "de", "zh-cn", "zh-tw", "ja", "ko", "ru",
    "ar", "pt", "it", "nl", "tr", "bn", "vi", "pl", "th", "id", "el"
}

@router.post("/")
async def generate_audio(
    text: str = Body(..., embed=True),
    target_lang: str = Query("en", description="Target language for TTS and translation (e.g., 'en', 'hi', 'es')"),
    slow: bool = Query(False, description="Set to true for slower speech")
):
    text = text.strip()

    if not text or len(text) < 3:
        raise HTTPException(status_code=400, detail="Text must be at least 3 characters long.")

    if target_lang not in SUPPORTED_LANGS:
        raise HTTPException(status_code=400, detail=f"Unsupported target language '{target_lang}'.")

    try:
        # Detect source language using langdetect
        try:
            detected_lang = detect(text).lower()
        except LangDetectException:
            raise HTTPException(status_code=400, detail="Could not detect language of the input text.")

        # Fix mapping for simplified Chinese if needed (langdetect returns 'zh-cn' as 'zh' usually)
        if detected_lang == "zh":
            detected_lang = "zh-cn"

        if detected_lang not in SUPPORTED_LANGS:
            raise HTTPException(status_code=400, detail=f"Detected language '{detected_lang}' not supported.")

        # Translate only if detected != target
        if detected_lang != target_lang:
            translated_text = GoogleTranslator(source=detected_lang, target=target_lang).translate(text)
        else:
            translated_text = text

        filename = f"{uuid4().hex}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)

        # Generate TTS audio from translated text
        tts = gTTS(text=translated_text, lang=target_lang, slow=slow)
        tts.save(filepath)

        return {
            "detected_language": detected_lang,
            "translated_text": translated_text,
            "audio_url": f"/static/audio/{filename}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
