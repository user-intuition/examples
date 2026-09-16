# Verify the examples against the B2/C1 release

Status: prepared against agreed example contracts; production verification pending.

The public copy targets the B2/C1 release. This repository makes the remaining technical verification explicit rather than presenting illustrative JSON as an established wire contract.

## Reconcile the contract

1. Obtain the released OpenAPI document and MCP/CLI catalog; record versions and date.
2. Run `npm run check:release -- /path/to/released-openapi.json`. Missing fields or paths produce a nonzero exit. This is a presence check, not full validation.
3. Update `src/contracts.ts` and `release-contract.json`: C1 route/method, request filters, limits/cursor semantics, content types, B2 section names/shapes, reference fields, report version and coverage/freshness metadata.
4. Check which citations are interview-level and which include exact message/passages. Keep unavailable references explicit. Confirm timestamp/date-filter meanings and the actual search index coverage.
5. Adjust fixtures and tests to the released shape. Fixtures must stay fictional and labeled; do not copy production participant data into this public repository.
6. Run type checking, tests, and all fixture demos.

## Narrow live validation

Use an authorized staging account or a designated test study, not a broad authenticated product audit.

- Fetch B2 and verify section content, source links, sample coverage, and stale/unknown semantics.
- Search for a known passage, an exact product name, and a paraphrase; check relevance and source retrieval.
- Check empty results, invalid requests, pagination with unchanged filters, and denied access in an appropriate test setup.
- Confirm report regeneration does not silently resolve an old citation to unrelated new content.
- Verify study creation/customization against a test study without automatically launching recruitment. Paid validation is a separate approved action.

Record actual results and compatibility versions. Mark the contract verified only after schema reconciliation and required live checks. Passing a fixture demo, an HTTP 200, or a schema presence check alone is insufficient.
