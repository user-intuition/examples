import { args, limit, required } from "../../src/args.ts";
import {
  ResearchClient,
  fixture,
  output,
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
    study_ids: [options.live ? required(options.study, "study") : (options.study ?? "example-study")],
    content_types: ["study_finding", "participant_response"],
  },
};
const response = options.live
  ? await new ResearchClient().request<SearchResponse>(
      "POST",
      routes.search,
      request,
    )
  : await fixture<SearchResponse>("search");
if (!Array.isArray(response.studies) ||
    response.studies.some((study) => !Array.isArray(study.results)))
  throw new Error(
    "Unexpected search response: studies or nested results is not an array.",
  );
output({
  mode: options.live
    ? "live"
    : "fictional fixture; query is illustrative, not executed",
  request,
  response,
});
// Fetch a source with routes.reportFull(study.study_id) or routes.interview(result.interview_id).
// Paginate with the same query/filters and next_cursor. No new study is created by this example.

if (options["fetch-source"]) {
  const first = response.studies.flatMap((study) =>
    study.results.map((result) => ({ study, result })),
  )[0];
  if (!first) {
    output({ source_status: "No search matches; no source was fetched." });
  } else {
    const { study, result } = first;
    const interviewId = result.interview_id;
    const source = options.live
      ? await new ResearchClient().request(
          "GET",
          interviewId
            ? routes.interview(interviewId)
            : routes.reportFull(study.study_id),
        )
      : interviewId
        ? (
            await fixture<Array<{ id: string; messages: unknown[] }>>(
              "interviews",
            )
          ).find((item) => item.id === interviewId)
        : await fixture("report");
    if (!source)
      throw new Error(
        "Search source was not found; do not infer its contents.",
      );
    output({
      content_id: result.content_id,
      study_id: study.study_id,
      indexed_report_id: study.indexed_report_id,
      source_kind: interviewId ? "interview" : "report",
      source,
      instruction:
        "Check source context and the indexed report ID before citing. This is one result, not exhaustive coverage.",
    });
  }
}
