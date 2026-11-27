export type RiskLevel = "Low" | "Medium" | "High";
export type AgentStatus =
  "Completed" | "Processing" | "Waiting" | "Challenged" | "Resolved" | "Failed";
export type DecisionType = "Approved" | "Rejected" | "Manual Review";

export interface Applicant {
  fullName: string;
  age: number;
  dependents: number;
  monthlyIncome: number;
  existingDebt: number;
  dti: number;
  creditScore: number;
  employmentType: string;
  employmentLength: string;
}

export interface ApplicationSummary {
  id: string;
  applicant: string;
  amount: number;
  creditRisk: RiskLevel | "Pending";
  fraudRisk: RiskLevel | "Pending";
  decision: DecisionType | "Pending";
  status: "Completed" | "Challenged" | "Processing" | "Manual Review";
  date: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  ocrStatus: string;
  extractionStatus: string;
  verification: "Passed" | "Warning";
  note: string;
}

export interface FeatureContribution {
  feature: string;
  value: number;
}

export interface FraudSignal {
  label: string;
  severity: "Normal" | "Medium" | "High";
  evidence: string;
}

export type ChallengeStance = "Accepted" | "Partially accepted" | "Rejected";

export interface Challenge {
  round: number;
  raisedBy: string;
  statement: string;
  evidence: string[];
  confidence: number;
  threshold: number;
  originalScore: number;
  reevaluatedScore: number;
  stance: ChallengeStance;
  counterArgument: string;
  response: string;
  status: "Resolved" | "Contested" | "Escalated";
}

export interface ComplianceCheck {
  rule: string;
  status: "Passed" | "Review" | "Failed";
  detail: string;
}

export interface AuditEvent {
  id: string;
  caseId?: string;
  round?: number;
  time: string;
  agent: string;
  action: string;
  evidence: string;
  output: string;
  status: AgentStatus;
}

export interface PolicyCheck {
  label: string;
  passed: boolean;
  clause: string;
}

export interface LoanDetails {
  amount: number;
  term: string;
  purpose: string;
}

export interface AgentRun {
  name: string;
  description: string;
  status: AgentStatus;
  time: string;
}

export interface CaseFile {
  id: string;
  applicant: Applicant;
  loan: LoanDetails;
  submittedAt: string;
  decision: DecisionType;
  decisionConfidence: number;
  riskInitial: number;
  riskFinal: number;
  creditConfidence: number;
  fraudScore: number;
  fraudConfidence: number;
  overallRisk: RiskLevel;
  summary: string;
  agents: AgentRun[];
  documents: DocumentRecord[];
  extractedFields: { label: string; value: string }[];
  policyChecks: PolicyCheck[];
  shapBefore: FeatureContribution[];
  shapAfter: FeatureContribution[];
  fraudSignals: FraudSignal[];
  challenges: Challenge[];
  compliance: ComplianceCheck[];
  complianceNote: string;
  audit: AuditEvent[];
  letter: { title: string; body: string };
}

export interface NewApplicationInput {
  fullName: string;
  age: number;
  dependents: number;
  monthlyIncome: number;
  existingDebt: number;
  creditScore: number;
  employmentType: string;
  employmentLength: string;
  loanAmount: number;
  loanTerm: string;
  loanPurpose: string;
}

/** What actually goes over the wire for POST /applications (snake_case, matches the backend's state.py). */
export interface ApplicationPayload {
  full_name: string;
  age: number;
  dependents: number;
  monthly_income: number;
  existing_debt: number;
  credit_score: number;
  employment_type: string;
  employment_length: string;
  loan_amount_requested: number;
  loan_term: string;
  loan_purpose: string;
}
