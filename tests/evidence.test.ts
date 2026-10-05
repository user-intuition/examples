import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, ResearchClient } from "../src/client.ts";
import { referencesForAnswer, type Report } from "../src/contracts.ts";
import { assertLaunchApproval, limit } from "../src/args.ts";
test("Every fixture answer resolves to exact text in its own interview", async () => {
  const report = await fixture<Report>("report");
  const interviews =
    await fixture<
      Array<{ id: string; messages: Array<{ id: string; message: string }> }>
    >("interviews");
  const findings = report.study_findings?.learning_goals?.flatMap(
    (goal) => goal.findings ?? [],
  ) ?? [];
  assert.equal(findings.length, 2);
  for (const finding of findings)
    for (const id of finding.reference_ids ?? []) {
      const candidate = report.references.find((ref) => ref.reference_id === id);
      assert.ok(candidate?.interview_id);
      for (const ref of referencesForAnswer(report, candidate.interview_id, [id])) {
        assert.equal(
          interviews
            .find((i) => i.id === ref.interview_id)
            ?.messages.find((m) => m.id === ref.turn_id)?.message,
          ref.message_text,
        );
      }
    }
  assert.throws(() =>
    referencesForAnswer(report, "example-interview-2", ["ref-1"]),
  );
});
test("A missing approval or different study cannot launch", () => {
  assert.throws(() => assertLaunchApproval("study-a", undefined));
  assert.throws(() => assertLaunchApproval("study-a", "study-b"));
  assertLaunchApproval("study-a", "study-a");
});
test("Invalid limits and credential destinations fail locally", () => {
  for (const n of ["0", "NaN", "2.2", "51"]) assert.throws(() => limit(n));
  assert.throws(
    () => new ResearchClient({ base: "http://example.com", key: "test" }),
  );
  assert.throws(
    () =>
      new ResearchClient({ base: "https://example.com/?key=x", key: "test" }),
  );
});
test("HTTP failure is not treated as empty search results, and writes are not retried", async () => {
  const original = globalThis.fetch;
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts++;
    return new Response("{}", { status: 503 });
  };
  try {
    await assert.rejects(
      () =>
        new ResearchClient({ key: "fixture-key" }).request(
          "POST",
          "/api/public/v1/research/search",
          { query: "test" },
        ),
      /HTTP 503/,
    );
    assert.equal(attempts, 1);
  } finally {
    globalThis.fetch = original;
  }
});
test("Interrupted writes report uncertain outcome", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("timeout");
  };
  try {
    await assert.rejects(
      () =>
        new ResearchClient({ key: "fixture-key" }).request(
          "POST",
          "/api/public/v1/studies/",
          {},
        ),
      /outcome may be unknown/,
    );
  } finally {
    globalThis.fetch = original;
  }
});
