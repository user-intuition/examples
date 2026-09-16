import { args, required } from "../../src/args.ts";
import {
  ResearchClient,
  fixture,
  output,
  releaseNotice,
} from "../../src/client.ts";
import { routes, sourceReferences, type Report } from "../../src/contracts.ts";
const options = args();
if (options.live) releaseNotice();
const report = options.live
  ? await new ResearchClient().request<Report>(
      "GET",
      routes.report(required(options.study, "study")),
    )
  : await fixture<Report>("report");
output({
  mode: options.live ? "live" : "fictional fixture; no network or spend",
  report,
  source_references: sourceReferences(report),
});
if (report.is_stale === true)
  console.error("This report is stale; retrieval did not regenerate it.");
if (report.is_stale == null) console.error("Report freshness is unknown.");

// Inspect one supporting interview without silently fetching an entire library.
if (options["fetch-source"]) {
  const reference = report.references.find((ref) => ref.interview_id);
  if (!reference?.interview_id) {
    output({
      source_status: "No interview reference is available in this report.",
    });
  } else {
    const interview = options.live
      ? await new ResearchClient().request(
          "GET",
          routes.interview(reference.interview_id),
        )
      : (
          await fixture<Array<{ id: string; messages: unknown[] }>>(
            "interviews",
          )
        ).find((item) => item.id === reference.interview_id);
    if (!interview)
      throw new Error(
        "Referenced interview was not found; do not infer its contents.",
      );
    output({
      reference,
      source_interview: interview,
      instruction:
        "Inspect the original passage. A retrieved interview is not automatic verification of a generated summary.",
    });
  }
}
