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
