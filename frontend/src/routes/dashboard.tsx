import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/agentifi/pages";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Underwriting Overview — AgentiFi" },
      {
        name: "description",
        content: "Monitor multi-agent loan applications, risk signals, challenges and decisions.",
      },
      { property: "og:title", content: "Underwriting Overview — AgentiFi" },
      {
        property: "og:description",
        content: "Monitor multi-agent loan applications, risk signals, challenges and decisions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});
