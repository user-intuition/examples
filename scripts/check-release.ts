import { readFile } from "node:fs/promises";
const path = process.argv[2];
if (!path)
  throw new Error(
    "Usage: npm run check:release -- /path/to/released-openapi.json",
  );
const schema = JSON.parse(await readFile(path, "utf8"));
const contract = JSON.parse(
  await readFile(new URL("../release-contract.json", import.meta.url), "utf8"),
);
function resolve(s: any): any {
  if (s?.$ref) {
    return s.$ref
      .split("/")
      .slice(1)
      .reduce((v: any, k: string) => v?.[k], schema);
  }
  return s;
}
let failed = false;
for (const name of ["b2", "c1"]) {
  const c = contract[name],
    op = schema.paths?.[c.path]?.[c.method];
  const response = resolve(
    op?.responses?.["200"]?.content?.["application/json"]?.schema,
  );
  const missing = c.response_fields.filter(
    (key: string) => !response?.properties?.[key],
  );
  console.log(
    JSON.stringify({
      capability: name,
      operationFound: Boolean(op),
      missingFields: missing,
    }),
  );
  if (!op || missing.length) failed = true;
}
console.log(
  "Presence check only: manually verify nested types, request filters, citations, auth, versions, pagination, and live behavior. This command never marks the contract verified.",
);
if (failed) process.exitCode = 1;
