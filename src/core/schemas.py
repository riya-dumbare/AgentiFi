from typing import List, Literal
from pydantic import BaseModel


class Application(BaseModel):
    applicant_name: str
    age: int
    monthly_income: float
    loan_amount: float
    loan_term_months: int
    credit_score: int
    existing_monthly_debt: float = 0
    employment_years: float = 0


class UnderwriterOutput(BaseModel):
    decision: Literal["approve", "decline"]
    risk_score: float
    reasons: List[str]


class VerifierOutput(BaseModel):
    agrees: bool
    objections: List[str]


class CaseResult(BaseModel):
    id: str
    created_at: str
    application: Application
    underwriter: UnderwriterOutput
    verifier: VerifierOutput
    final: Literal["approved", "declined", "needs_review"]