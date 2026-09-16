import { readFile } from "node:fs/promises";
export async function fixture<T>(name: string): Promise<T> {
  return JSON.parse(
    await readFile(
      new URL(`../fixtures/${name}.json`, import.meta.url),
      "utf8",
    ),
  ) as T;
}
export function output(value: unknown) {
  console.log(JSON.stringify(value, null, 2));
}
export class ResearchClient {
  private base: string;
  private key: string;
  private timeoutMs: number;
  constructor(
    options: { base?: string; key?: string; timeoutMs?: number } = {},
  ) {
    this.base =
      options.base ??
      process.env.USERINTUITION_BASE_URL ??
      "https://api.userintuition.ai";
    const url = new URL(this.base);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error(
        "Base URL must be an HTTPS origin, without credentials, path, query, or fragment.",
      );
    this.key = options.key ?? process.env.USERINTUITION_API_KEY ?? "";
    if (!this.key.trim())
      throw new Error(
        "Set USERINTUITION_API_KEY for --live calls. Fixture mode needs no key.",
      );
    this.timeoutMs = options.timeoutMs ?? 120_000;
  }
  async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown,
  ): Promise<T> {
    if (!path.startsWith("/api/public/v1/"))
      throw new Error("Only public research API paths are allowed.");
    let response: Response;
    try {
      response = await fetch(new URL(path, this.base), {
        method,
        redirect: "error",
        headers: {
          Authorization: `Bearer ${this.key}`,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch {
      throw new Error(
        method === "POST"
          ? "Request interrupted; write outcome may be unknown. Read persisted state before retrying. No automatic retry was attempted."
          : "Read failed or timed out. No result was inferred.",
      );
    }
    if (!response.ok)
      throw new Error(
        `Research API returned HTTP ${response.status}. Inspect the documented error and current state before retrying. No automatic retry was attempted.`,
      );
    try {
      return (await response.json()) as T;
    } catch {
      throw new Error(
        "The API returned invalid JSON; this is not an empty result.",
      );
    }
  }
}
export function releaseNotice() {
  console.error(
    "B2/C1 adapter follows an example contract pending release verification. Check docs/release-check.md before production use.",
  );
}
