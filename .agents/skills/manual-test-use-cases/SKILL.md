---
name: manual-test-use-cases
description: Explicit-invocation-only skill for generating a concise manual validation plan from current Git branch changes. Never invoke automatically.
---

---

# Manual Test Use Cases

> **Invocation:** Use this skill **only when the user explicitly invokes or names `manual-test-use-cases`**.
> Never invoke it automatically based on code changes, testing requests, validation requests, API work, or related context.

Generate a **manual** validation plan for behavior introduced or directly changed by the current branch.

## Rules

- **Explicit invocation only.**
- Do not infer invocation from user intent.
- Do not auto-trigger for requests such as:
  - "validate my changes"
  - "create test cases"
  - "review this API"
  - "test this branch"
  - "check my changes"

- Run only when `manual-test-use-cases` is explicitly requested/named.
- Manual validation only.
- Never run or inspect automated tests.
- Do not create test code or validation artifacts.
- Summarize required artifacts only.
- Stay isolated to current branch changes.
- Do not explore unrelated legacy behavior or Git history.
- Never guess URLs, credentials, config, expected values, or behavior.
- Be token-efficient: inspect only what is required to produce executable validation steps.
- Final response after success: **absolute saved plan path only**.

## 1. Resolve Output Directory

Read `INFO_DIR` from the global `CLAUDE.md` using targeted `grep`.

```bash
grep -n 'INFO_DIR' ~/.claude/CLAUDE.md
```

Require:

- exactly one unambiguous value;
- expand `~` / env vars if needed;
- directory exists and is writable.

Fail immediately if unresolved, missing, ambiguous, nonexistent, or unwritable.

Do not infer, ask for, or create `INFO_DIR`.

## 2. Determine Change Scope

Analyze:

```text
merge-base(base, HEAD)..HEAD
+ relevant staged changes
+ relevant unstaged changes
+ relevant untracked source/config files
```

Determine branch, base/default branch, merge-base, HEAD, and dirty state.

Ignore generated/build output, irrelevant lockfile noise, temp/editor files, and unrelated untracked files.

## 3. Determine Project

Use the manifest owning the changed code (`package.json`, `go.mod`, `Cargo.toml`, equivalent).

For materially cross-project changes, combine names:

```text
users-api+payments-api
```

Save to:

```text
<INFO_DIR>/<project>/<sanitized-branch>.md
```

Update an existing plan instead of creating duplicates. Preserve clearly separated human notes.

## 4. Explore Progressively

Prefer targeted discovery:

```bash
git diff --stat
git diff --name-only
git diff -- <file>
rg ...
grep ...
```

Read only:

1. relevant changed hunks;
2. minimum surrounding implementation;
3. minimum path to a manually executable entry point.

Entry points may be HTTP API, CLI, UI action, worker, queue/event consumer, scheduled job, or application workflow.

Stop when each changed behavior has:

```text
entry point
prerequisites
input
expected result
validation evidence
```

## 5. Scope

Generate cases only for:

- new behavior;
- directly changed behavior;
- existing behavior directly affected by that change.

No broad regression analysis or historical exploration.

## 6. API Resolution

Resolve when possible:

- method;
- full URL;
- required headers;
- path/query/body;
- auth/role;
- expected status/body;
- relevant side effects.

Inspect only directly relevant OpenAPI/Swagger/Bruno/Postman definitions when useful.

If unresolved:

```text
<BASE_URL>/path
```

Never assume host or port.

## 7. Prerequisites / Artifacts

Identify minimum required state: users, roles, tokens, records, feature flags, env vars, files, queue state, or config.

Reuse state when safe. Require fresh state for uniqueness, retries, idempotency, limits, permissions, or state transitions.

Do not create artifacts. Summarize them under `Required Artifacts`.

## 8. Cases

Consider meaningful:

- **Normal**
- **Edge**
- **Error**
- **Regression** — only directly caused by the change

Prioritize changed behavior, auth/security, data correctness, changed contracts/validation, boundaries, failures, then direct regressions.

No fixed quota. Deduplicate equivalent cases.

## 9. Test Data

Derive minimal concrete values from validations, types, enums, limits, nullability, and state transitions.

Use placeholders for environment-specific values:

```text
<AUTH_TOKEN>
<USER_ID>
<BASE_URL>
```

## 10. HTTP Requests

Use executable JavaScript `fetch`, never curl/Postman/Bruno syntax.

```js
const response = await fetch("<BASE_URL>/users", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: "Bearer <AUTH_TOKEN>",
  },
  body: JSON.stringify({ name: "Alice" }),
});

const text = await response.text();

let body;
try {
  body = text ? JSON.parse(text) : null;
} catch {
  body = text;
}

console.log({ status: response.status, body });
```

Keep requests minimal.

## 11. Validation Evidence

Prefer API/application output.

Use DB state, logs, queues, files, or worker state only when needed.

For async behavior validate:

1. trigger;
2. immediate result;
3. strongest available completion evidence.

Logs are valid when they prove the relevant result. An "attempted" log is not proof of successful delivery.

## 12. External Integrations

Do not validate third-party systems themselves.

Validate only changed application behavior around the integration.

Put unavailable setup under `Required Artifacts` or `Unresolved Items`.

## 13. Database / Config

Treat relevant migrations/schema/config as prerequisites.

Validate only branch-affected behavior.

Inspect database state only when needed to prove correctness.

Avoid configuration combinatorial testing.

## 14. Shared / Cross-Service Changes

Organize cases by workflow, not files.

Trace only directly affected callers/services.

Do not enumerate theoretical consumers.

## 15. Plan Format

```markdown
# Manual Validation Plan

## Metadata

- Project:
- Branch:
- Base branch:
- Merge-base:
- HEAD:
- Working tree:
- Updated:

## Scope

## Prerequisites

## Required Artifacts

## Manual Test Cases

### N1 — Scenario

**Prerequisites**

...

**Request / Entry Point**

...

**Steps**

1. ...

**Expected Result**

...

**Validation Evidence**

...

## Unresolved Items
```

IDs:

```text
N1    normal
E1    edge
ERR1  error
R1    regression
```

## 16. Existing Plan

If present:

- re-analyze current effective diff;
- preserve valid cases;
- update affected cases;
- remove stale generated cases;
- refresh metadata/artifacts/unresolved items;
- preserve human notes.

Never create timestamped duplicates.

## 17. Uncertainty

Never guess. Put unknowns under `Unresolved Items`.

## 18. Completion

Stop when every material changed behavior has:

```text
entry point
prerequisites
input
manual steps
expected result
validation evidence
```

and meaningful normal, edge, error, and direct regression cases have been considered.

On success output only:

```text
<absolute-plan-path>
```

On failure output only the concise blocking reason.
