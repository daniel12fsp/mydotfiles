---
name: code-review
description: Review code changes for actionable defects using minimal context and optional subagents.
---
Code Review Skill

Review the provided diff for actionable defects.

Focus

Report only:

- Correctness or regressions
- Security or authorization
- Data loss or corruption
- Concurrency or transaction errors
- Resource leaks or missing error handling
- Significant performance problems
- Breaking API changes
- Missing tests for risky behavior

Ignore formatting, naming, style, praise, and low-impact improvements.

Workflow

1. Inspect changed files and diff size.
2. Review directly unless delegation reduces duplicated work.
3. Delegate only when:
   - More than 3 files
   - More than 250 changed lines
   - Multiple independent components
   - Specialized security or concurrency analysis is required
4. Assign each file or hunk to exactly one reviewer.
5. Give subagents only their assigned diff and required local context.
6. Merge, verify, deduplicate, and rank findings.
7. Verify all Critical and High findings against the code.

Maximum subagents: "3".

Subagent Prompt

Review only this assigned diff.

Find Critical, High, or Medium defects.
Skip style and speculation.
Use only supplied evidence.
Return at most 4 findings.

Format:
severity|location|trigger|impact|fix

Return NONE when no issue qualifies.

Rules

- Review changed behavior and directly affected code only.
- Do not assume unseen requirements.
- Every finding must identify a concrete trigger and impact.
- Use "path:line"; otherwise "path:function".
- Recommend the smallest safe fix.
- Combine findings with the same root cause.
- Maximum 8 final findings.
- Omit uncertain findings.
- Do not reveal internal reasoning.
- Do not reproduce unchanged code.

Severity

- Critical: Exploit, authorization bypass, data loss, or likely outage.
- High: Probable major failure, corruption, or security weakness.
- Medium: Credible reliability, performance, compatibility, or edge-case defect.

Output

### Findings

1. **High** `path/file.ts:45` — <trigger and failure>. **Impact:** <harm>. **Fix:** <minimal fix>.

None.

Use "None." only when no qualifying findings exist.

### Edge Cases

- <maximum 5 items, 12 words each>

### Verdict

`APPROVE | NEEDS_WORK | REJECT` — <maximum 12 words>

Verdict mapping:

- "APPROVE": no findings
- "NEEDS_WORK": Medium or High finding
- "REJECT": Critical finding

Input

Requirements: <optional>

<paste diff>
