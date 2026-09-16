# Search research

```sh
npm run search
npm run search -- --live --query "What makes customers hesitate before buying?"
npm run search -- --live --query "What makes customers hesitate before buying?" --study YOUR_STUDY_ID
```

Fixture mode returns a fixed fictional match; it does not execute your query. Live mode uses the C1 path and fields in `src/contracts.ts`, which require [release verification](../../docs/release-check.md).

The example searches findings and participant-response summaries. The intended service combines keyword and semantic matching. It retrieves evidence; it does not produce the calling agent's business recommendation.

## Understand the result

Read the content type, text kind, study context, freshness, and supporting references. A response summary is not a direct quote. Recommendations should be included only when explicitly requested and remain labeled as proposed research.

The coverage object states what was searched. No report matches do not prove a topic never appeared in a transcript. Do not claim transcript search when `transcripts_searched` is false.

For more context, fetch `routes.report(result.study.id)` or `routes.interview(result.source.interview_id)` through `ResearchClient`. Preserve report/version and message identifiers when available. Do not combine repeated matches from the same underlying interview into independent supporting participants.

## Pagination

```sh
npm run search -- --live --query "What makes customers hesitate before buying?" --cursor NEXT_CURSOR
```

Keep query and filters unchanged while paging. A successful empty `results` array is distinct from an HTTP error; the example throws on errors. The API key determines which research is authorized. Search never creates a study or starts recruitment.

## Run source retrieval

Add `--fetch-source` to retrieve the first available supporting source alongside the results:

```sh
npm run search -- --fetch-source
npm run search -- --live --study YOUR_STUDY_ID --fetch-source
```

Fixture mode reads the fictional source locally. Live mode makes one additional read: an interview when referenced, or the matching report for a search finding. It does not regenerate research or launch a study. Inspect the passage and study context before citing.
