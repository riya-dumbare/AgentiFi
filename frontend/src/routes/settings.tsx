import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/agentifi/pages";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AgentiFi" },
      {
        name: "description",
        content: "Configure display and workflow defaults for the AgentiFi research prototype.",
      },
      { property: "og:title", content: "Settings — AgentiFi" },
      {
        property: "og:description",
        content: "Configure display and workflow defaults for the AgentiFi research prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});
