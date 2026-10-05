import { createFileRoute } from "@tanstack/react-router";
import { AuditPage } from "@/components/agentifi/pages";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail — AgentiFi" },
      {
        name: "description",
        content: "Trace every material agent action, evidence summary and structured output.",
      },
      { property: "og:title", content: "Audit Trail — AgentiFi" },
      {
        property: "og:description",
        content: "Trace every material agent action, evidence summary and structured output.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});
