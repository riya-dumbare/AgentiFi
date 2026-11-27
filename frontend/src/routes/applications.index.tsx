import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsPage } from "@/components/agentifi/pages";

export const Route = createFileRoute("/applications/")({
  head: () => ({
    meta: [
      { title: "Applications — AgentiFi" },
      {
        name: "description",
        content: "Review applications across the AgentiFi underwriting pipeline.",
      },
      { property: "og:title", content: "Applications — AgentiFi" },
      {
        property: "og:description",
        content: "Review applications across the AgentiFi underwriting pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationsPage,
});
