# Changes in this version

- One `CaseFile` per application (src/data/types.ts, mock-data.ts). Every panel reads from it, so scores no longer disagree (credit risk is 47 everywhere for APP-1043).
- Three detailed cases: APP-1042 (approved, no challenge), APP-1043 (manual review, 1 round), APP-1045 (rejected, Round 1 rejected by Credit, Round 2 escalated to Compliance).
- Case page reads the URL id; unknown ids show an empty state.
- Challenge now has threshold, Credit stance (Accepted / Partially accepted / Rejected), counter-argument and Contested / Escalated status. All rounds are shown.
- SHAP before and after the challenge side by side.
- RAG policy checks cite the policy clause. DTI check shows post-loan DTI.
- Decision tab: reviewer Approve / Reject with reason (session only), sanction letter / decision notice with download.
- Intake: controlled form, live "fields collected", computed DTI, document upload slots, rule-based Intake Agent prompts.
- Applications: working search and decision filter. Audit: agent filter, challenge-only toggle, case ID column, JSON export.
- Settings is read-only and shows the challenge threshold. Inert header search removed.
- Service methods map to REST calls (see mock-underwriting-service.ts).

## Round 2

- Document upload is its own call: `submitApplication(input)` then `uploadDocuments(applicationId, files)`. The form now keeps real `File` objects.
- `submitApplication` converts to snake_case via `toApplicationPayload` before the (future) fetch. Only monthly_income, loan_amount_requested, loan_purpose and employment_type were confirmed; the other field names are plain snake_case of ours and need checking against state.py.
- `documents` removed from `NewApplicationInput`; new `ApplicationPayload` type describes the wire format. `CaseFile` unchanged.
- Added a submit error message if either call fails.
- `npm run format` run: lint is now 0 errors (6 react-refresh warnings remain in shadcn ui files).
