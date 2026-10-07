import { createHmac, timingSafeEqual } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";

/** Verify the original request bytes before parsing JSON. Deduplicate verified event IDs separately. */
export function verifyWebhook(body: Uint8Array, timestamp: string, signature: string, secret: string,
  options: { nowSeconds?: number; toleranceSeconds?: number } = {}): boolean {
  const now = options.nowSeconds ?? Date.now() / 1000;
  const tolerance = options.toleranceSeconds ?? 300;
  if (!secret || !Number.isFinite(now) || !Number.isFinite(tolerance) || tolerance < 0
    || !/^\d+$/.test(timestamp) || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  const seconds = Number(timestamp);
  if (!Number.isSafeInteger(seconds) || Math.abs(now - seconds) > tolerance) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest();
  return timingSafeEqual(expected, Buffer.from(signature.slice(7), "hex"));
}

export interface JobStatus { job_id: string; status: "pending" | "running" | "succeeded" | "failed"; error?: string | null }

/** Poll an existing job through a read callback. Never submits or retries a write. */
export async function waitForJob<T extends JobStatus>(jobId: string, read: (id: string, signal: AbortSignal) => Promise<T>,
  options: { timeoutMs?: number; intervalMs?: number; signal?: AbortSignal } = {}): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 120_000, intervalMs = options.intervalMs ?? 1000;
  if (!jobId || !Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(intervalMs) || intervalMs < 0)
    throw new Error("A job ID, positive timeout, and nonnegative interval are required.");
  const signal = options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs);
  while (true) {
    signal.throwIfAborted();
    // Race with cancellation even if the supplied reader ignores its signal.
    const job = await new Promise<T>((resolve, reject) => {
      const abort = () => reject(signal.reason);
      signal.addEventListener("abort", abort, { once: true });
      Promise.resolve().then(() => read(jobId, signal)).then(resolve, reject)
        .finally(() => signal.removeEventListener("abort", abort));
    });
    if (job.job_id !== jobId) throw new Error("Job response belongs to a different job.");
    if (job.status === "succeeded") return job;
    if (job.status === "failed") throw new Error(job.error || "Job failed.");
    if (job.status !== "pending" && job.status !== "running") throw new Error("Unrecognized job status.");
    await sleep(intervalMs, undefined, { signal });
  }
}
