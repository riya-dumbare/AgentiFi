import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ApplicationSummary } from "@/data/types";
import { formatINR } from "@/lib/format";
import { StatusBadge } from "./ui";

export function ApplicationTable({
  rows: allRows,
  limit,
}: {
  rows: ApplicationSummary[];
  limit?: number;
}) {
  const rows = limit ? allRows.slice(0, limit) : allRows;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {[
              "Application ID",
              "Applicant",
              "Loan Amount",
              "Credit Risk",
              "Fraud Risk",
              "Decision",
              "Status",
              "Date",
              "",
            ].map((heading) => (
              <th
                key={heading}
                className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-5 py-8 text-center text-sm text-muted-foreground">
                No applications match.
              </td>
            </tr>
          )}
          {rows.map((app) => (
            <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-5 py-4">
                <Link
                  to="/application/$applicationId"
                  params={{ applicationId: app.id }}
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  {app.id}
                </Link>
              </td>
              <td className="px-5 py-4 text-sm font-medium">{app.applicant}</td>
              <td className="px-5 py-4 text-sm tabular-nums">{formatINR(app.amount)}</td>
              <td className="px-5 py-4">
                <StatusBadge status={app.creditRisk} />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={app.fraudRisk} />
              </td>
              <td className="px-5 py-4 text-sm font-medium">{app.decision}</td>
              <td className="px-5 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground">{app.date}</td>
              <td className="px-5 py-4">
                <Link
                  to="/application/$applicationId"
                  params={{ applicationId: app.id }}
                  aria-label={`Open ${app.id}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
