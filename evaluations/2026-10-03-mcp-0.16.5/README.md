# Historical client evaluation: MCP 0.16.5

Recorded 3 October 2026 against staging using the published 0.16.5 package. Published 7 October 2026. These results do **not** claim that 0.16.10 has been rerun across all clients.

| Case | Claude Code 2.1.222 | Codex CLI | Cursor Agent |
| --- | --- | --- | --- |
| Tagline prompt with no tagline supplied | Pass: asks for source text, no research call | Pass | Blocked: account usage limit |
| Survey methodology advice | Pass: advice, no research call | Pass | Blocked: account usage limit |
| Translation prompt with no sentence supplied | Pass: asks for source text, no research call | Pass | Blocked: account usage limit |
| Generate, poll and fetch report | Pass | Pass after explicit per-tool authorization | Blocked: account usage limit |
| Paid panel launch | Not recorded in this client matrix | Not recorded | Not recorded |
| BYOP reward send | Not recorded | Not recorded | Not recorded |

## What the passes establish

Eight genuine client recordings cover tool restraint/clarification and report workflow order. Tagline and translation cases assess clarification, not writing quality. Report generation used an existing synthetic staging study; each client generated a job, polled the same job through success, and fetched the report. The initial Codex attempt cancelled report generation before job creation; the successful retry had explicit authorization for that tool.

The normalized public extract preserves tool order, job state and identifier relationships. IDs are anonymized, report prose and operational commands are omitted, and local raw-transcript paths are removed. Raw recordings remain private. This publication contains no API keys, OAuth data, participant contact details or research report content.

## Missing coverage

Cursor stopped before an answer or tool call with `ActionRequiredError: You've hit your usage limit`. A fresh retry on 7 October hit the same limit. That is an account blocker, not a measured product failure, and no pass is assigned. Paid panel/reward recordings are absent; separate smoke checks do not fill those matrix cells. No synthetic voice respondent is included.

The scorer intentionally exits nonzero for missing cells. Missing coverage and duplicate recordings must remain visible; it is not valid to copy an earlier recording into a new release's matrix.

## Reproduce the scoring

With the MCP 0.16.10 source checkout:

```sh
node /path/to/userintuition-mcpserver-ts/evals/score-matrix.mjs recorded-traces.jsonl
```

Expected: four recorded nonpaid passes per Claude/Codex client, missing paid cases, and missing Cursor recordings. Authentication, report content quality, recruitment completion and real voice capture require separate tests.
