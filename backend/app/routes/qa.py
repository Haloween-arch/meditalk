from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

# Load a text-generation model (GPT-2 or bigger)
generator = pipeline("text-generation", model="gpt2")

MEDICAL_KEYWORDS = [
    "fever", "pain", "diabetes", "antibiotic", "virus", "inflammation", "treatment",
    "paracetamol", "ibuprofen", "metformin", "insulin", "symptoms", "medication",
    "medicine", "dose", "side effect", "allergy", "asthma", "reflux", "liver", "cancer",
    "cough", "cold", "flu", "infection", "headache", "persistent", "chronic"
]


class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str

def is_medical_question(question: str) -> bool:
    question_lower = question.lower()
    return any(k in question_lower for k in MEDICAL_KEYWORDS)

@router.post("/", response_model=AnswerResponse)
async def get_medical_answer(request: QuestionRequest):
    if not is_medical_question(request.question):
        raise HTTPException(status_code=400, detail="Only medical questions are allowed.")

    try:
        # Generate answer text (can tweak max_length, do sampling, etc.)
        gen_output = generator(request.question, max_length=150, num_return_sequences=1)
        answer = gen_output[0]["generated_text"].strip()

        return AnswerResponse(answer=answer)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")
