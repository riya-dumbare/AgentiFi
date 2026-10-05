import { createFileRoute } from "@tanstack/react-router";
import { ApplicationDetailPage } from "@/components/agentifi/application-detail";

export const Route = createFileRoute("/application/$applicationId")({
  head: () => ({
    meta: [
      { title: "Application Review — AgentiFi" },
      {
        name: "description",
        content: "Review a complete application case, agent evidence and final decision.",
      },
      { property: "og:title", content: "Application Review — AgentiFi" },
      {
        property: "og:description",
        content: "Review a complete application case, agent evidence and final decision.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationDetailPage,
});
