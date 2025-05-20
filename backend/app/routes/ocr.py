from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, UnidentifiedImageError
import io
import fitz  # PyMuPDF
import easyocr

router = APIRouter()
reader = easyocr.Reader(['en'])  # load once when module loads

@router.post("/")
async def extract_text(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".pdf"):
            pdf = fitz.open(stream=contents, filetype="pdf")
            text = ""
            for page_num in range(len(pdf)):
                page_text = pdf[page_num].get_text()
                text += page_text + "\n"

            text = text.strip()
            if not text:
                return {"text": "No text found in PDF."}
            return {"text": text}

        elif filename.endswith((".png", ".jpg", ".jpeg")):
            try:
                image = Image.open(io.BytesIO(contents))
            except UnidentifiedImageError:
                raise HTTPException(status_code=400, detail="Invalid image file.")

            if image.mode not in ("RGB", "L"):
                image = image.convert("RGB")

            # Convert PIL image to numpy array for EasyOCR
            import numpy as np
            image_np = np.array(image)

            # Use EasyOCR for better handwriting recognition
            text_lines = reader.readtext(image_np, detail=0, paragraph=True)
            text = "\n".join(text_lines).strip()

            if not text:
                return {"text": "No text found in image."}
            return {"text": text}

        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload PDF or PNG/JPG images."
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
