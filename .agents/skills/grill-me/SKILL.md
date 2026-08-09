---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

> **Invocation:** Use this skill **only when the user explicitly invokes or names `manual-test-use-cases`**.
> Never invoke it automatically based on code changes, testing requests, validation requests, API work, or related context.

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time. For each question, output this exact Markdown structure:

---

**Question [X]:**

**1)** [Top recommended choice]

- _Justification: Why this is the optimal path for the plan._
- _Conflict: When/why it breaks or conflicts with the plan._

**2)** [Alternative choice]

- _Why sub-optimal: The flaws or constraints._
- _Conflict: When/why it breaks or conflicts with the plan._

**3)** [Alternative choice]

- _Why sub-optimal: The flaws or constraints._
- _Conflict: When/why it breaks or conflicts with the plan._
