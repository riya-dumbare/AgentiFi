import uuid
from datetime import datetime, timezone

from src.core.schemas import Application, CaseResult
from src.agents.underwriter import underwrite
from src.agents.verifier import verify


def run_pipeline(app: Application) -> CaseResult:
    uw = underwrite(app)
    vf = verify(app, uw)

    if not vf.agrees:
        final = "needs_review"
    else:
        final = "approved" if uw.decision == "approve" else "declined"

    return CaseResult(
        id=str(uuid.uuid4())[:8],
        created_at=datetime.now(timezone.utc).isoformat(),
        application=app,
        underwriter=uw,
        verifier=vf,
        final=final,
    )