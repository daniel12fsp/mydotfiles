/**
 * OpenRouter Session ID Extension
 *
 * Adds session_id to OpenRouter API requests for conversation continuity
 * and trace data as described in https://openrouter.ai/docs/guides/features/broadcast/overview
 *
 * Usage: Load via -e flag or place in ~/.pi/agent/extensions/
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  let sessionId: string | undefined;

  // Capture sessionId when session starts
  pi.on("session_start", (_event, ctx) => {
    sessionId = ctx.sessionManager.getSessionId();
  });

  // Listen to provider requests and inject session_id for OpenRouter
  pi.on("before_provider_request", (event, ctx) => {
    // Only modify OpenRouter requests with a valid sessionId
    if (!ctx.model?.baseUrl?.includes("openrouter.ai") || !sessionId) {
      return;
    }

    // Add session_id to the request body
    const payload = event.payload as Record<string, unknown>;
    payload.session_id = sessionId;
  });
}
