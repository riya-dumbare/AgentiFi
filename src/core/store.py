import json
import os

PATH = "data/processed/cases.json"


def _load():
    if not os.path.exists(PATH):
        return []
    with open(PATH) as f:
        return json.load(f)


def save_case(case: dict):
    cases = _load()
    cases.append(case)
    os.makedirs(os.path.dirname(PATH), exist_ok=True)
    with open(PATH, "w") as f:
        json.dump(cases, f, indent=2)


def list_cases():
    return list(reversed(_load()))


def get_case(case_id: str):
    return next((c for c in _load() if c["id"] == case_id), None)