import type {
  AgentRun,
  ApplicationSummary,
  AuditEvent,
  CaseFile,
  FeatureContribution,
} from "./types";

/* ------------------------------------------------------------------ */
/* Prototype policy constants (shown in the UI so decisions are traceable) */
/* ------------------------------------------------------------------ */
export const CHALLENGE_THRESHOLD = 75; // fraud confidence needed to raise a challenge
export const MAX_CHALLENGE_ROUNDS = 2;

/* ------------------------------------------------------------------ */
/* Portfolio list + dashboard                                          */
/* ------------------------------------------------------------------ */
export const applications: ApplicationSummary[] = [
  {
    id: "APP-1042",
    applicant: "Asha Rao",
    amount: 500000,
    creditRisk: "Low",
    fraudRisk: "Low",
    decision: "Approved",
    status: "Completed",
    date: "18 Sep 2026",
  },
  {
    id: "APP-1043",
    applicant: "Rahul Mehta",
    amount: 850000,
    creditRisk: "Medium",
    fraudRisk: "High",
    decision: "Manual Review",
    status: "Challenged",
    date: "18 Sep 2026",
  },
  {
    id: "APP-1044",
    applicant: "Neha Sharma",
    amount: 350000,
    creditRisk: "Low",
    fraudRisk: "Medium",
    decision: "Approved",
    status: "Completed",
    date: "17 Sep 2026",
  },
  {
    id: "APP-1045",
    applicant: "Vikram Singh",
    amount: 1200000,
    creditRisk: "High",
    fraudRisk: "High",
    decision: "Rejected",
    status: "Completed",
    date: "17 Sep 2026",
  },
  {
    id: "APP-1046",
    applicant: "Ishita Sen",
    amount: 650000,
    creditRisk: "Pending",
    fraudRisk: "Pending",
    decision: "Pending",
    status: "Processing",
    date: "16 Sep 2026",
  },
  {
    id: "APP-1047",
    applicant: "Arjun Nair",
    amount: 420000,
    creditRisk: "Low",
    fraudRisk: "Medium",
    decision: "Manual Review",
    status: "Manual Review",
    date: "16 Sep 2026",
  },
];

export const dashboardMetrics = [
  { label: "Total Applications", value: "1,248", change: "+8.2%", tone: "neutral" },
  { label: "Pending Review", value: "137", change: "11.0% · 12 challenged", tone: "warning" },
  { label: "Approved", value: "892", change: "71.5% rate", tone: "success" },
  { label: "Rejected", value: "219", change: "17.5% rate", tone: "danger" },
  { label: "High Fraud Risk", value: "46", change: "3.7% of total", tone: "danger" },
];

export const secondaryMetrics = [
  { label: "Average Risk Score", value: "41.8" },
  { label: "Average Fraud Score", value: "28.4" },
  { label: "Applications Challenged", value: "126" },
  { label: "Challenge Resolution Rate", value: "84.1%" },
];

export const decisionDistribution = [
  { name: "Approved", value: 71.5, fill: "var(--chart-success)" },
  { name: "Review", value: 11, fill: "var(--chart-warning)" },
  { name: "Rejected", value: 17.5, fill: "var(--chart-danger)" },
];

