---
name: pbi
description: Create a short, implementation-ready plan after targeted read-only discovery. Do not modify files unless the user approves the plan.
metadata:
  version: 1.0.0
---

# Plan-Before-Implement

> **Invocation:** Use this skill **only when the user explicitly invokes or names `manual-test-use-cases`**.
> Never invoke it automatically based on code changes, testing requests, validation requests, API work, or related context.

## When to Use

Activate this skill when the user wants to plan a change before writing code, asks for a "plan first", or explicitly invokes this skill.

## Rules

- **Working directory is the project root.** All discovery, plans, and edits must happen within the current working directory. Never scan, edit, or create files outside this tree unless the user explicitly directs to a different path.
- **State paths relative to working directory.** In the plan's "Files Likely to Change" and "Validation Commands" sections, use paths relative to the working directory (e.g. `apps/searchtower/app/modes.go`, not `~/code/personal/ui_toolkit_v1/apps/...`).
- Use read-only exploration only.
- Do not edit, create, delete, move, format, or patch files during planning.
- Shell commands are allowed only for discovery and must not mutate project state.
- Discover only relevant project context.
- Stop discovery once enough evidence exists to plan.
- Prefer targeted search over broad repository scanning.
- Separate assumptions into blocking and non-blocking.
- Ask only blocking questions, one at a time.
- For non-blocking ambiguity, recommend the safest default and continue.
- Keep output short.
- **Feature-level AGENTS.md.** When the change targets files under a subdirectory that has its own `AGENTS.md` (e.g. `apps/searchtower/AGENTS.md`), read it during discovery. Its constraints, architecture notes, and patterns refine the project root `AGENTS.md` — they are additive, not replacement. If multiple feature directories each have an `AGENTS.md`, read all of them.

## Step-by-Step Instructions

### 1. Understand the Request

- Parse what the user wants to change or build.
- **Identify the project root.** The working directory (`pwd`) IS the project root. All paths in the plan must be relative to this directory.
- If the user references a feature or file that doesn't exist in this project, stop and ask — don't assume it lives in a sibling directory.

### 2. Targeted Discovery

- Use `bash` for read-only discovery commands (`ls`, `rg`, `find`, `git log`, etc.). Never mutate state.
- Use `read` to inspect relevant files.
- **Check for feature-level `AGENTS.md`.** If the change touches files within a subdirectory that has an `AGENTS.md` (e.g. `apps/searchtower/AGENTS.md`), read it as priority context. Its constraints, patterns, and architecture notes refine the project-level instructions.
- Stop once you have enough context to plan. Do not scan the entire repository.

### 3. Form the Plan

Output a structured plan with these sections:

- **Project Root:** Confirm the working directory explicitly (e.g. "Working directory: `~/code/personal/ui_toolkit_v1`").
- **Discovered Context Summary:** What you found during discovery.
- **Assumptions and Ambiguities:**
  - Blocking: must be resolved before implementing.
  - Non-blocking: safe defaults chosen, proceed.
- **Files Likely to Change:** Files that will be modified. Use paths relative to the working directory.
- **Files Used Only as Reference:** Files read but not changed. Use paths relative to the working directory.
- **Ordered Implementation Steps:** The exact sequence of changes.
- **Success Path Tests:** How to verify the change works.
- **Edge Case / Regression Tests:** What could break, how to guard.
- **Validation Commands:** Exact commands to run after implementing.
- **Risks or Rollback Notes:** What to watch for, how to undo.

### 4. Approval Gate

After presenting the plan, ask the user to choose from these exact options:

1. `approve_plan` — proceed with implementation
2. `request_changes` — revise the plan
3. `ask_questions` — clarify before deciding
4. `cancel` — abort entirely

**Do not implement unless the user explicitly approves the plan.**
