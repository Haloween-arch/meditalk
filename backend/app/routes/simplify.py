from fastapi import APIRouter, Body, HTTPException, Query
from transformers import pipeline
from typing import List

router = APIRouter()

# Load summarization model once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@router.post("/")
async def simplify_text(
    text: str = Body(..., embed=True),
    max_length: int = Query(120, ge=30, le=512),
    min_length: int = Query(30, ge=10, le=300)
):
    text = text.strip().replace("\n", " ").replace("  ", " ")
    
    if len(text) < 40:
        raise HTTPException(status_code=400, detail="Input text is too short for summarization.")
    
    if min_length >= max_length:
        raise HTTPException(status_code=400, detail="min_length must be less than max_length.")

    try:
        # Optional: Handle very long input
        if len(text.split()) > 1000:
            raise HTTPException(status_code=413, detail="Text is too long. Please shorten your input.")

        summary = summarizer(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
            truncation=True,
            clean_up_tokenization_spaces=True
        )

        summary_text = summary[0].get("summary_text", "").strip()
        if not summary_text:
            raise HTTPException(status_code=422, detail="Could not generate a meaningful summary.")
        
        return {
            "summary": summary_text,
            "length_original": len(text),
            "length_summary": len(summary_text)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")
