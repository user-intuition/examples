# Release compatibility check

Verified on 2026-10-05 against the staging API and the published `@userintuition-ai/mcp@0.16.7` tool surface. The production OpenAPI document has the same relevant search and report schemas; authenticated production calls were outside this check.

## API contract

- Compared `https://staging.userintuition.ai/openapi.json` and `https://api.userintuition.ai/openapi.json` for the report and search paths, request and response fields, result variants, and limits. Both matched. Run `npm run check:release -- /path/to/openapi.json` to repeat the structural check.
- `GET /api/public/v1/studies/{study_id}/report?view=full` returns `report-v2` with report sections, `references`, evidence coverage, interview count basis, and freshness. References carry `turn_id` and `message_text` when available. The example reads an existing report; it does not request report generation.
- `POST /api/public/v1/research/search/` requires `filters.study_ids`. Results are grouped in `studies[]`; each canonical result has a `content_id`, `content_type`, structured `content`, and `report_id`. The limit is at most 50. Continue with the opaque `next_cursor` and unchanged query, filters, and limit. `generated_content_returned` is false.
- Fictional fixtures were updated to the same shape. They contain no participant data from staging or production.

## Staging reads

Using an authorized staging test study, the live report example retrieved a structured report with six included sections and 50 references. The live search example retrieved a grouped result and a cursor; the next page had a different result. Both `--fetch-source` paths retrieved supporting source context. These were read-only calls; no panel was launched or reward sent.

The toolkit examples connected to the staging read-only MCP endpoint through OpenAI Agents, LangChain, and the Vercel AI SDK. Each discovered 25 read-only tools. OpenAI Agents and LangChain called `get_study`; the Vercel AI SDK also executed `get_study` successfully. These checks did not invoke a model or measure answer quality.

Local type checking, fixture demos, root tests, toolkit tests, and the OpenAPI checker passed. Search relevance for arbitrary questions, report regeneration behavior, and production permissions remain outside this narrow compatibility check. Recheck the live contract when integrating a newer API version.
