from src.core.schemas import Application, UnderwriterOutput

ANNUAL_RATE = 0.12  # assumption, move to config/ later


def monthly_emi(principal: float, months: int, annual_rate: float = ANNUAL_RATE) -> float:
    r = annual_rate / 12
    return principal * r * (1 + r) ** months / ((1 + r) ** months - 1)


def dti(app: Application) -> float:
    emi = monthly_emi(app.loan_amount, app.loan_term_months)
    return (app.existing_monthly_debt + emi) / app.monthly_income


def underwrite(app: Application) -> UnderwriterOutput:
    ratio = dti(app)
    credit_part = 1 - (app.credit_score - 300) / 600  # 0 = best, 1 = worst
    risk = round(0.5 * credit_part + 0.5 * min(ratio, 1), 3)

    reasons = [
        f"Credit score {app.credit_score}",
        f"Debt-to-income after this loan: {ratio:.0%}",
        f"Employment: {app.employment_years} years",
    ]
    approve = risk < 0.4 and ratio <= 0.5 and app.credit_score >= 600
    if not approve:
        if app.credit_score < 600:
            reasons.append("Credit score below 600 cutoff")
        if ratio > 0.5:
            reasons.append("Debt-to-income above 50%")
        if risk >= 0.4:
            reasons.append("Overall risk score above 0.4")

    return UnderwriterOutput(
        decision="approve" if approve else "decline",
        risk_score=risk,
        reasons=reasons,
    )