export const riskDistribution = [
  { bucket: "Low", applications: 624 },
  { bucket: "Moderate", applications: 359 },
  { bucket: "High", applications: 181 },
  { bucket: "Critical", applications: 84 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const agentBase = [
  { name: "Intake Agent", description: "Structured application validation" },
  { name: "Document Verification Agent", description: "OCR extraction and mock policy retrieval" },
  { name: "Credit Risk Agent", description: "XGBoost risk score and SHAP explanation" },
  { name: "Fraud Investigation Agent", description: "Anomaly and evidence assessment" },
  { name: "Compliance Agent", description: "Rule checks and disagreement arbitration" },
  { name: "Decision Agent", description: "Structured final outcome and explanation" },
];
const runs = (statuses: AgentRun["status"][], times: string[]): AgentRun[] =>
  agentBase.map((a, i) => ({ ...a, status: statuses[i] ?? "Completed", time: times[i] ?? "—" }));

const events = (caseId: string, rows: Omit<AuditEvent, "id" | "caseId">[]): AuditEvent[] =>
  rows.map((r, i) => ({ ...r, id: `${caseId}-evt-${i + 1}`, caseId }));

const shap = (rows: [string, number][]): FeatureContribution[] =>
  rows.map(([feature, value]) => ({ feature, value }));

/* ------------------------------------------------------------------ */
/* Case files (one per fully detailed application)                      */
/* ------------------------------------------------------------------ */
const case1042: CaseFile = {
  id: "APP-1042",
  applicant: {
    fullName: "Asha Rao",
    age: 29,
    dependents: 0,
    monthlyIncome: 90000,
    existingDebt: 8000,
    dti: 9,
    creditScore: 781,
    employmentType: "Salaried",
    employmentLength: "5 years",
  },
  loan: { amount: 500000, term: "48 months", purpose: "Vehicle Purchase" },
  submittedAt: "18 Sep 2026, 09:12 IST",
  decision: "Approved",
  decisionConfidence: 94,
  riskInitial: 18,
  riskFinal: 18,
  creditConfidence: 94,
  fraudScore: 14,
  fraudConfidence: 62,
  overallRisk: "Low",
  summary:
    "The application was assessed as low risk. Income, employment and identity documents agree with the application, and cashflow matches reported salary. The Fraud Investigation Agent's confidence (62%) stayed below the challenge threshold (75%), so no challenge was raised and all compliance checks passed.",
  agents: runs(
    ["Completed", "Completed", "Completed", "Completed", "Completed", "Completed"],
    ["1.1s", "2.5s", "2.9s", "2.2s", "1.4s", "0.8s"],
  ),
  documents: [
    {
      id: "d1",
      name: "Salary_Slip_Sep.pdf",
      type: "Salary slip",
      ocrStatus: "OCR Complete",
      extractionStatus: "Data Extracted",
      verification: "Passed",
      note: "Values align with the application.",
    },
    {
      id: "d2",
      name: "Bank_Statement_6M.pdf",
      type: "Bank statement",
      ocrStatus: "OCR Complete",
      extractionStatus: "Data Extracted",
      verification: "Passed",
      note: "Monthly credits match salary.",
    },
    {
      id: "d3",
      name: "PAN_Card.png",
      type: "Identity document",
      ocrStatus: "OCR Complete",
      extractionStatus: "Identity Matched",
      verification: "Passed",
      note: "Name and date of birth matched.",
    },
  ],
  extractedFields: [
    { label: "Monthly Salary", value: "₹90,000" },
    { label: "Average Monthly Credit", value: "₹89,200" },
    { label: "Employer", value: "Northwind Systems" },
    { label: "Statement Period", value: "6 months" },
  ],
  policyChecks: [
    {
      label: "Income eligibility",
      passed: true,
      clause: "Mock Policy 2.1: Minimum verified monthly income ₹25,000.",
    },
    {
      label: "Loan amount eligibility",
      passed: true,
      clause: "Mock Policy 3.4: Unsecured personal loans up to ₹15,00,000.",
    },
    {
      label: "Employment requirement",
      passed: true,
      clause: "Mock Policy 2.3: At least 2 years in current employment.",
    },
    {
      label: "Debt-to-income threshold",
      passed: true,
      clause: "Mock Policy 4.2: Post-loan DTI must not exceed 50%. Applicant: about 24%.",
    },
  ],
  shapBefore: shap([
    ["Credit Score", 36],
    ["Monthly Income", 28],
    ["Employment Stability", 17],
    ["Debt-to-Income", -4],
    ["Loan Amount", -3],
  ]),
  shapAfter: shap([
    ["Credit Score", 36],
    ["Monthly Income", 28],
    ["Employment Stability", 17],
    ["Debt-to-Income", -4],
    ["Loan Amount", -3],
  ]),
  fraudSignals: [
    {
      label: "Transaction anomaly",
      severity: "Normal",
      evidence: "No irregular high-value transfers in the statement period.",
    },
    {
      label: "Account consistency",
      severity: "Normal",
      evidence: "Account ownership and identity fields are consistent.",
    },
    {
      label: "Income–cashflow mismatch",
      severity: "Normal",
      evidence: "Observed inflow is within 2% of reported income.",
    },
    {
      label: "Transaction variance",
      severity: "Normal",
      evidence: "Month-to-month cashflow variance is within the peer range.",
    },
  ],
  challenges: [],
  compliance: [
    {
      rule: "Income Eligibility",
      status: "Passed",
      detail: "Verified income ₹90,000 against ₹25,000 minimum.",
    },
    {
      rule: "Loan Amount Threshold",
      status: "Passed",
      detail: "₹5,00,000 is within the ₹15,00,000 band.",
    },
    {
      rule: "Debt Ratio Threshold",
      status: "Passed",
      detail: "Post-loan DTI is about 24% (assumed 12% p.a., 48 months) against the 50% limit.",
    },
    {
      rule: "Document Verification",
      status: "Passed",
      detail: "All required documents present and consistent.",
    },
    {
      rule: "Fraud Risk Threshold",
      status: "Passed",
      detail: "Fraud score 14 is below the review band (60–79).",
    },
  ],
  complianceNote:
    "No disagreement between agents. All five mock policy checks passed, so no arbitration was needed.",
  audit: events("APP-1042", [
    {
      time: "09:12:02",
      agent: "Intake Agent",
      action: "Application received",
      evidence: "12 structured applicant and loan fields",
      output: "Validation passed",
      status: "Completed",
    },
    {
      time: "09:12:05",
      agent: "Document Verification Agent",
      action: "Documents verified",
      evidence: "Salary_Slip_Sep.pdf, Bank_Statement_6M.pdf, PAN_Card.png",
      output: "₹90,000 salary confirmed; identity matched",
      status: "Completed",
    },
    {
      time: "09:12:08",
      agent: "Credit Risk Agent",
      action: "Risk score generated",
      evidence: "Credit and affordability features",
      output: "18% risk, 94% confidence",
      status: "Completed",
    },
    {
      time: "09:12:10",
      agent: "Fraud Investigation Agent",
      action: "Anomaly check completed",
      evidence: "6 months of transactions",
      output: "Fraud score 14; confidence 62% is below threshold 75%, no challenge raised",
      status: "Completed",
    },
    {
      time: "09:12:12",
      agent: "Compliance Agent",
      action: "Policies evaluated",
      evidence: "Five mock eligibility checks",
      output: "All checks passed",
      status: "Completed",
    },
    {
      time: "09:12:13",
      agent: "Decision Agent",
      action: "Final decision generated",
      evidence: "Agent outputs and compliance result",
      output: "Approved · 94% confidence",
      status: "Completed",
    },
  ]),
  letter: {
    title: "Sanction letter",
    body: "Date: 18 September 2026\nApplication: APP-1042\n\nDear Ms. Asha Rao,\n\nYour application for a vehicle purchase loan has been approved on the following terms:\n\n  Sanctioned amount: ₹5,00,000\n  Tenure: 48 months\n  Indicative EMI: about ₹13,200 (mock rate of 12% p.a.)\n\nThis sanction is based on verified income of ₹90,000 per month, a clean transaction review and a post-loan debt-to-income ratio of about 24%.\n\nThis letter is generated by a research prototype and is not a real sanction.\n\nAgentiFi Underwriting",
  },
};

const case1043: CaseFile = {
  id: "APP-1043",
  applicant: {
    fullName: "Rahul Mehta",
    age: 34,
    dependents: 2,
    monthlyIncome: 65000,
    existingDebt: 18200,
    dti: 28,
    creditScore: 742,
    employmentType: "Salaried",
    employmentLength: "6 years",
  },
  loan: { amount: 850000, term: "60 months", purpose: "Home Renovation" },
  submittedAt: "18 Sep 2026, 09:41 IST",
  decision: "Manual Review",
  decisionConfidence: 87,
  riskInitial: 32,
  riskFinal: 47,
  creditConfidence: 91,
  fraudScore: 68,
  fraudConfidence: 84,
  overallRisk: "Medium",
  summary:
    "The application was assessed as moderate risk. The Credit Risk Agent initially produced a lower-risk assessment (32). The Fraud Investigation Agent's confidence (84%) crossed the challenge threshold (75%) and it raised a structured challenge. The Credit Risk Agent partially accepted it and re-evaluated to 47. The remaining income–cashflow mismatch and a post-loan debt ratio above the policy limit mean a human should decide.",
  agents: runs(
    ["Completed", "Completed", "Resolved", "Challenged", "Completed", "Completed"],
    ["1.2s", "2.8s", "3.1s", "2.4s", "1.7s", "0.9s"],
  ),
  documents: [
    {
      id: "d1",
      name: "Salary_Slip_Sep.pdf",
      type: "Salary slip",
      ocrStatus: "OCR Complete",
      extractionStatus: "Data Extracted",
      verification: "Passed",
      note: "Values align with the application.",
    },
    {
      id: "d2",
      name: "Bank_Statement_6M.pdf",
      type: "Bank statement",
      ocrStatus: "OCR Complete",
      extractionStatus: "Data Extracted",
      verification: "Warning",
      note: "Income inconsistency detected: average credits ₹42,000 vs salary ₹65,000.",
    },
    {
      id: "d3",
      name: "PAN_Card.png",
      type: "Identity document",
      ocrStatus: "OCR Complete",
      extractionStatus: "Identity Matched",
      verification: "Passed",
      note: "Name and date of birth matched.",
    },
  ],
  extractedFields: [
    { label: "Monthly Salary", value: "₹65,000" },
    { label: "Average Monthly Credit", value: "₹42,000" },
    { label: "Employer", value: "ABC Technologies" },
    { label: "Statement Period", value: "6 months" },
  ],
  policyChecks: [
    {
      label: "Income eligibility",
      passed: true,
      clause: "Mock Policy 2.1: Minimum verified monthly income ₹25,000.",
    },
    {
      label: "Loan amount eligibility",
      passed: true,
      clause: "Mock Policy 3.4: Unsecured personal loans up to ₹15,00,000.",
    },
    {
      label: "Employment requirement",
      passed: true,
      clause: "Mock Policy 2.3: At least 2 years in current employment.",
    },
    {
      label: "Debt-to-income threshold",
      passed: false,
      clause: "Mock Policy 4.2: Post-loan DTI must not exceed 50%. Applicant: about 57%.",
    },
  ],
  shapBefore: shap([
    ["Credit Score", 32],
    ["Monthly Income", 21],
    ["Employment Stability", 15],
    ["Debt-to-Income", -12],
    ["Loan Amount", -8],
  ]),
  shapAfter: shap([
    ["Credit Score", 32],
    ["Employment Stability", 15],
    ["Monthly Income", 9],
    ["Debt-to-Income", -12],
    ["Loan Amount", -8],
    ["Observed Cashflow", -16],
  ]),
  fraudSignals: [
    {
      label: "Transaction anomaly",
      severity: "High",
      evidence: "Three irregular high-value transfers within 30 days.",
    },
    {
      label: "Account consistency",
      severity: "Normal",
      evidence: "Account ownership and identity fields are consistent.",
    },
    {
      label: "Income–cashflow mismatch",
      severity: "Medium",
      evidence: "Average observed inflow is below reported monthly income.",
    },
    {
      label: "Transaction variance",
      severity: "High",
      evidence: "Month-to-month cashflow variance is outside the peer range.",
    },
  ],
  challenges: [
    {
      round: 1,
      raisedBy: "Fraud Investigation Agent",
      statement:
        "Transaction behaviour indicates a mismatch between reported income and observed cashflow.",
      evidence: [
        "Reported monthly income: ₹65,000",
        "Observed average inflow: ₹42,000",
        "Multiple unusual transactions detected",
      ],
      confidence: 84,
      threshold: CHALLENGE_THRESHOLD,
      originalScore: 32,
      reevaluatedScore: 47,
      stance: "Partially accepted",
      counterArgument:
        "The salary slip and PAN both verify the stated income, and the gap may be a second salary account. Only the observed-inflow evidence was accepted, not the claim that income is overstated.",
      response:
        "Observed cashflow was added as a model feature, which raised the risk score from 32 to 47.",
      status: "Resolved",
    },
  ],
  compliance: [
    {
      rule: "Income Eligibility",
      status: "Passed",
      detail: "Verified income ₹65,000 against ₹25,000 minimum.",
    },
    {
      rule: "Loan Amount Threshold",
      status: "Passed",
      detail: "₹8,50,000 is within the ₹15,00,000 band.",
    },
    {
      rule: "Debt Ratio Threshold",
      status: "Review",
      detail: "Post-loan DTI is about 57% (assumed 12% p.a., 60 months) against the 50% limit.",
    },
    { rule: "Document Verification", status: "Passed", detail: "Required documents are present." },
    {
      rule: "Fraud Risk Threshold",
      status: "Review",
      detail: "Fraud score 68 is in the review band (60–79).",
    },
  ],
  complianceNote:
    "Credit and Fraud no longer fully disagree after Round 1, but two rules sit in the review band and income remains unexplained, so the rule set routes this case to a human reviewer.",
  audit: events("APP-1043", [
    {
      time: "09:41:02",
      agent: "Intake Agent",
      action: "Application received",
      evidence: "12 structured applicant and loan fields",
      output: "Validation passed",
      status: "Completed",
    },
    {
      time: "09:41:05",
      agent: "Document Verification Agent",
      action: "Salary slip OCR completed",
      evidence: "Salary_Slip_Sep.pdf",
      output: "₹65,000 monthly salary extracted",
      status: "Completed",
    },
    {
      time: "09:41:08",
      agent: "Credit Risk Agent",
      action: "Initial risk score generated",
      evidence: "Credit and affordability features",
      output: "32% initial risk",
      status: "Completed",
    },
    {
      time: "09:41:11",
      agent: "Fraud Investigation Agent",
      action: "Anomaly detected",
      evidence: "Income and transaction-pattern mismatch",
      output: "68/100 fraud risk signal",
      status: "Challenged",
    },
    {
      time: "09:41:13",
      agent: "Fraud Investigation Agent",
      action: "Challenge Round 1 raised",
      evidence: "Confidence 84% ≥ threshold 75%; reported ₹65,000 vs observed ₹42,000",
      output: "Credit risk re-evaluation requested",
      status: "Challenged",
      round: 1,
    },
    {
      time: "09:41:16",
      agent: "Credit Risk Agent",
      action: "Round 1 partially accepted",
      evidence: "Salary slip verifies income; observed inflow added as a feature",
      output: "Risk updated from 32% to 47%",
      status: "Resolved",
      round: 1,
    },
    {
      time: "09:41:19",
      agent: "Compliance Agent",
      action: "Prototype policies evaluated",
      evidence: "Five mock eligibility checks",
      output: "Manual review required",
      status: "Completed",
    },
    {
      time: "09:41:22",
      agent: "Decision Agent",
      action: "Final decision generated",
      evidence: "Agent outputs and compliance arbitration",
      output: "Manual Review · 87% confidence",
      status: "Completed",
    },
  ]),
  letter: {
    title: "Draft sanction letter (issued only if the reviewer approves)",
    body: "Date: [issue date]\nApplication: APP-1043\n\nDear Mr. Rahul Mehta,\n\nSubject to the reviewer's approval, your application for a home renovation loan may be sanctioned on the following terms:\n\n  Sanctioned amount: ₹8,50,000\n  Tenure: 60 months\n  Indicative EMI: about ₹18,900 (mock rate of 12% p.a.)\n\nConditions: a satisfactory explanation of the difference between salary credited and the average inflow seen in the bank statement.\n\nThis letter is generated by a research prototype and is not a real sanction.\n\nAgentiFi Underwriting",
  },
};

const case1045: CaseFile = {
  id: "APP-1045",
  applicant: {
    fullName: "Vikram Singh",
    age: 41,
    dependents: 3,
    monthlyIncome: 55000,
    existingDebt: 26000,
    dti: 47,
    creditScore: 618,
    employmentType: "Self-employed",
    employmentLength: "2 years",
  },
  loan: { amount: 1200000, term: "60 months", purpose: "Business Expansion" },
  submittedAt: "17 Sep 2026, 10:22 IST",
  decision: "Rejected",
  decisionConfidence: 91,
  riskInitial: 58,
  riskFinal: 71,
  creditConfidence: 88,
  fraudScore: 82,
  fraudConfidence: 88,
  overallRisk: "High",
  summary:
    "Both agents rated this application high risk, but they disagreed about why. In Round 1 the Credit Risk Agent rejected the Fraud Agent's claim and kept its score at 58. In Round 2, with stronger evidence, it partially accepted and moved to 71. The agents still disagreed on whether income was verifiable, so the case was escalated to the Compliance Agent, which rejected the application on two hard rules: post-loan DTI far above the limit and a fraud score at the reject limit.",
  agents: runs(
    ["Completed", "Completed", "Resolved", "Challenged", "Completed", "Completed"],
    ["1.3s", "3.0s", "3.6s", "3.1s", "1.9s", "1.0s"],
  ),
  documents: [
    {
      id: "d1",
      name: "ITR_FY25.pdf",
      type: "Income tax return",
      ocrStatus: "OCR Complete",
      extractionStatus: "Data Extracted",
      verification: "Passed",
      note: "Filed income matches the application.",
    },
    {
      id: "d2",
      name: "Bank_Statement_6M.pdf",
      type: "Bank statement",
      ocrStatus: "OCR Complete",
      extractionStatus: "Data Extracted",
      verification: "Warning",
      note: "Cash deposits are not consistent with filed income.",
    },
    {
      id: "d3",
      name: "PAN_Card.png",
      type: "Identity document",
      ocrStatus: "OCR Complete",
      extractionStatus: "Identity Matched",
      verification: "Passed",
      note: "Name and date of birth matched.",
    },
  ],
  extractedFields: [
    { label: "Filed Monthly Income", value: "₹55,000" },
    { label: "Average Monthly Credit", value: "₹38,500" },
    { label: "Business", value: "Singh Traders" },
    { label: "Statement Period", value: "6 months" },
  ],
  policyChecks: [
    {
      label: "Income eligibility",
      passed: true,
      clause: "Mock Policy 2.1: Minimum verified monthly income ₹25,000.",
    },
    {
      label: "Loan amount eligibility",
      passed: true,
      clause: "Mock Policy 3.4: Unsecured personal loans up to ₹15,00,000.",
    },
    {
      label: "Employment requirement",
      passed: true,
      clause: "Mock Policy 2.4: Self-employed applicants need at least 2 years in business.",
    },
    {
      label: "Debt-to-income threshold",
      passed: false,
      clause: "Mock Policy 4.2: Post-loan DTI must not exceed 50%. Applicant: about 96%.",
    },
  ],
  shapBefore: shap([
    ["Debt-to-Income", -22],
    ["Credit Score", -18],
    ["Loan Amount", -14],
    ["Monthly Income", 8],
    ["Employment Stability", 4],
  ]),
  shapAfter: shap([
    ["Debt-to-Income", -22],
    ["Credit Score", -18],
    ["Observed Cashflow", -15],
    ["Loan Amount", -14],
    ["Cash Deposit Pattern", -9],
    ["Employment Stability", 4],
    ["Monthly Income", 3],
  ]),
  fraudSignals: [
    {
      label: "Transaction anomaly",
      severity: "High",
      evidence: "Round-sum transfers between two accounts of the same applicant.",
    },
    {
      label: "Account consistency",
      severity: "Medium",
      evidence: "Two linked accounts, one not disclosed on the application.",
    },
    {
      label: "Income–cashflow mismatch",
      severity: "High",
      evidence: "Observed inflow ₹38,500 is about 30% below filed income.",
    },
    {
      label: "Cash deposit pattern",
      severity: "High",
      evidence: "Nine cash deposits just under ₹50,000 in 60 days.",
    },
  ],
  challenges: [
    {
      round: 1,
      raisedBy: "Fraud Investigation Agent",
      statement:
        "Large transfers between linked accounts look like round-tripping that inflates cashflow.",
      evidence: [
        "Round-sum transfers between two linked accounts",
        "Second account not declared",
        "Observed inflow ₹38,500 vs filed ₹55,000",
      ],
      confidence: 79,
      threshold: CHALLENGE_THRESHOLD,
      originalScore: 58,
      reevaluatedScore: 58,
      stance: "Rejected",
      counterArgument:
        "The ITR is verified and the PAN matches. Transfers between the applicant's own accounts do not by themselves lower repayment capacity, so there is no new evidence to change the score.",
      response:
        "Score unchanged at 58. The challenge was not accepted, so a second round was allowed.",
      status: "Contested",
    },
    {
      round: 2,
      raisedBy: "Fraud Investigation Agent",
      statement:
        "Cash deposits sit just under the reporting limit, and income cannot be treated as verified.",
      evidence: [
        "Nine deposits between ₹45,000 and ₹49,500 in 60 days",
        "Deposit pattern absent from filed income",
        "Fraud score rose from 74 to 82",
      ],
      confidence: 88,
      threshold: CHALLENGE_THRESHOLD,
      originalScore: 58,
      reevaluatedScore: 71,
      stance: "Partially accepted",
      counterArgument:
        "The deposit pattern is a valid risk signal and was added as a feature. The ITR still verifies a base income, so income is not treated as fabricated.",
      response:
        "Score raised from 58 to 71, but the two agents still disagree on whether income is verifiable. The two-round limit has been reached.",
      status: "Escalated",
    },
  ],
  compliance: [
    {
      rule: "Income Eligibility",
      status: "Passed",
      detail: "Filed income ₹55,000 against ₹25,000 minimum.",
    },
    {
      rule: "Loan Amount Threshold",
      status: "Passed",
      detail: "₹12,00,000 is within the ₹15,00,000 band.",
    },
    {
      rule: "Debt Ratio Threshold",
      status: "Failed",
      detail: "Post-loan DTI is about 96% (assumed 12% p.a., 60 months) against the 50% limit.",
    },
    {
      rule: "Document Verification",
      status: "Review",
      detail: "Bank statement flagged for cash deposits not matching filed income.",
    },
    {
      rule: "Fraud Risk Threshold",
      status: "Failed",
      detail: "Fraud score 82 is at or above the reject limit of 80.",
    },
  ],
  complianceNote:
    "The challenge loop ended at the two-round limit with disagreement unresolved, so the Compliance Agent applied the rule set. Two hard rules failed, so the outcome is a rejection regardless of how the agents' disagreement would resolve.",
  audit: events("APP-1045", [
    {
      time: "10:22:02",
      agent: "Intake Agent",
      action: "Application received",
      evidence: "12 structured applicant and loan fields",
      output: "Validation passed",
      status: "Completed",
    },
    {
      time: "10:22:06",
      agent: "Document Verification Agent",
      action: "Bank statement flagged",
      evidence: "Bank_Statement_6M.pdf",
      output: "Cash deposits inconsistent with filed income",
      status: "Completed",
    },
    {
      time: "10:22:10",
      agent: "Credit Risk Agent",
      action: "Initial risk score generated",
      evidence: "Credit and affordability features",
      output: "58% initial risk",
      status: "Completed",
    },
    {
      time: "10:22:13",
      agent: "Fraud Investigation Agent",
      action: "Anomaly detected",
      evidence: "Linked-account transfers, income–cashflow gap",
      output: "74/100 fraud risk signal",
      status: "Challenged",
    },
    {
      time: "10:22:15",
      agent: "Fraud Investigation Agent",
      action: "Challenge Round 1 raised",
      evidence: "Confidence 79% ≥ threshold 75%; round-sum transfers between linked accounts",
      output: "Credit risk re-evaluation requested",
      status: "Challenged",
      round: 1,
    },
    {
      time: "10:22:18",
      agent: "Credit Risk Agent",
      action: "Round 1 rejected",
      evidence: "ITR verified; no new evidence on repayment capacity",
      output: "Score unchanged at 58%",
      status: "Challenged",
      round: 1,
    },
    {
      time: "10:22:21",
      agent: "Fraud Investigation Agent",
      action: "Challenge Round 2 raised",
      evidence: "Confidence 88% ≥ threshold 75%; nine deposits just under ₹50,000",
      output: "Fraud score raised to 82; re-evaluation requested",
      status: "Challenged",
      round: 2,
    },
    {
      time: "10:22:24",
      agent: "Credit Risk Agent",
      action: "Round 2 partially accepted",
      evidence: "Cash deposit pattern added as a feature",
      output: "Risk updated from 58% to 71%; disagreement on income remains",
      status: "Resolved",
      round: 2,
    },
    {
      time: "10:22:25",
      agent: "Compliance Agent",
      action: "Escalation received",
      evidence: "Two-round limit reached with unresolved disagreement",
      output: "Rule-based arbitration started",
      status: "Processing",
      round: 2,
    },
    {
      time: "10:22:27",
      agent: "Compliance Agent",
      action: "Policies evaluated",
      evidence: "Five mock eligibility checks",
      output: "2 hard rules failed: DTI 96% > 50%, fraud 82 ≥ 80",
      status: "Completed",
    },
    {
      time: "10:22:29",
      agent: "Decision Agent",
      action: "Final decision generated",
      evidence: "Agent outputs and compliance arbitration",
      output: "Rejected · 91% confidence",
      status: "Completed",
    },
  ]),
  letter: {
    title: "Decision notice",
    body: "Date: 17 September 2026\nApplication: APP-1045\n\nDear Mr. Vikram Singh,\n\nWe are unable to approve your application for a business expansion loan of ₹12,00,000.\n\nMain reasons:\n  1. The combined debt-to-income ratio after this loan would be about 96%, against a limit of 50%.\n  2. Cash deposits in the bank statement could not be reconciled with the filed income.\n\nYou may reapply with a lower amount, or with documents that explain the deposit pattern.\n\nThis letter is generated by a research prototype and is not a real decision.\n\nAgentiFi Underwriting",
  },
};

export const caseFiles: CaseFile[] = [case1042, case1043, case1045];

export const allAuditEvents: AuditEvent[] = caseFiles.flatMap((c) => c.audit);
