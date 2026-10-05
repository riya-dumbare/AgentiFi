import {
  ArrowDown,
  ArrowLeftRight,
  Bot,
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  Scale,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { MAX_CHALLENGE_ROUNDS } from "@/data/mock-data";
import type { CaseFile } from "@/data/types";
import { StatusBadge } from "./ui";

const icons = [UserRoundCheck, FileCheck2, Sparkles, Fingerprint, Scale, Bot];

function AgentNode({
  c,
  index,
  featured = false,
}: {
  c: CaseFile;
  index: number;
  featured?: boolean;
}) {
  const agent = c.agents[index];
  const Icon = icons[index];
  if (!agent || !Icon) return null;
  return (
    <div
      className={`relative rounded-lg border bg-surface p-4 shadow-panel ${featured ? "border-primary/30" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-md ${featured ? "bg-primary-soft text-primary" : "bg-secondary text-secondary-foreground"}`}
          >
            <Icon className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{agent.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {agent.description}
            </p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
        <span>Agent status</span>
        <span>{agent.time}</span>
      </div>
    </div>
  );
}

export function AgentWorkflowDiagram({ c }: { c: CaseFile }) {
  const rounds = c.challenges.length;
  const last = c.challenges[rounds - 1];
  const escalated = last?.status === "Escalated";
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mx-auto max-w-md">
        <AgentNode c={c} index={0} />
        <div className="flex justify-center py-2 text-primary">
          <ArrowDown className="size-5" />
        </div>
        <AgentNode c={c} index={1} />
      </div>
      <div className="flex justify-center py-2 text-primary">
        <ArrowDown className="size-5" />
      </div>
      <div className="relative grid gap-4 md:grid-cols-[1fr_72px_1fr] md:items-center">
        <AgentNode c={c} index={2} featured />
        <div
          className={`flex flex-col items-center justify-center gap-1 rounded-md border border-dashed px-2 py-3 ${rounds ? "border-warning/50 bg-warning-soft text-warning-foreground" : "border-border bg-muted text-muted-foreground"}`}
        >
          <ArrowLeftRight className="size-6" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">
            {rounds ? "Challenge" : "No challenge"}
          </span>
          <span className="text-[9px]">
            {rounds} of {MAX_CHALLENGE_ROUNDS}
          </span>
        </div>
        <AgentNode c={c} index={3} featured />
      </div>
      <div className="mx-auto max-w-md">
        <div className="flex justify-center py-2 text-primary">
          <ArrowDown className="size-5" />
        </div>
        {rounds > 0 && (
          <div
            className={`mb-2 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${escalated ? "text-danger" : "text-success"}`}
          >
            <CheckCircle2 className="size-4" />
            {escalated ? "Round limit reached · escalated to Compliance" : "Re-evaluation resolved"}
          </div>
        )}
        <AgentNode c={c} index={4} />
        <div className="flex justify-center py-2 text-primary">
          <ArrowDown className="size-5" />
        </div>
        <AgentNode c={c} index={5} />
      </div>
    </div>
  );
}
