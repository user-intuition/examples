import { readFile } from "node:fs/promises";
import { args, required, assertLaunchApproval } from "../../src/args.ts";
import { ResearchClient, fixture, output } from "../../src/client.ts";
import { routes } from "../../src/contracts.ts";
const options = args();
if (!options.live) {
  output({
    mode: "fictional fixture; no network, invitations, or spend",
    workflow: await fixture("workflow"),
  });
} else {
  const client = new ResearchClient();
  if (options.action === "create") {
    const name = required(options.name, "name");
    if (name.length > 40)
      throw new Error("Study name must be at most 40 characters.");
    output(
      await client.request("POST", routes.studies, {
        name,
        study_type: "in-depth-interview",
        recruiting_method: "panel",
      }),
    );
  } else {
    const id = required(options.study, "study");
    if (options.action === "customize")
      output(
        await client.request("POST", routes.customize(id), {
          message: required(options.message, "message"),
        }),
      );
    else if (options.action === "review")
      output(await client.request("GET", routes.study(id)));
    else if (options.action === "estimate" || options.action === "launch") {
      const request = JSON.parse(
        await readFile(
          required(options["request-file"], "request-file"),
          "utf8",
        ),
      );
      if (options.action === "launch")
        assertLaunchApproval(id, options["approve-launch"]);
      const study = await client.request<{ provisioning_status: string }>(
        "GET",
        routes.study(id),
      );
      if (study.provisioning_status !== "provisioned")
        throw new Error(
          "Study interviewer is not provisioned. Complete and review the saved plan. This is not a fielding-status check.",
        );
      output(
        await client.request("POST", routes.panel(id), {
          ...request,
          dry_run: options.action === "estimate",
        }),
      );
    } else if (options.action === "monitor") {
      output(
        await client.request(
          "GET",
          `${routes.interviews}?study_id=${encodeURIComponent(id)}&status=completed&page=1&page_size=20`,
        ),
      );
    } else if (options.action === "generate-report")
      output(await client.request("POST", routes.report(id)));
    else
      throw new Error(
        "Choose create, customize, review, estimate, launch, monitor, or generate-report.",
      );
  }
}
