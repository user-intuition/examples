# Conduct a study

[Raw executable source](https://raw.githubusercontent.com/user-intuition/examples/main/examples/conduct-a-study/index.ts) · [Complete source and execution contract](https://docs.userintuition.ai/api-reference/examples/conduct-a-study)

Run from the cloned repository root with Node.js 22.18 or later; the source imports shared helpers from `src/`.

Run `npm run study` from the repository root for a fictional walkthrough without an account or spending. The live example uses an in-depth interview with panel recruitment. Choose the audience and recruitment method with your user; this example is not a default instruction to recruit a panel for every task.

## 1. Create a draft

After setting `USERINTUITION_API_KEY` securely:

```sh
npm run study -- --live --action create --name "Starter pack feedback"
```

Save the returned study ID. Do not run creation again to resume the same study.

## 2. Customize the plan

```sh
npm run study -- --live --action customize --study YOUR_STUDY_ID   --message "We want to understand how US household shoppers evaluate our starter pack. Help us define the audience, screener, and interview guide."
```

The response can be a question, message, or study plan. Relay questions to your user and call `customize` again with their answer. Do not invent missing audience details or claim that one request always produces a launch-ready study.

```sh
npm run study -- --live --action review --study YOUR_STUDY_ID
```

Show the saved audience, guide, screening, language, duration, and recruitment settings. Obtain approval for the current plan. `provisioned` describes interviewer setup; it does not prove fieldwork is running or complete.

## 3. Estimate recruitment

Copy `panel-request.json` to a local file and set the actual target, country, and incidence assumption for the reviewed audience. The included 50% incidence and five-person target are illustrative, not a feasibility assessment. Audiences below 10% incidence require the documented feasibility workflow.

```sh
npm run study -- --live --action estimate --study YOUR_STUDY_ID   --request-file ./my-panel-request.json
```

Review the entire returned estimate, including costs and timing. The example does not extract a guessed cost field or treat an unavailable price as zero. This estimate does not launch recruitment.

## 4. Launch only after approval

```sh
npm run study -- --live --action launch --study YOUR_STUDY_ID   --request-file ./my-panel-request.json --approve-launch YOUR_STUDY_ID
```

**This starts paid recruitment.** Use the same reviewed settings and a fresh estimate. Any change to the plan or recruitment settings requires renewed review. The local flag records an explicit invocation; it is not a durable authorization record, a backend budget cap, or an idempotency guarantee.

If a write times out, read persisted state before trying again. Do not blindly retry a launch: a missing response does not prove the launch failed. The example intentionally does not implement automatic write retries.

## 5. Monitor and retrieve

```sh
npm run study -- --live --action monitor --study YOUR_STUDY_ID
```

This retrieves the first page of completed interviews and the API's count envelope. Completed interviews, quality interviews, and report-eligible interviews are different measures. Paginate before deriving participant distributions; a target count alone is not proof of fieldwork completion.

Once the user wants analysis of the available coverage:

```sh
npm run study -- --live --action generate-report --study YOUR_STUDY_ID
npm run results -- --live --study YOUR_STUDY_ID
```

Report generation is a separate write. Read the latest report after an interrupted generation before retrying. The B2 response adapter requires [release verification](../../docs/release-check.md).

## Your own participants

For BYOP, select `recruiting_method: "byop"` in the create request and follow the documented participant invitation workflow after reviewing the plan. This panel example does not send invitations. Consult the [request examples](https://docs.userintuition.ai/api-reference/request-examples) for exact BYOP bodies and invitation behavior.
