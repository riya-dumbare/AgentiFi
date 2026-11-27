import { allAuditEvents, applications, caseFiles } from "@/data/mock-data";
import type { ApplicationPayload, ApplicationSummary, NewApplicationInput } from "@/data/types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * UI state is camelCase; the backend (state.py) expects snake_case.
 * Only the four names confirmed with the backend owner are fixed:
 * monthly_income, loan_amount_requested, loan_purpose, employment_type.
 * The rest are plain snake_case of our names. Check them against state.py.
 */
export function toApplicationPayload(input: NewApplicationInput): ApplicationPayload {
  return {
    full_name: input.fullName,
    age: input.age,
    dependents: input.dependents,
    monthly_income: input.monthlyIncome,
    existing_debt: input.existingDebt,
    credit_score: input.creditScore,
    employment_type: input.employmentType,
    employment_length: input.employmentLength,
    loan_amount_requested: input.loanAmount,
    loan_term: input.loanTerm,
    loan_purpose: input.loanPurpose,
  };
}

/**
 * Frontend-only stand-in for the backend. Each method maps to one REST call:
 *   listApplications   -> GET  /applications
 *   getCase            -> GET  /applications/:id          (full case state)
 *   listAuditEvents    -> GET  /audit
 *   submitApplication  -> POST /applications
 *   uploadDocuments    -> POST /applications/:id/documents  (multipart)
 * Swap the bodies for fetch() calls when the API exists; the types stay the same.
 */
export const underwritingService = {
  async listApplications(): Promise<ApplicationSummary[]> {
    await delay();
    return [...applications];
  },
  async getCase(id: string) {
    await delay();
    return caseFiles.find((c) => c.id === id) ?? null;
  },
  async listAuditEvents() {
    await delay();
    return allAuditEvents;
  },
  async submitApplication(input: NewApplicationInput) {
    await delay(700);
    // Future: fetch("/applications", { method: "POST", body: JSON.stringify(payload) })
    const payload = toApplicationPayload(input);
    const nextNumber = 1048 + applications.filter((a) => Number(a.id.slice(4)) >= 1048).length;
    const id = `APP-${nextNumber}`;
    applications.unshift({
      id,
      applicant: input.fullName,
      amount: input.loanAmount,
      creditRisk: "Pending",
      fraudRisk: "Pending",
      decision: "Pending",
      status: "Processing",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    return { id, status: "Processing" as const, payload };
  },
  async uploadDocuments(applicationId: string, files: Record<string, File>) {
    await delay(500);
    // Future: build FormData (one part per slot) and POST /applications/:id/documents.
    // Mock: acknowledge receipt, shaped like the expected response.
    return { applicationId, received: Object.keys(files) };
  },
};
