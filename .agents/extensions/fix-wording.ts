/**
 * /fix-wording - Fix natural-language wording in Markdown text or files.
 *
 * Behavior:
 * 1. Accepts raw text or a filename as argument.
 * 2. If the argument is an existing file, reads it. Otherwise treats as raw text.
 * 3. Rejects sensitive file paths.
 * 4. Uses a configured cheap model for the wording fix.
 * 5. Preserves Markdown structure, code, links, frontmatter.
 * 6. Copies fixed output to clipboard and saves to /tmp.
 */

import { complete } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { copyToClipboard, getAgentDir } from "@earendil-works/pi-coding-agent";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_MODEL = "deepseek/deepseek-v4-flash";

const SYSTEM_PROMPT = `Fix the wording while keeping the original meaning.

Make the text sound natural, simple, and human-written. Do not make it sound formal, robotic, or overly polished.

Avoid punctuation that looks like typical LLM writing. Do not use:

* semicolons
* em dashes
* double hyphens
* too many colons
* heavy parentheses
* long sentences joined by complex punctuation

Prefer normal human punctuation:

* periods
* commas
* question marks
* short sentences

Keep the tone close to the original text. Improve grammar, clarity, and flow, but do not rewrite more than necessary.

Rules:
- Preserve the original language.
- Preserve Markdown structure.
- Preserve headings, lists, tables, links, frontmatter, code fences, inline code, and technical identifiers.
- Do not rewrite code.
- Do not change meaning.
- Do not add explanations.
- Output only the corrected Markdown.`;

// Paths that should never be read as input
const BLOCKED_PATTERNS = [
	// exact basename matches
	/^(\.env|id_rsa|id_ed25519)$/,
	// extension-based
	/\.env$/,
	/\.pem$/,
	/\.key$/,
	// basename prefix match for ssh keys
	/^id_rsa/,
	/^id_ed25519/,
];

const BLOCKED_PATH_SEGMENTS = [".git", "node_modules"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSafePath(path: string): boolean {
	const name = basename(path);
	for (const pattern of BLOCKED_PATTERNS) {
		if (pattern.test(name)) return false;
	}
	const segments = path.split("/");
	for (const seg of segments) {
		if (BLOCKED_PATH_SEGMENTS.includes(seg)) return false;
	}
	return true;
}

function sanitizeSource(input: string, isFile: boolean): string {
	if (isFile) {
		return basename(input, extname(input)).replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 40) || "file";
	}
	return input.replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 20) || "text";
}

function readSettings(): Record<string, unknown> {
	try {
		const agentDir = getAgentDir();
		const raw = readFileSync(join(agentDir, "settings.json"), "utf-8");
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------

export default function (pi: ExtensionAPI) {
	pi.registerCommand("fix-wording", {
		description: "Fix natural-language wording in Markdown text or files",
		handler: async (args, ctx) => {
			// ---- 1. Validate input ------------------------------------------------
			const input = args.trim();
			if (!input) {
				pi.sendMessage({
					customType: "fix-wording-error",
					content: "Fix wording failed.\n\nReason: missing input parameter or file path.",
					display: true,
				});
				return;
			}

			// ---- 2. Resolve: file or raw text -------------------------------------
			const resolvedPath = resolve(ctx.cwd, input);
			let content: string;
			let isFile: boolean;

			if (existsSync(resolvedPath)) {
				// ---- 3. Safety gate ------------------------------------------------
				if (!isSafePath(input)) {
					pi.sendMessage({
						customType: "fix-wording-error",
						content: "Fix wording failed.\n\nReason: input file is blocked for safety.",
						display: true,
					});
					return;
				}
				content = readFileSync(resolvedPath, "utf-8");
				isFile = true;
			} else {
				content = input;
				isFile = false;
			}

			// ---- 4. Get model ----------------------------------------------------
			const settings = readSettings();
			const modelSpec = (settings.fixWordingModel as string) || DEFAULT_MODEL;
			const slashIdx = modelSpec.indexOf("/");
			if (slashIdx === -1) {
				pi.sendMessage({
					customType: "fix-wording-error",
					content: `Fix wording failed.\n\nReason: invalid model spec "${modelSpec}" (expected provider/id).`,
					display: true,
				});
				return;
			}
			const provider = modelSpec.slice(0, slashIdx);
			const modelId = modelSpec.slice(slashIdx + 1);
			const model = ctx.modelRegistry.find(provider, modelId);
			if (!model) {
				pi.sendMessage({
					customType: "fix-wording-error",
					content: `Fix wording failed.\n\nReason: model "${modelSpec}" not found.`,
					display: true,
				});
				return;
			}

			// ---- 5. Get auth -----------------------------------------------------
			const auth = await ctx.modelRegistry.getApiKeyAndHeaders(model);
			if (!auth.ok || !auth.apiKey) {
				pi.sendMessage({
					customType: "fix-wording-error",
					content: `Fix wording failed.\n\nReason: no API key for ${provider}.`,
					display: true,
				});
				return;
			}

			// ---- 6. Call model ---------------------------------------------------
			let fixed: string;
			try {
				const messages = [
					{
						role: "user" as const,
						content: [{ type: "text" as const, text: `Input:\n${content}` }],
						timestamp: Date.now(),
					},
				];

				const response = await complete(
					model,
					{ systemPrompt: SYSTEM_PROMPT, messages },
					{
						apiKey: auth.apiKey,
						headers: auth.headers,
					},
				);

				fixed = response.content
					.filter((c): c is { type: "text"; text: string } => c.type === "text")
					.map((c) => c.text)
					.join("\n");
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				pi.sendMessage({
					customType: "fix-wording-error",
					content: `Fix wording failed.\n\nReason: model call failed: ${msg}`,
					display: true,
				});
				return;
			}

			// ---- 7. Save to /tmp -------------------------------------------------
			const source = sanitizeSource(input, isFile);
			const timestamp = Date.now();
			const tmpPath = `/tmp/pi-fix-wording-${source}-${timestamp}.md`;
			writeFileSync(tmpPath, fixed, "utf-8");

			// ---- 8. Copy to clipboard --------------------------------------------
			await copyToClipboard(fixed);

			// ---- 9. Confirmation -------------------------------------------------
			pi.sendMessage({
				customType: "fix-wording",
				content: `Fixed wording copied to clipboard.\n\nModel: ${modelSpec}\nPath: ${tmpPath}`,
				display: true,
			});
		},
	});
}
