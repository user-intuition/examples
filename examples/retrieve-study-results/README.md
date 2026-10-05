# Retrieve study results

[Raw executable source](https://raw.githubusercontent.com/user-intuition/examples/main/examples/retrieve-study-results/index.ts) · [Complete source and execution contract](https://docs.userintuition.ai/api-reference/examples/retrieve-study-results)

Run from the cloned repository root with Node.js 22.18 or later; the source imports shared helpers from `src/`.

```sh
npm run results
npm run results -- --live --study YOUR_STUDY_ID
```

The first command prints a fictional fixture. The second retrieves an existing report with `view=full`; it does not regenerate analysis. See the [release verification](../../docs/release-check.md).

## Report sections, different meanings

- **Study Findings:** the platform's synthesis, with supporting references.
- **Participant Responses:** answers summarized by respondent and research question.
- **Participant Profiles:** sample composition; it does not describe the whole market.
- **Recommended Next Steps:** proposed research, not observed outcomes.
- **Evidence Coverage:** the report's account of which interview evidence supports its synthesis.

Inspect coverage and freshness before reusing findings. Unknown freshness is not fresh. A report with three analyzed interviews is not evidence from every collected response.

## Follow an answer to its source

In the fixture, study findings carry `reference_ids` that resolve through `report.references`. Participant learning-goal summaries do not expose their own reference IDs. Fetch an interview for a reference with an `interview_id`:

```ts
import { referencesForAnswer, routes } from '../../src/contracts.ts';

const references = referencesForAnswer(report, interviewId, finding.reference_ids);
const interview = await client.request('GET', routes.interview(interviewId));
```

Check the exact passage against the original message. The fixture test does this automatically. In live results, citation granularity depends on the released contract and source data. Do not manufacture message IDs or quotations when only an interview-level link is available.

Reference IDs are scoped to their report. Multiple quotations from one person do not represent multiple participants. Generated summaries can be interpreted differently by the calling agent, which should preserve source context when doing so.

## Run source retrieval

Add `--fetch-source` to retrieve the first available supporting source alongside the results:

```sh
npm run results -- --fetch-source
npm run results -- --live --study YOUR_STUDY_ID --fetch-source
```

Fixture mode reads the fictional source locally. Live mode makes one additional read of a referenced interview. It does not regenerate research or launch a study. Inspect the passage and study context before citing.
