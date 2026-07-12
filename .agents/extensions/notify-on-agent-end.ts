import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const APP_NAME = "Pi";
const FALLBACK_TITLE = "Pi: Agent finished";
const MAX_TITLE_LENGTH = 80;
const MAX_PROMPT_LENGTH = 500;

let lastPrompt: string | undefined;
let startedAt: number | undefined;

export default function (pi: ExtensionAPI) {
	pi.on("before_agent_start", (event) => {
		lastPrompt = event.prompt;
		startedAt = Date.now();
	});

	pi.on("agent_end", async (event, ctx) => {
		const prompt = cleanText(lastPrompt);
		const title = prompt ? `${APP_NAME}: ${truncate(prompt, MAX_TITLE_LENGTH)}` : FALLBACK_TITLE;
		const description = [
			"Agent finished. Ready for input.",
			prompt ? `Prompt: ${truncate(prompt, MAX_PROMPT_LENGTH)}` : undefined,
			`CWD: ${ctx.cwd}`,
			ctx.model ? `Model: ${ctx.model.id}` : undefined,
			startedAt ? `Duration: ${formatDuration(Date.now() - startedAt)}` : undefined,
			`Messages: ${event.messages.length}`,
		]
			.filter(Boolean)
			.join("\n");

		const result = await pi.exec("notify-send", [`--app-name=${APP_NAME}`, title, description]);

		if (result.code !== 0 && ctx.hasUI) {
			ctx.ui.notify("notify-send failed or is not available", "warning");
		}
	});
}

function cleanText(text: string | undefined): string {
	return text?.replace(/\s+/g, " ").trim() ?? "";
}

function truncate(text: string, maxLength: number): string {
	return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.max(0, Math.round(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}
