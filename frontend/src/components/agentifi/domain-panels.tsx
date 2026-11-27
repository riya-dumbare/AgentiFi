import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  Fingerprint,
  Scale,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_CHALLENGE_ROUNDS } from "@/data/mock-data";
import type { AuditEvent, CaseFile, Challenge, DecisionType } from "@/data/types";
import { FeatureContributionChart } from "./charts";
import { CheckLine, Kicker, ScoreGauge, SectionHeader, StatusBadge, Surface } from "./ui";

const riskTone = (score: number) => (score >= 65 ? "danger" : score >= 40 ? "warning" : "success");

/* ---------------- Credit risk + SHAP (before / after) ---------------- */
export function CreditRiskPanel({ c }: { c: CaseFile }) {
  const challenged = c.challenges.length > 0;
  return (
    <Surface>
      <SectionHeader
        title="Credit Risk Agent"
        description="XGBoost score with SHAP-based model explanation"
        aside={<StatusBadge status={challenged ? "Resolved" : "Completed"} />}
      />
      <div className="grid gap-6 p-5">
        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          <ScoreGauge
            score={c.riskFinal}
            label="Final Credit Risk Score"
            tone={riskTone(c.riskFinal)}
          />
          <div>
            <dl className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-muted p-3">
                <dt>
                  <Kicker>Model</Kicker>
                </dt>
                <dd className="mt-1 text-sm font-semibold">XGBoost</dd>
              </div>
              <div className="rounded-md bg-muted p-3">
                <dt>
                  <Kicker>Confidence</Kicker>
                </dt>
                <dd className="mt-1 text-sm font-semibold">{c.creditConfidence}%</dd>
              </div>
              <div className="rounded-md bg-muted p-3">
                <dt>
                  <Kicker>Initial → Final</Kicker>
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {c.riskInitial} → {c.riskFinal}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Prototype model output. Feature contributions explain directional impact; they do not
              expose hidden reasoning.
            </p>
          </div>
        </div>
        <div className="min-w-0 border-t border-border pt-5">
          <div className="flex items-center justify-between">
            <div>
              <Kicker>Model Explanation</Kicker>
              <h3 className="mt-1 text-sm font-semibold">
                {challenged
                  ? "SHAP contributions before and after the challenge"
                  : "SHAP Feature Contributions"}
              </h3>
            </div>
            <div className="flex gap-3 text-[10px]">
              <span className="text-success">■ Positive</span>
              <span className="text-danger">■ Risk</span>
            </div>
          </div>
          {challenged ? (
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Before challenge · risk {c.riskInitial}%
                </p>
                <FeatureContributionChart data={c.shapBefore} />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  After challenge · risk {c.riskFinal}%
                </p>
                <FeatureContributionChart data={c.shapAfter} />
              </div>
            </div>
          ) : (
            <FeatureContributionChart data={c.shapAfter} />
          )}
        </div>
      </div>
    </Surface>
  );
}

