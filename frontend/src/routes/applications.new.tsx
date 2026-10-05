import { createFileRoute } from "@tanstack/react-router";
import { NewApplicationPage } from "@/components/agentifi/pages";

export const Route = createFileRoute("/applications/new")({
  head: () => ({
    meta: [
      { title: "New Application — AgentiFi" },
      {
        name: "description",
        content: "Create a structured loan application for the AgentiFi research prototype.",
      },
      { property: "og:title", content: "New Application — AgentiFi" },
      {
        property: "og:description",
        content: "Create a structured loan application for the AgentiFi research prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewApplicationPage,
});
