# AgentiFi — Frontend

Staff dashboard and case review for AgentiFi, a multi-agent loan
underwriting system with adversarial fraud/credit challenge-and-arbitration.

## Stack

React 19, TypeScript, TanStack Router/Query, Tailwind v4, shadcn/Radix, recharts.

## Run locally

```
npm install
npm run dev
```

Then open the printed localhost URL. Use `npm run dev`, not `build` +
`preview`, for day-to-day work — the production build targets a Nitro/
Cloudflare server runtime that isn't needed for local development.

## Data

`src/data/mock-data.ts` and `src/services/mock-underwriting-service.ts` hold
mock data shaped to match the backend's shared state schema. Swapping these
for real API calls is the integration point with Person 2's backend.

## Screens

Staff-only app, no login. `/` redirects to `/dashboard`.

| Path                | What it is                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard`        | Overview: metrics, recent applications, agent activity                                                                              |
| `/applications`     | Full list of applications                                                                                                           |
| `/applications/new` | Intake form (the "New application" button in the sidebar)                                                                           |
| `/application/:id`  | One case, with tabs: Overview, Documents, Agents, Explainability, Fraud Intelligence, Challenges, Compliance, Audit Trail, Decision |
| `/audit`            | Audit trail across all cases                                                                                                        |
| `/settings`         | Prototype settings                                                                                                                  |

Per-case views (workflow, fraud, compliance, decision, etc.) are tabs on the
case page rather than separate routes, so the sidebar stays at three items.