/* ---------------- Fraud ---------------- */
export function FraudPanel({ c }: { c: CaseFile }) {
  const flagged = c.fraudSignals.some((s) => s.severity !== "Normal");
  return (
    <Surface>
      <SectionHeader
        title="Fraud Investigation Agent"
        description="Evidence-based anomaly assessment"
        aside={<StatusBadge status={c.challenges.length ? "Challenged" : "Completed"} />}
      />
      <div className="grid gap-6 p-5">
        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          <ScoreGauge score={c.fraudScore} label="Fraud Risk Score" tone={riskTone(c.fraudScore)} />
          <div>
            {flagged ? (
              <div className="rounded-md border border-danger/20 bg-danger-soft p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-danger">
                  <AlertTriangle className="size-4" />
                  Potential anomaly detected
                </div>
                <p className="mt-1 text-xs text-danger/80">
                  Requires investigation; not a confirmed fraud finding.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-success/20 bg-success-soft p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-success">
                  <CheckCircle2 className="size-4" />
                  No anomaly detected
                </div>
              </div>
            )}
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <dt>
                  <Kicker>Detection Method</Kicker>
                </dt>
                <dd className="mt-1 text-xs font-semibold">Anomaly Detection</dd>
              </div>
              <div>
                <dt>
                  <Kicker>Confidence</Kicker>
                </dt>
                <dd className="mt-1 text-xs font-semibold">{c.fraudConfidence}%</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="min-w-0 border-t border-border pt-5">
          <Kicker>Fraud Signals</Kicker>
          <div className="mt-3 divide-y divide-border rounded-md border border-border">
            {c.fraudSignals.map((signal) => (
              <div key={signal.label} className="flex items-start justify-between gap-4 p-4">
                <div className="flex min-w-0 gap-3">
                  <Fingerprint
                    className={`mt-0.5 size-4 shrink-0 ${signal.severity === "Normal" ? "text-success" : signal.severity === "High" ? "text-danger" : "text-warning-foreground"}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{signal.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{signal.evidence}</p>
                  </div>
                </div>
                <StatusBadge status={signal.severity} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

/* ---------------- Challenges (every round, both sides) ---------------- */
function ChallengeRound({ ch }: { ch: Challenge }) {
  return (
    <Surface className="overflow-hidden border-warning/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warning/20 bg-warning-soft px-5 py-4">
        <div>
          <Kicker>
            Challenge Round {String(ch.round).padStart(2, "0")} of {MAX_CHALLENGE_ROUNDS}
          </Kicker>
          <h2 className="mt-1 text-sm font-semibold">Structured agent-to-agent challenge</h2>
        </div>
        <StatusBadge status={ch.status} />
      </div>
      <div className="grid lg:grid-cols-[1fr_48px_1fr]">
        <div className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Fingerprint className="size-4 text-danger" />
            {ch.raisedBy}
          </div>
          <p className="mt-4 text-sm leading-relaxed">“{ch.statement}”</p>
          <div className="mt-4 rounded-md bg-muted p-4">
            <Kicker>Evidence</Kicker>
            <ul className="mt-2 space-y-2">
              {ch.evidence.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-xs">
            <span className="text-muted-foreground">Confidence</span>{" "}
            <strong>{ch.confidence}%</strong>{" "}
            <span className="text-muted-foreground">≥ threshold</span>{" "}
            <strong>{ch.threshold}%</strong>
          </p>
        </div>
        <div className="hidden items-center justify-center border-x border-border text-primary lg:flex">
          <ArrowRight className="size-5" />
        </div>
        <div className="border-t border-border p-5 lg:border-t-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" />
              Credit Risk Agent Response
            </div>
            <StatusBadge status={ch.stance} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{ch.counterArgument}</p>
          <div className="mt-5 flex items-center gap-4">
            <div>
              <Kicker>Original Risk</Kicker>
              <p className="mt-1 text-2xl font-semibold">{ch.originalScore}%</p>
            </div>
            <ArrowRight className="size-5 text-primary" />
            <div>
              <Kicker>Re-evaluated Risk</Kicker>
              <p className="mt-1 text-2xl font-semibold text-warning-foreground">
                {ch.reevaluatedScore}%
              </p>
            </div>
          </div>
          <div
            className={`mt-4 rounded-md border p-4 ${ch.status === "Escalated" ? "border-danger/20 bg-danger-soft" : ch.status === "Contested" ? "border-warning/25 bg-warning-soft" : "border-success/20 bg-success-soft"}`}
          >
            <p className="text-xs leading-relaxed">{ch.response}</p>
          </div>
        </div>
      </div>
    </Surface>
  );
}

export function ChallengePanel({ c }: { c: CaseFile }) {
  if (c.challenges.length === 0) {
    return (
      <Surface>
        <SectionHeader
          title="No challenge raised"
          description="Fraud confidence stayed below the challenge threshold"
          aside={<StatusBadge status="Completed" />}
        />
        <div className="p-5 text-sm text-muted-foreground">
          The Fraud Investigation Agent's confidence was {c.fraudConfidence}%, below the 75%
          threshold, so the Credit Risk Agent's score of {c.riskFinal}% was not contested.
        </div>
      </Surface>
    );
  }
  return (
    <div className="space-y-5">
      {c.challenges.map((ch) => (
        <ChallengeRound key={ch.round} ch={ch} />
      ))}
    </div>
  );
}

/* ---------------- Compliance ---------------- */
function Assessment({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <StatusBadge status={value} />
    </div>
  );
}
const band = (score: number) => (score >= 60 ? "High" : score >= 35 ? "Medium" : "Low");

export function CompliancePanel({ c }: { c: CaseFile }) {
  const outcome =
    c.decision === "Approved" ? "Passed" : c.decision === "Rejected" ? "Failed" : "Review";
  const escalated = c.challenges.some((ch) => ch.status === "Escalated");
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <Surface>
        <SectionHeader
          title="Prototype Policy Checks"
          description="Illustrative rules for this academic frontend"
        />
        <div className="divide-y divide-border">
          {c.compliance.map((check) => (
            <div key={check.rule} className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="flex gap-3">
                {check.status === "Passed" ? (
                  <CheckCircle2 className="mt-0.5 size-4 text-success" />
                ) : check.status === "Failed" ? (
                  <XCircle className="mt-0.5 size-4 text-danger" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-4 text-warning-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">{check.rule}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </div>
              <StatusBadge status={check.status} />
            </div>
          ))}
        </div>
      </Surface>
      <Surface>
        <SectionHeader
          title="Compliance Arbitration"
          description={
            escalated ? "Escalated after the round limit" : "Resolves remaining agent disagreement"
          }
        />
        <div className="space-y-4 p-5">
          <Assessment label="Credit Risk Assessment" value={band(c.riskFinal)} />
          <Assessment label="Fraud Assessment" value={band(c.fraudScore)} />
          <div className="border-t border-border pt-4">
            <Assessment label="Compliance Outcome" value={outcome} />
          </div>
          <p className="rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
            {c.complianceNote}
          </p>
        </div>
      </Surface>
    </div>
  );
}

/* ---------------- Documents + RAG ---------------- */
export function DocumentsPanel({ c }: { c: CaseFile }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <Surface>
        <SectionHeader
          title="Verified Documents"
          description="Simulated OCR and structured extraction outputs"
        />
        <div className="divide-y divide-border">
          {c.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary">
                  <FileCheck2 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.ocrStatus} · {doc.extractionStatus}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{doc.note}</p>
                </div>
              </div>
              <StatusBadge status={doc.verification} />
            </div>
          ))}
        </div>
      </Surface>
      <Surface>
        <SectionHeader title="Extracted Information" description="Review before decisioning" />
        <dl className="grid grid-cols-2 gap-px bg-border">
          {c.extractedFields.map((field) => (
            <div key={field.label} className="bg-surface p-4">
              <dt>
                <Kicker>{field.label}</Kicker>
              </dt>
              <dd className="mt-2 text-sm font-semibold">{field.value}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-border p-5">
          <Kicker>RAG Policy Check</Kicker>
          <div className="mt-3 space-y-4">
            {c.policyChecks.map((check) => (
              <div key={check.label}>
                <CheckLine ok={check.passed}>{check.label}</CheckLine>
                <p className="ml-7 mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {check.clause}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Simulated retrieval against mock policy documents.
          </p>
        </div>
      </Surface>
    </div>
  );
}

/* ---------------- Audit trail (filterable) ---------------- */
export function AuditList({
  events,
  showCase = false,
}: {
  events: AuditEvent[];
  showCase?: boolean;
}) {
  const [agent, setAgent] = useState("All");
  const [challengesOnly, setChallengesOnly] = useState(false);
  const agents = ["All", ...Array.from(new Set(events.map((e) => e.agent)))];
  const shown = events.filter(
    (e) => (agent === "All" || e.agent === agent) && (!challengesOnly || e.round !== undefined),
  );
  return (
    <Surface>
      <SectionHeader
        title="Chronological Agent Events"
        description="Expandable evidence, output and status for every material action"
        aside={
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <select
              aria-label="Filter by agent"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              {agents.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={challengesOnly}
                onChange={(e) => setChallengesOnly(e.target.checked)}
              />
              Challenge events only
            </label>
          </div>
        }
      />
      <div className="divide-y divide-border">
        {shown.length === 0 && (
          <p className="p-5 text-sm text-muted-foreground">No events match these filters.</p>
        )}
        {shown.map((event, i) => (
          <details key={event.id} className="group">
            <summary
              className={`grid cursor-pointer list-none items-center gap-3 px-5 py-4 hover:bg-muted/30 ${showCase ? "grid-cols-[70px_80px_1fr_auto]" : "grid-cols-[70px_1fr_auto]"}`}
            >
              <span className="font-mono text-xs text-muted-foreground">{event.time}</span>
              {showCase && (
                <span className="font-mono text-xs font-semibold text-primary">{event.caseId}</span>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-8 place-items-center rounded-full ${i === shown.length - 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  <ShieldCheck className="size-3.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {event.action}
                    {event.round !== undefined && (
                      <span className="ml-2 rounded bg-warning-soft px-1.5 py-0.5 text-[10px] font-semibold text-warning-foreground">
                        Round {event.round}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{event.agent}</p>
                </div>
              </div>
              <StatusBadge status={event.status} />
            </summary>
            <div
              className={`grid gap-3 bg-muted/30 px-5 py-4 text-xs md:grid-cols-2 ${showCase ? "pl-[182px]" : "pl-[102px]"}`}
            >
              <div>
                <Kicker>Input / Evidence</Kicker>
                <p className="mt-1 text-muted-foreground">{event.evidence}</p>
              </div>
              <div>
                <Kicker>Output</Kicker>
                <p className="mt-1 text-muted-foreground">{event.output}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </Surface>
  );
}

/* ---------------- Decision, human review, letter ---------------- */
function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DecisionPanel({ c }: { c: CaseFile }) {
  const [override, setOverride] = useState<{ decision: DecisionType; reason: string } | null>(null);
  const [reason, setReason] = useState("");
  const decision = override?.decision ?? c.decision;
  const needsReview = c.decision === "Manual Review" && !override;
  const headline = decision === "Manual Review" ? "MANUAL REVIEW" : decision.toUpperCase();
  const sub = override
    ? `Decided by human reviewer: ${override.reason}`
    : decision === "Manual Review"
      ? "Human assessment recommended before sanction"
      : decision === "Approved"
        ? "Approved by the agent pipeline"
        : "Rejected by compliance arbitration";
  const showLetter = c.decision !== "Manual Review" || override?.decision === "Approved";
  return (
    <Surface className="overflow-hidden">
      <div className="border-b border-border bg-decision px-6 py-8 text-center text-decision-foreground">
        <Kicker>Final Underwriting Decision</Kicker>
        <h2 className="mt-3 text-4xl font-semibold">{headline}</h2>
        <p className="mt-2 text-sm text-decision-muted">{sub}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-5">
        {[
          ["Credit Risk", `${c.riskFinal} / 100`],
          ["Fraud Risk", `${c.fraudScore} / 100`],
          ["Overall Risk", c.overallRisk],
          ["Confidence", `${c.decisionConfidence}%`],
          ["Challenge Rounds", `${c.challenges.length} of ${MAX_CHALLENGE_ROUNDS}`],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface p-4 text-center">
            <Kicker>{label}</Kicker>
            <p className="mt-2 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="p-6">
        <h3 className="text-sm font-semibold">Decision Summary</h3>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">{c.summary}</p>
        <div className="mt-5 flex items-center gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <Scale className="size-4 text-primary" />
          Structured evidence summary only. No private chain-of-thought is displayed.
        </div>

        {needsReview && (
          <div className="mt-6 rounded-md border border-warning/30 bg-warning-soft p-4">
            <h3 className="text-sm font-semibold text-warning-foreground">
              Reviewer action required
            </h3>
            <p className="mt-1 text-xs text-warning-foreground/80">
              Record a decision and a reason. In the real system this is written to the audit trail.
            </p>
            <Input
              className="mt-3 bg-background"
              placeholder="Reason for the decision"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              aria-label="Reason for the decision"
            />
            <div className="mt-3 flex gap-3">
              <Button
                disabled={!reason.trim()}
                onClick={() => setOverride({ decision: "Approved", reason: reason.trim() })}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                disabled={!reason.trim()}
                onClick={() => setOverride({ decision: "Rejected", reason: reason.trim() })}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
        {override && (
          <p className="mt-6 text-xs text-muted-foreground">
            Reviewer decision recorded in this session only. It is not saved anywhere.
          </p>
        )}

        {showLetter && (
          <div className="mt-6 rounded-md border border-border">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">{c.letter.title}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(`${c.id}-letter.txt`, c.letter.body)}
              >
                <Download />
                Download
              </Button>
            </div>
            <pre className="whitespace-pre-wrap p-4 font-sans text-xs leading-relaxed text-muted-foreground">
              {c.letter.body}
            </pre>
          </div>
        )}
      </div>
    </Surface>
  );
}
