from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.core.schemas import Application, CaseResult
from src.core.pipeline import run_pipeline
from src.core import store

app = FastAPI(title="AgentiFi")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/applications", response_model=CaseResult)
def create_application(application: Application):
    result = run_pipeline(application)
    store.save_case(result.model_dump())
    return result


@app.get("/applications")
def list_applications():
    return store.list_cases()


@app.get("/applications/{case_id}")
def get_application(case_id: str):
    case = store.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case