---
name: commit
description: Automatically generates a commit message from the git diff, runs local verification/build steps, and commits if successful.
compatibility: linux, macos
metadata:
  version: 1.0.0
---

# Automated Diff Summary & Safe Commit

## When to Use

Activate this skill when the user requests to make a commit, save their progress, or run a "smart commit" where the message should reflect the exact code changes made.

## Workspace Tools Required

- `bash` (to execute Git operations and build commands)
- `read` (to inspect files if necessary)

## Step-by-Step Instructions

Follow this sequence exactly to minimize risk and avoid pushing broken code into the repository history:

### 1. Analyze the Working Tree

- Run `git diff` using the bash tool to check current changes.
- If no staged/unstaged changes appear, run `git status` to see if there are entirely new, untracked files.
- If there are zero changes across the workspace, stop execution and inform the user: _"No changes detected to commit."_

### 2. Craft a Meaningful Commit Message

- Analyze the diff lines to determine exactly what changed.
- Write a clear, precise commit message conforming strictly to the **Conventional Commits** standard:
  - _Structure:_ `<type>(<scope>): <short descriptive summary>`
  - _Allowed Types:_ `feat`, `fix`, `refactor`, `docs`, `chore`, `test`
  - _Example:_ `refactor(ui): update status bar layout configuration`
- Keep the first line short and under 72 characters. Never use low-context messages like "update files".

### 3. Build & Verify Project Health

- Inspect the workspace root to check the project type and identify the correct local verification tool.
  - **Go:** Run `go build` or `go test ./...`
  - **Node/TS:** Run `npm run build`
  - **Rust:** Run `cargo check`
- Execute the identified verification command via the bash tool.
- **CRITICAL SAFETY GUARD:** Check the exit status of the process. If the command fails (exit code is non-zero), **abort immediately**. Do not run `git commit`. Surface the build/test compilation failure logs back to the user so they can fix the regression.

### 4. Stage and Execute Commit

- If and only if the verification command returns an exit code of `0`, complete the workflow:
  ```bash
  git add .
  git commit -m "<your_generated_commit_message>"
  ```
