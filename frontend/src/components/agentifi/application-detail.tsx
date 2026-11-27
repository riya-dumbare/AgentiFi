import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, FileQuestion, UserRound } from "lucide-react";
import { useState } from "react";
import { formatINR } from "@/lib/format";
import { underwritingService } from "@/services/mock-underwriting-service";
import type { CaseFile } from "@/data/types";
import { AgentWorkflowDiagram } from "./workflow";
import {
  AuditList,
  ChallengePanel,
  CompliancePanel,
  CreditRiskPanel,
  DecisionPanel,
  DocumentsPanel,
  FraudPanel,
} from "./domain-panels";
import { EmptyState, Kicker, PageHeader, StateRow, StatusBadge, Surface } from "./ui";

const tabs = [
  "Overview",
  "Documents",
  "Agents",
  "Explainability",
  "Fraud Intelligence",
  "Challenges",
  "Compliance",
  "Audit Trail",
  "Decision",
];

export function ApplicationDetailPage() {
  const { applicationId } = useParams({ from: "/application/$applicationId" });
  const { data: c, isLoading } = useQuery({
    queryKey: ["case", applicationId],
    queryFn: () => underwritingService.getCase(applicationId),
  });
  const back = (
    <Link
      to="/applications"
      className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary"
    >
      <ArrowLeft className="size-4" />
      Back to applications
    </Link>
  );

  if (isLoading)
    return (
      <>
        {back}
        <StateRow state="loading" text={`Loading ${applicationId}…`} />
      </>
    );
  if (!c) {
    return (
      <>
        {back}
        <Surface>
          <EmptyState
            icon={<FileQuestion className="size-5" />}
            title={`No detailed case for ${applicationId}`}
            text="Only APP-1042, APP-1043 and APP-1045 have full agent output in this prototype. Newly submitted applications stay in Processing because no backend runs the agents."
          />
        </Surface>
      </>
    );
  }
  return <CaseView c={c} back={back} />;
}

function CaseView({ c, back }: { c: CaseFile; back: React.ReactNode }) {
  const [tab, setTab] = useState("Overview");
  return (
    <>
      {back}
      <PageHeader
        eyebrow={c.id}
        title={c.applicant.fullName}
        subtitle={`${formatINR(c.loan.amount)} · ${c.loan.purpose}`}
        action={<StatusBadge status={c.decision} />}
      />
      <div className="mb-5 flex flex-wrap gap-5 rounded-lg border border-border bg-surface p-4 text-xs">
        <span className="flex items-center gap-2">
          <UserRound className="size-4 text-primary" />
          <strong>{c.applicant.age}</strong> years · {c.applicant.employmentType}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          Submitted {c.submittedAt}
        </span>
        <span>
          Credit score <strong>{c.applicant.creditScore}</strong>
        </span>
        <span>
          Term <strong>{c.loan.term}</strong>
        </span>
      </div>
      <div className="mb-5 overflow-x-auto border-b border-border">
        <div className="flex min-w-max gap-1">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`border-b-2 px-3 py-3 text-xs font-medium ${tab === item ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <TabContent c={c} tab={tab} />
    </>
  );
}

function TabContent({ c, tab }: { c: CaseFile; tab: string }) {
  if (tab === "Documents") return <DocumentsPanel c={c} />;
  if (tab === "Agents")
    return (
      <Surface>
        <AgentWorkflowDiagram c={c} />
      </Surface>
    );
  if (tab === "Explainability") return <CreditRiskPanel c={c} />;
  if (tab === "Fraud Intelligence") return <FraudPanel c={c} />;
  if (tab === "Challenges") return <ChallengePanel c={c} />;
  if (tab === "Compliance") return <CompliancePanel c={c} />;
  if (tab === "Audit Trail") return <AuditList events={c.audit} />;
  if (tab === "Decision") return <DecisionPanel c={c} />;
  const a = c.applicant;
  const snapshot = [
    ["Monthly Income", `₹${a.monthlyIncome.toLocaleString("en-IN")}`],
    ["Existing Debt", `₹${a.existingDebt.toLocaleString("en-IN")}`],
    ["Debt-to-Income", `${a.dti}%`],
    ["Employment", a.employmentLength],
    ["Dependents", String(a.dependents)],
    ["Credit Score", String(a.creditScore)],
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
      <DecisionPanel c={c} />
      <Surface>
        <div className="p-5">
          <Kicker>Applicant Snapshot</Kicker>
          <dl className="mt-4 grid grid-cols-2 gap-5">
            {snapshot.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Surface>
    </div>
  );
}
