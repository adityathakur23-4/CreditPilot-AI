from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="CreditPilot AI",
    description="AI Loan Decision Platform",
    version="1.0.0"
)

# Allow Vercel frontend to connect to Railway backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
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
