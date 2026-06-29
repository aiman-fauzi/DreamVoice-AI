# Task Completion Protocol

After every completed task, the final handoff must include:

1. What changed.
2. Why the change was made.
3. Affected files.
4. Potential risks.
5. Verification that nothing else was broken.
6. The next highest-priority task.

## Work Rules

- Never modify unrelated code.
- Keep changes small and logically grouped.
- Keep commits small and logically grouped when commits are requested or available.
- If verification is not run because the task is documentation-only or otherwise does not affect runtime behavior, say that clearly.
- If verification cannot be run, explain the blocker and the residual risk.