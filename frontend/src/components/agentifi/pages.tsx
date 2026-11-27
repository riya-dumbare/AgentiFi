import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FilePlus2,
  Fingerprint,
  Network,
  Plus,
  Search,
  UploadCloud,
  Users,
} from "lucide-react";
import {
  CHALLENGE_THRESHOLD,
  MAX_CHALLENGE_ROUNDS,
  dashboardMetrics,
  secondaryMetrics,
} from "@/data/mock-data";
import { formatINR } from "@/lib/format";
import { underwritingService } from "@/services/mock-underwriting-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApplicationTable } from "./application-table";
import { DecisionDistributionChart, RiskDistributionChart } from "./charts";
import { AuditList } from "./domain-panels";
import {
  Kicker,
  MetricCard,
  PageHeader,
  SectionHeader,
  StateRow,
  StatusBadge,
  Surface,
} from "./ui";

/* ---------------- Dashboard ---------------- */
export function DashboardPage() {
  const { data: apps = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: underwritingService.listApplications,
  });
  return (
    <>
      <PageHeader
        title="Underwriting Overview"
        subtitle="Monitor applications, agent activity, risk signals and underwriting decisions."
        action={
          <Button asChild>
            <Link to="/applications/new">
              <Plus />
              New application
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardMetrics.map((m, i) => (
          <MetricCard
            key={m.label}
            {...m}
            icon={
              [
                <BriefcaseBusiness />,
                <Users />,
                <CheckCircle2 />,
                <AlertTriangle />,
                <Fingerprint />,
              ][i]
            }
          />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {secondaryMetrics.map((m) => (
          <div key={m.label} className="rounded-md border border-border bg-surface px-4 py-3">
            <Kicker>{m.label}</Kicker>
            <p className="mt-1 text-lg font-semibold">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <Surface>
          <SectionHeader
            title="Recent Applications"
            description="Latest cases across the underwriting pipeline"
            aside={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/applications">
                  View all
                  <ArrowRight />
                </Link>
              </Button>
            }
          />
          <ApplicationTable rows={apps} limit={5} />
        </Surface>
        <Surface>
          <SectionHeader title="Agent Activity" description="Live demonstration state" />
          <div className="space-y-3 p-5">
            <StateRow state="warning" text="APP-1045 reached the round limit and was escalated" />
            <StateRow state="processing" text="Credit Risk Agent is re-evaluating APP-1046" />
            <StateRow state="complete" text="Compliance Agent cleared APP-1042" />
            <div className="rounded-md border border-primary/20 bg-primary-soft p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Network className="size-4" />
                Multi-agent orchestration
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Credit Risk and Fraud Investigation exchange structured evidence for up to{" "}
                {MAX_CHALLENGE_ROUNDS} rounds before compliance arbitration.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0" asChild>
                <Link to="/application/$applicationId" params={{ applicationId: "APP-1043" }}>
                  Open case
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </Surface>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Surface>
          <SectionHeader
            title="Application Risk Distribution"
            description="Portfolio grouped by current risk band"
          />
          <div className="p-4">
            <RiskDistributionChart />
          </div>
        </Surface>
        <Surface>
          <SectionHeader
            title="Decision Distribution"
            description="Outcomes across the current mock portfolio"
          />
          <div className="grid items-center md:grid-cols-[1fr_180px]">
            <DecisionDistributionChart />
            <div className="space-y-3 px-5 pb-5 md:pb-0">
              {[
                ["Approved", "71.5%", "bg-success"],
                ["Manual review", "11.0%", "bg-warning"],
                ["Rejected", "17.5%", "bg-danger"],
              ].map(([a, b, c]) => (
                <div key={a} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${c}`} />
                    {a}
                  </span>
                  <strong>{b}</strong>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}

/* ---------------- Applications list ---------------- */
const decisionFilters = ["All", "Approved", "Manual Review", "Rejected", "Pending"];
export function ApplicationsPage() {
  const { data: apps = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: underwritingService.listApplications,
  });
  const [query, setQuery] = useState("");
  const [decision, setDecision] = useState("All");
  const q = query.trim().toLowerCase();
  const rows = apps.filter(
    (a) =>
      (decision === "All" || a.decision === decision) &&
      (!q || a.id.toLowerCase().includes(q) || a.applicant.toLowerCase().includes(q)),
  );
  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Review and open every application in the underwriting pipeline."
        action={
          <Button asChild>
            <Link to="/applications/new">
              <FilePlus2 />
              New application
            </Link>
          </Button>
        }
      />
      <Surface>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search ID or applicant"
              aria-label="Search applications"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by decision">
            {decisionFilters.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={decision === f ? "default" : "outline"}
                onClick={() => setDecision(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
        <ApplicationTable rows={rows} />
      </Surface>
    </>
  );
}

/* ---------------- New application ---------------- */
type FormState = {
  fullName: string;
  age: string;
  dependents: string;
  monthlyIncome: string;
  existingDebt: string;
  creditScore: string;
  employmentType: string;
  employmentLength: string;
  loanAmount: string;
  loanTerm: string;
  loanPurpose: string;
};
const emptyForm: FormState = {
  fullName: "",
  age: "",
  dependents: "",
  monthlyIncome: "",
  existingDebt: "",
  creditScore: "",
  employmentType: "",
  employmentLength: "",
  loanAmount: "",
  loanTerm: "",
  loanPurpose: "",
};
const labels: Record<keyof FormState, string> = {
  fullName: "Full Name",
  age: "Age",
  dependents: "Number of Dependents",
  monthlyIncome: "Monthly Income",
  existingDebt: "Existing Debt",
  creditScore: "Credit Score",
  employmentType: "Employment Type",
  employmentLength: "Employment Length",
  loanAmount: "Loan Amount",
  loanTerm: "Loan Term",
  loanPurpose: "Loan Purpose",
};
const sections: {
  title: string;
  fields: { id: keyof FormState; type: string; placeholder: string; wide?: boolean }[];
}[] = [
  {
    title: "Personal Information",
    fields: [
      { id: "fullName", type: "text", placeholder: "Full legal name", wide: true },
      { id: "age", type: "number", placeholder: "34" },
      { id: "dependents", type: "number", placeholder: "2" },
    ],
  },
  {
    title: "Financial Information",
    fields: [
      { id: "monthlyIncome", type: "number", placeholder: "65000" },
      { id: "existingDebt", type: "number", placeholder: "18200" },
      { id: "creditScore", type: "number", placeholder: "742" },
      { id: "employmentType", type: "select", placeholder: "" },
      { id: "employmentLength", type: "text", placeholder: "6 years" },
    ],
  },
  {
    title: "Loan Information",
    fields: [
      { id: "loanAmount", type: "number", placeholder: "500000" },
      { id: "loanTerm", type: "text", placeholder: "60 months" },
      { id: "loanPurpose", type: "text", placeholder: "Home Renovation", wide: true },
    ],
  },
];
const docSlots = [
  { id: "income", label: "Income proof", hint: "Salary slip or ITR (PDF / image)", required: true },
  { id: "bank", label: "Bank statement", hint: "Last 6 months (PDF)", required: true },
  {
    id: "identity",
    label: "Identity document",
    hint: "PAN or Aadhaar (image / PDF)",
    required: false,
  },
];

export function NewApplicationPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const set = (id: keyof FormState, value: string) => setForm((f) => ({ ...f, [id]: value }));

  const income = Number(form.monthlyIncome);
  const debt = Number(form.existingDebt);
  const dti =
    form.monthlyIncome && form.existingDebt && income > 0
      ? Math.round((debt / income) * 100)
      : null;
  const filledInputs = (Object.keys(form) as (keyof FormState)[]).filter(
    (k) => form[k].trim() !== "",
  );
  const collected = filledInputs.length + (dti !== null ? 1 : 0);
  const total = 12;
  const nextMissing = (Object.keys(emptyForm) as (keyof FormState)[]).find(
    (k) => form[k].trim() === "",
  );
  const docsReady = docSlots.filter((d) => d.required).every((d) => files[d.id]);
  const ready = collected === total && docsReady;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await underwritingService.submitApplication({
        fullName: form.fullName,
        age: Number(form.age),
        dependents: Number(form.dependents),
        monthlyIncome: income,
        existingDebt: debt,
        creditScore: Number(form.creditScore),
        employmentType: form.employmentType,
        employmentLength: form.employmentLength,
        loanAmount: Number(form.loanAmount),
        loanTerm: form.loanTerm,
        loanPurpose: form.loanPurpose,
      });
      await underwritingService.uploadDocuments(res.id, files);
      setSubmittedId(res.id);
    } catch {
      setSubmitError("Submission failed. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New Loan Application"
        subtitle="Applicant details and supporting documents for underwriting."
      />
      <div className="mb-6 grid grid-cols-3 overflow-hidden rounded-md border border-border bg-surface">
        {[
          ["01", "Application"],
          ["02", "Analysis"],
          ["03", "Decision"],
        ].map(([n, l], i) => {
          const active = submittedId ? i === 1 : i === 0;
          return (
            <div
              key={n}
              className={`flex items-center gap-3 border-r border-border px-3 py-4 last:border-0 ${active ? "bg-primary-soft" : ""}`}
            >
              <span
                className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {n}
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.1em] sm:block">
                {l}
              </span>
            </div>
          );
        })}
      </div>
      {submittedId ? (
        <Surface>
          <div className="grid place-items-center p-12 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
              <Bot />
            </span>
            <h2 className="mt-4 text-xl font-semibold">{submittedId} submitted</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              The application was added to the list as Processing. No backend is connected, so the
              agents do not run on it yet.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/applications">
                  View applications
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(emptyForm);
                  setFiles({});
                  setSubmittedId(null);
                }}
              >
                Start another
              </Button>
            </div>
          </div>
        </Surface>
      ) : (
        <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {sections.map((section) => (
              <Surface key={section.title}>
                <SectionHeader title={section.title} />
                <div className="grid gap-5 p-5 md:grid-cols-2">
                  {section.fields.map((f) => (
                    <div key={f.id} className={f.wide ? "md:col-span-2" : ""}>
                      <Label htmlFor={f.id}>{labels[f.id]}</Label>
                      {f.type === "select" ? (
                        <select
                          id={f.id}
                          value={form[f.id]}
                          onChange={(e) => set(f.id, e.target.value)}
                          className="mt-2 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                          required
                        >
                          <option value="" disabled>
                            Select…
                          </option>
                          <option>Salaried</option>
                          <option>Self-employed</option>
                        </select>
                      ) : (
                        <Input
                          id={f.id}
                          type={f.type}
                          min={f.type === "number" ? 0 : undefined}
                          placeholder={f.placeholder}
                          value={form[f.id]}
                          onChange={(e) => set(f.id, e.target.value)}
                          className="mt-2"
                          required
                        />
                      )}
                    </div>
                  ))}
                  {section.title === "Financial Information" && (
                    <div>
                      <Label>Debt-to-Income Ratio</Label>
                      <div className="mt-2 flex h-9 items-center rounded-md border border-dashed border-border bg-muted px-3 text-sm">
                        {dti !== null ? `${dti}%` : "Calculated from income and debt"}
                      </div>
                    </div>
                  )}
                </div>
              </Surface>
            ))}
            <Surface>
              <SectionHeader
                title="Supporting Documents"
                description="Read by the Document Verification Agent (OCR and policy retrieval)"
              />
              <div className="grid gap-4 p-5 md:grid-cols-3">
                {docSlots.map((d) => (
                  <label
                    key={d.id}
                    className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary"
                  >
                    <UploadCloud className="size-5 text-primary" />
                    <span className="mt-2 text-sm font-medium">
                      {d.label}
                      {d.required && <span className="text-danger"> *</span>}
                    </span>
                    <span className="mt-1 text-[11px] text-muted-foreground">
                      {files[d.id]?.name ?? d.hint}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFiles((f) => {
                          const next = { ...f };
                          if (file) next[d.id] = file;
                          else delete next[d.id];
                          return next;
                        });
                      }}
                    />
                  </label>
                ))}
              </div>
            </Surface>
            <Button size="lg" type="submit" disabled={!ready || submitting}>
              {submitting ? "Submitting…" : "Start Underwriting"}
              <ArrowRight />
            </Button>
            {submitError && <StateRow state="error" text={submitError} />}
            {!ready && (
              <p className="text-xs text-muted-foreground">
                Fill all fields and attach the two required documents to continue.
              </p>
            )}
          </div>
          <div>
            <Surface className="sticky top-24">
              <SectionHeader
                title="Intake Agent"
                description="Guides the form as you fill it"
                aside={<StatusBadge status={collected === total ? "Completed" : "Waiting"} />}
              />
              <div className="p-5">
                <div className="rounded-md bg-primary-soft p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Bot className="size-4" />
                    Intake Agent
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">
                    {nextMissing
                      ? `Next I need the applicant's ${labels[nextMissing].toLowerCase()}.`
                      : docsReady
                        ? "I have everything I need. Review and submit."
                        : "Details complete. Please attach the income proof and bank statement."}
                  </p>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fields collected</span>
                    <strong>
                      {collected} / {total}
                    </strong>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(collected / total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Documents</span>
                    <span>
                      {docSlots.filter((d) => files[d.id]).length} / {docSlots.length}
                    </span>
                  </div>
                </div>
                <p className="mt-5 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
                  Prompts are rule-based in this frontend. LLM conversational parsing is not
                  connected.
                </p>
              </div>
            </Surface>
          </div>
        </form>
      )}
    </>
  );
}

/* ---------------- Audit ---------------- */
export function AuditPage() {
  const { data: events = [] } = useQuery({
    queryKey: ["audit"],
    queryFn: underwritingService.listAuditEvents,
  });
  const exportLog = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(events, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "agentifi-audit-log.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageHeader
        title="Audit Trail"
        subtitle="A complete chronological record of agent actions, evidence and structured outputs."
        action={
          <Button variant="outline" onClick={exportLog} disabled={events.length === 0}>
            <Download />
            Export log
          </Button>
        }
      />
      <AuditList events={events} showCase />
    </>
  );
}

/* ---------------- Settings (read-only) ---------------- */
export function SettingsPage() {
  const rows = [
    ["Workspace", "AgentiFi Research Demo"],
    ["Currency", "INR — Indian Rupee"],
    ["Maximum challenge rounds", String(MAX_CHALLENGE_ROUNDS)],
    ["Challenge confidence threshold", `${CHALLENGE_THRESHOLD}%`],
    ["Fraud reject limit (mock policy)", "80 / 100"],
    ["Post-loan DTI limit (mock policy)", "50%"],
  ];
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Workflow parameters used by this research prototype."
      />
      <div className="max-w-3xl space-y-5">
        <Surface>
          <SectionHeader
            title="Research Environment"
            description="Read-only. These values are fixed by the demonstrated architecture."
          />
          <dl className="divide-y divide-border">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-5 py-4 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Surface>
        <StateRow
          state="warning"
          text="This is a frontend prototype. No backend, APIs or ML models are connected."
        />
      </div>
    </>
  );
}
