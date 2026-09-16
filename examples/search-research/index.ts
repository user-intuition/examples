import { args, limit } from "../../src/args.ts";
import {
  ResearchClient,
  fixture,
  output,
  releaseNotice,
} from "../../src/client.ts";
import {
  routes,
  type SearchRequest,
  type SearchResponse,
} from "../../src/contracts.ts";
const options = args();
const request: SearchRequest = {
  query:
    options.query ?? "What makes people think the product is too expensive?",
  limit: limit(options.limit),
  cursor: options.cursor ?? null,
  filters: {
    content_types: ["study_finding", "participant_response"],
    ...(options.study ? { study_ids: [options.study] } : {}),
  },
};
if (options.live) releaseNotice();
const response = options.live
  ? await new ResearchClient().request<SearchResponse>(
      "POST",
      routes.search,
      request,
    )
  : await fixture<SearchResponse>("search");
if (!Array.isArray(response.results))
  throw new Error(
    "Unexpected search response: results is not an array. Check the released contract.",
  );
output({
  mode: options.live
    ? "live"
    : "fictional fixture; query is illustrative, not executed",
  request,
  response,
});
// Fetch a source with routes.report(result.study.id) or routes.interview(result.source.interview_id).
// Paginate with the same query/filters and next_cursor. No new study is created by this example.
