---
name: code-review
description: Review code diffs for actionable correctness, security, data integrity, concurrency, reliability, performance, compatibility, and risky-test defects. Use when asked to review a diff, branch, commit range, pull request, patch, or uncommitted code while keeping findings evidence-based and token-efficient.
---

> **Invocation:** Use this skill **only when the user explicitly invokes or names `manual-test-use-cases`**.
> Never invoke it automatically based on code changes, testing requests, validation requests, API work, or related context.

# Token-Efficient Code Review

Review changed behavior and its directly affected execution flow. Report only actionable defects.

## Select the diff

Use this priority:

1. User-provided diff or commit range.
2. Current work since its merge base with the repository's default integration branch.
3. Staged and unstaged changes when no branch comparison exists.
4. Ask only when multiple plausible targets materially change the review.

Detect the default branch from Git metadata. Use `main`, `develop`, `devel`, or `master` only as unambiguous fallbacks. Use the latest local reference; do not fetch unless requested. State the baseline when it is not user-provided.

For a default-branch comparison, find `base=$(git merge-base HEAD <default-branch>)` and inspect `git diff "$base"` so committed and uncommitted current work are included.

## Handle generated files

Identify generated artifacts from repository metadata, generated-code headers, build configuration, or established conventions. Examples include `package-lock.json`, generated Go files, protobuf output, mocks, bundles, and compiled assets.

- Exclude generated contents from context: do not open, read, summarize, or send their diffs to subagents.
- Exclude generated files and lines from file-count and changed-line delegation thresholds.
- Review only generator inputs: source files, schemas, dependency manifests, templates, and generator configuration.
- Treat lockfiles as generated output. Review `package.json`, `go.mod`, or equivalent input instead; inspect a lockfile only when explicitly requested.
- Check only generated-file presence or change status when needed; do not inspect its contents.
- If generated output changed without a corresponding input change, record the gap under `Edge Cases`; do not load the output to investigate.

## Review scope

Report only:

- Correctness defects or regressions
- Security or authorization defects
- Data loss or corruption
- Concurrency or transaction errors
- Resource leaks or missing error handling
- Significant performance problems
- Breaking API or contract changes
- Missing tests for risky changed behavior

Ignore formatting, naming, style, praise, and low-impact improvements. Do not assume unseen requirements or reproduce unchanged code.

Use evidence in this order:

1. Explicit requirements
2. Provided issue or PR description
3. Existing tests and public contracts
4. Directly affected established behavior

If intent remains ambiguous, omit the finding and record the ambiguity under `Edge Cases`.

## Verify impact

For each behavioral change:

1. Find the nearest relevant entry point: route, handler, command, consumer, UI action, or public API.
2. Trace inputs and control flow through the changed function to its observable result.
3. Inspect only affected callers, callees, contracts, validation, errors, side effects, and tests.
4. Inspect every caller whose inputs, outputs, errors, or side effects may change.
5. Stop when the contract is unchanged or the flow reaches a verified entry point.
6. Verify argument, return, state, error, and side-effect compatibility across the path.

Do not audit unrelated flows or require the whole application to run.

Run the smallest relevant existing test when practical and reasonably fast. Never change production code to enable review. Attribute a failure to the change before reporting it. If credentials, services, fixtures, or dependencies block execution, record the gap under `Edge Cases`; blocked execution alone is not a finding.

Report missing tests only for changed authentication, authorization, persistence, deletion, migrations, transactions, concurrency, external contracts, retry/error recovery, or complex branching with credible regression risk.

## Delegate sparingly

Review directly unless both conditions hold:

- The diff exceeds 3 files or 250 changed lines.
- Independent scopes allow delegation without duplicating context.

Specialized security or concurrency analysis may justify delegation at any size. Use at most 3 subagents. Assign each file or hunk to exactly one reviewer; keep coupled producer/consumer changes together. Give only the assigned diff and required local context. The primary reviewer traces cross-component behavior, verifies Critical and High findings, merges duplicates, and ranks the result.

Use this subagent prompt:

```text
Review only this assigned diff and supplied context.
Find Critical, High, or Medium defects. Skip style and speculation.
Every finding needs a concrete trigger and impact. Return at most 4.
Format: severity|location|trigger|impact|smallest safe fix
Return NONE when no issue qualifies.
```

## Finding rules

- Use only supplied or inspected evidence.
- Identify a concrete trigger and observable impact.
- Use `path:line`; otherwise `path:function`.
- Recommend the smallest safe fix.
- Combine findings with the same root cause.
- Omit uncertain findings.
- Return at most 8 findings.
- Verify every Critical and High finding against the code.

Severity:

- **Critical:** Exploit, authorization bypass, data loss, or likely outage.
- **High:** Probable major failure, corruption, or security weakness.
- **Medium:** Credible reliability, performance, compatibility, or edge-case defect.

## Output

```markdown
### Findings

1. **High** `path/file.ts:45` — <trigger and defect>. **Impact:** <observable consequence>. **Fix:** <smallest safe fix>.

### Edge Cases

- <verification gap or material ambiguity; maximum 5, 12 words each>

### Verdict

`NEEDS_WORK` — <maximum 12 words>
```

Always print `### Findings`; use `None.` when no defect qualifies. Print `### Edge Cases` only when nonempty. Always print `### Verdict` and do not repeat findings there.

Verdict mapping:

- `APPROVE`: no findings, including when execution alone is blocked.
- `NEEDS_WORK`: any Medium or High finding.
- `REJECT`: any Critical finding.
