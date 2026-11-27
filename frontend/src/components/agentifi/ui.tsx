import {
  AlertTriangle,
  ArrowDown,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface shadow-panel", className)}>
      {children}
    </section>
  );
}
export function SectionHeader({
  title,
  description,
  aside,
}: {
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {aside}
    </div>
  );
}
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  );
}

const tones: Record<string, string> = {
  Completed: "border-success/20 bg-success-soft text-success",
  Processing: "border-primary/20 bg-primary-soft text-primary",
  Waiting: "border-border bg-muted text-muted-foreground",
  Challenged: "border-warning/25 bg-warning-soft text-warning-foreground",
  Resolved: "border-success/20 bg-success-soft text-success",
  Failed: "border-danger/20 bg-danger-soft text-danger",
  Approved: "border-success/20 bg-success-soft text-success",
  Rejected: "border-danger/20 bg-danger-soft text-danger",
  Review: "border-warning/25 bg-warning-soft text-warning-foreground",
  "Manual Review": "border-warning/25 bg-warning-soft text-warning-foreground",
  Low: "border-success/20 bg-success-soft text-success",
  Medium: "border-warning/25 bg-warning-soft text-warning-foreground",
  High: "border-danger/20 bg-danger-soft text-danger",
  Passed: "border-success/20 bg-success-soft text-success",
  Warning: "border-warning/25 bg-warning-soft text-warning-foreground",
  Escalated: "border-danger/20 bg-danger-soft text-danger",
  Contested: "border-warning/25 bg-warning-soft text-warning-foreground",
  Accepted: "border-success/20 bg-success-soft text-success",
  "Partially accepted": "border-warning/25 bg-warning-soft text-warning-foreground",
  Pending: "border-border bg-muted text-muted-foreground",
  Normal: "border-success/20 bg-success-soft text-success",
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        tones[status] ?? tones["Waiting"],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  change,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  change: string;
  tone?: string;
  icon?: ReactNode;
}) {
  return (
    <Surface className="p-5">
      <div className="flex items-start justify-between">
        <Kicker>{label}</Kicker>
        {icon && (
          <span
            className={cn(
              "grid size-8 place-items-center rounded-md",
              tone === "danger"
                ? "bg-danger-soft text-danger"
                : tone === "warning"
                  ? "bg-warning-soft text-warning-foreground"
                  : tone === "success"
                    ? "bg-success-soft text-success"
                    : "bg-primary-soft text-primary",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-4 text-2xl font-semibold tabular-nums">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{change}</p>
    </Surface>
  );
}

export function ScoreGauge({
  score,
  label,
  tone = "primary",
  suffix = "/ 100",
}: {
  score: number;
  label: string;
  tone?: "primary" | "warning" | "danger" | "success";
  suffix?: string;
}) {
  const color =
    tone === "danger"
      ? "var(--danger)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "success"
          ? "var(--success)"
          : "var(--primary)";
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative grid size-24 place-items-center rounded-full"
        style={{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)` }}
      >
        <div className="grid size-[76px] place-items-center rounded-full bg-surface">
          <div className="text-center">
            <span className="block text-2xl font-semibold tabular-nums">{score}</span>
            <span className="text-[10px] text-muted-foreground">{suffix}</span>
          </div>
        </div>
      </div>
      <div>
        <Kicker>{label}</Kicker>
        <p className="mt-1 text-sm font-medium">
          {score >= 65 ? "Elevated signal" : score >= 40 ? "Moderate signal" : "Low signal"}
        </p>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="grid place-items-center px-6 py-12 text-center">
      <div className="grid size-11 place-items-center rounded-md bg-secondary text-muted-foreground">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
export function StateRow({
  state,
  text,
}: {
  state: "loading" | "processing" | "complete" | "warning" | "error";
  text: string;
}) {
  const icons = {
    loading: <LoaderCircle className="animate-spin" />,
    processing: <Clock3 />,
    complete: <CheckCircle2 />,
    warning: <AlertTriangle />,
    error: <XCircle />,
  };
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm">
      <span
        className={cn(
          "[&_svg]:size-4",
          state === "complete"
            ? "text-success"
            : state === "warning"
              ? "text-warning-foreground"
              : state === "error"
                ? "text-danger"
                : "text-primary",
        )}
      >
        {icons[state]}
      </span>
      {text}
    </div>
  );
}
export function FlowArrow() {
  return (
    <div className="flex justify-center py-2 text-primary">
      <ArrowDown className="size-5" />
    </div>
  );
}
export function CheckLine({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "grid size-5 place-items-center rounded-full",
          ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning-foreground",
        )}
      >
        {ok ? <Check className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
      </span>
      {children}
    </div>
  );
}
