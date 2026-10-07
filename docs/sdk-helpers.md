# SDK workflow helpers

Copy the TypeScript `src/workflow-helpers.ts` or Python `src/workflow_helpers.py`
into your server application. They are companion examples outside Fern-generated
code, so regeneration cannot overwrite them. They do not change SDK versions.

## Signed webhooks

Pass the original request bytes, `X-UI-Timestamp`, `X-UI-Signature`, and your webhook
signing secret to `verifyWebhook` / `verify_webhook`. Verify before parsing JSON.
The helper accepts at most five minutes of clock skew, compares HMAC SHA-256 in
constant time, and rejects unsigned requests. Configure a signing secret on the
webhook destination. After verification, deduplicate the envelope's stable `id`
in your database before applying effects. Signature verification alone does not
prevent replay within the allowed clock window.

## Existing jobs

`waitForJob` / `wait_for_job` polls an already created job through a supplied read
callback. Preserve its ID; do not generate a second report or participant batch.
Readers must return the public `job_id`, `status`, and optional `error` fields.
Terminal success returns the record, failure throws, and HTTP errors propagate.
Fetch the actual report or created resource separately after success.

TypeScript readers receive an AbortSignal; pass it to the SDK request's
`abortSignal` option. Python readers receive remaining seconds; pass that timeout
to the SDK request options. Use the generated report-job, participant-job, or
customization-job read method appropriate to the operation. Normalize its typed
response to the public fields instead of assuming all SDK job models are equal.

Run validation with `node --test tests/workflow-helpers.test.ts` and
`python3 -m unittest discover -s tests -p 'test_workflow_helpers.py'`.
