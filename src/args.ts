import { parseArgs } from "node:util";
export function args() {
  return parseArgs({
    options: {
      live: { type: "boolean", default: false },
      "fetch-source": { type: "boolean", default: false },
      action: { type: "string", default: "overview" },
      study: { type: "string" },
      message: { type: "string" },
      name: { type: "string" },
      query: { type: "string" },
      cursor: { type: "string" },
      limit: { type: "string", default: "10" },
      "request-file": { type: "string" },
      "approve-launch": { type: "string" },
    },
    strict: true,
  }).values;
}
export function required(value: string | undefined, flag: string): string {
  if (!value?.trim()) throw new Error(`Provide --${flag}.`);
  return value;
}
export function limit(value: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 50)
    throw new Error("--limit must be an integer from 1 to 50.");
  return n;
}
export function assertLaunchApproval(
  studyId: string,
  approval: string | undefined,
) {
  if (approval !== studyId)
    throw new Error(
      "Paid launch requires --approve-launch with this study ID after reviewing the saved plan and a fresh estimate.",
    );
}
