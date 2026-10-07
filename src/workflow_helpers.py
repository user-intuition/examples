"""Copyable stdlib helpers for the Fern Python client; no credentials or writes."""
import hashlib
import hmac
import math
import re
import time


def verify_webhook(body: bytes, timestamp: str, signature: str, secret: str, *, now_seconds=None, tolerance_seconds=300):
    """Verify raw request bytes before JSON parsing. Deduplicate event IDs separately."""
    now = time.time() if now_seconds is None else now_seconds
    if not secret or not math.isfinite(now) or not math.isfinite(tolerance_seconds) or tolerance_seconds < 0:
        return False
    if not re.fullmatch(r"[0-9]+", timestamp) or not re.fullmatch(r"sha256=[a-f0-9]{64}", signature):
        return False
    if abs(now - int(timestamp)) > tolerance_seconds:
        return False
    expected = hmac.new(secret.encode(), timestamp.encode() + b"." + body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature[7:])


def wait_for_job(job_id, read, *, timeout_seconds=120, interval_seconds=1):
    """Read an existing job. Reader receives (job_id, remaining_timeout_seconds).

    Reader must apply the supplied timeout to its HTTP request. Read failures
    propagate; no write or automatic failed-request retry is performed.
    """
    if not job_id or not math.isfinite(timeout_seconds) or timeout_seconds <= 0 or not math.isfinite(interval_seconds) or interval_seconds < 0:
        raise ValueError("Job ID, positive timeout, and nonnegative interval required")
    deadline = time.monotonic() + timeout_seconds
    while True:
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise TimeoutError("Job wait timed out")
        job = read(job_id, remaining)
        if time.monotonic() >= deadline:
            raise TimeoutError("Job wait timed out")
        if job.get("job_id") != job_id:
            raise ValueError("Job response belongs to a different job")
        if job.get("status") == "succeeded":
            return job
        if job.get("status") == "failed":
            raise RuntimeError(job.get("error") or "Job failed")
        if job.get("status") not in {"pending", "running"}:
            raise ValueError("Unrecognized job status")
        time.sleep(min(interval_seconds, max(0, deadline - time.monotonic())))
