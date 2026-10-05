import { readFile } from "node:fs/promises";

const path = process.argv[2];
if (!path) throw new Error("Usage: npm run check:release -- /path/to/openapi.json");
const schema = JSON.parse(await readFile(path, "utf8"));
const contract = JSON.parse(
  await readFile(new URL("../release-contract.json", import.meta.url), "utf8"),
);
function resolve(value: any): any {
  if (!value?.$ref) return value;
  return value.$ref.split("/").slice(1).reduce((v: any, k: string) => v?.[k], schema);
}
function missingFields(value: any, fields: string[]): string[] {
  const properties = resolve(value)?.properties ?? {};
  return fields.filter((field) => !Object.hasOwn(properties, field));
}
const failures: string[] = [];
for (const name of ["b2", "c1"] as const) {
  const expected = contract[name];
  const operation = schema.paths?.[expected.path]?.[expected.method];
  if (!operation) {
    failures.push(`${name}: operation missing`);
    continue;
  }
  const response = resolve(operation.responses?.["200"]?.content?.["application/json"]?.schema);
  failures.push(...missingFields(response, expected.response_fields).map((field) => `${name}: response.${field}`));
  if (name === "b2") {
    const views = operation.parameters?.find((item: any) => item.name === "view")?.schema?.enum ?? [];
    if (!views.includes(expected.view)) failures.push("b2: full view missing");
    failures.push(...missingFields(schema.components?.schemas?.PublicReportReference, expected.reference_fields)
      .map((field) => `b2: reference.${field}`));
  } else {
    const request = resolve(operation.requestBody?.content?.["application/json"]?.schema);
    failures.push(...missingFields(request, expected.request_fields).map((field) => `c1: request.${field}`));
    const filters = resolve(request?.properties?.filters);
    for (const field of expected.required_filter_fields) {
      if (!filters?.required?.includes(field)) failures.push(`c1: filters.${field} not required`);
    }
    const contentTypes = filters?.properties?.content_types?.anyOf?.[0]?.items?.enum ?? [];
    for (const value of expected.content_types) {
      if (!contentTypes.includes(value)) failures.push(`c1: content type ${value} missing`);
    }
    if (request?.properties?.limit?.maximum !== expected.limit_max) failures.push("c1: limit maximum changed");
    const study = resolve(response?.properties?.studies?.items);
    failures.push(...missingFields(study, expected.study_fields).map((field) => `c1: study.${field}`));
    const resultVariants = study?.properties?.results?.items?.anyOf ?? [];
    if (resultVariants.length !== expected.content_types.length) failures.push("c1: result variants changed");
    for (const variant of resultVariants) {
      const result = resolve(variant);
      failures.push(...missingFields(result, expected.result_fields).map((field) => `c1: result.${field}`));
    }
  }
}
console.log(JSON.stringify({ status: failures.length ? "failed" : "passed", failures }));
if (failures.length) process.exitCode = 1;
