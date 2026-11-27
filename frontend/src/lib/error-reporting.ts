/**
 * Error reporting for AgentiFi's React error boundary (src/routes/__root.tsx).
 *
 * Production React doesn't rethrow boundary-caught errors to window.onerror,
 * so they'd otherwise go unseen. This is the single place to plug in a real
 * error-tracking service (Sentry, LogRocket, etc.) later -- for now it just
 * logs, which is all a student/demo deployment needs.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[AgentiFi] Unhandled error:", message, {
    route: window.location.pathname,
    stack,
    ...context,
  });
}
