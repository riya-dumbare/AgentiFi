from src.core.schemas import Application, UnderwriterOutput, VerifierOutput
from src.agents.underwriter import dti


def verify(app: Application, uw: UnderwriterOutput) -> VerifierOutput:
    ratio = dti(app)
    objections = []

    if uw.decision == "approve":
        if app.credit_score < 680:
            objections.append("Approved with a borderline credit score")
        if ratio > 0.35:
            objections.append("Approved with a high debt-to-income ratio")
        if app.employment_years < 2:
            objections.append("Approved with under 2 years of employment history")
        if app.loan_amount > 10 * app.monthly_income:
            objections.append("Loan is over 10x monthly income")
    else:
        if app.credit_score >= 750 and ratio < 0.3:
            objections.append("Strong profile was declined, possible false rejection")

    return VerifierOutput(agrees=len(objections) == 0, objections=objections)