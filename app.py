from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="CreditPilot AI",
    description="AI Loan Decision Platform",
    version="1.0.0"
)

class CreditInput(BaseModel):
    income: float
    loan_amount: float
    credit_score: int

@app.get("/")
def home():
    return {"message": "CreditPilot AI Backend Running 🚀"}

@app.post("/predict")
def predict(data: CreditInput):
    if data.credit_score >= 700:
        risk = "Low Risk"
    elif data.credit_score >= 500:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    return {
        "credit_score": data.credit_score,
        "prediction": risk
    }
