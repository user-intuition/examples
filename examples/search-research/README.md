# Search research

[Raw executable source](https://raw.githubusercontent.com/user-intuition/examples/main/examples/search-research/index.ts) · [Complete source and execution contract](https://docs.userintuition.ai/api-reference/examples/search-research-example)

Run from the cloned repository root with Node.js 22.18 or later; the source imports shared helpers from `src/`.

```sh
npm run search
npm run search -- --live --query "What makes customers hesitate before buying?" --study YOUR_STUDY_ID
```

Fixture mode returns a fixed fictional match; it does not execute your query. Live mode requires one study ID and uses the [verified public search contract](../../docs/release-check.md).

The example searches findings and participant-response summaries. The intended service combines keyword and semantic matching. It retrieves evidence; it does not produce the calling agent's business recommendation.

## Understand the result

Search returns `studies[]`, each with an `index_status`, report IDs, and canonical `results[]`. Read each result's `content_type` and structured `content`; a participant response summary is not a direct quote. An `updating` index may still point to an older indexed report.

The endpoint searches indexed plans and report content, not full transcripts. No match does not prove a topic never appeared in an interview. `generated_content_returned` is always false; use the separate answer endpoint for cited synthesis.

For more context, fetch `routes.reportFull(study.study_id)` or `routes.interview(result.interview_id)` through `ResearchClient`. Preserve the `content_id`, `report_id`, and interview ID when available. Do not combine repeated matches from the same underlying interview into independent supporting participants.

## Pagination

```sh
npm run search -- --live --query "What makes customers hesitate before buying?" --study YOUR_STUDY_ID --cursor NEXT_CURSOR
```

Keep query, filters, and limit unchanged while paging. Follow cursors until `next_cursor` is null; the final page can contain no results. A successful empty nested `results[]` is distinct from an HTTP error. Search never creates a study or starts recruitment.

## Run source retrieval

Add `--fetch-source` to retrieve the first available supporting source alongside the results:

```sh
npm run search -- --fetch-source
npm run search -- --live --study YOUR_STUDY_ID --fetch-source
```

Fixture mode reads the fictional source locally. Live mode makes one additional read: an interview when referenced, or the matching report for a search finding. It does not regenerate research or launch a study. Inspect the passage and study context before citing.
