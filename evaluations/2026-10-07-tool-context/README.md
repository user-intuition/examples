# Observed tool context — 7 October 2026

This is a controlled local metadata experiment with MCP 0.16.10, Claude Code 2.1.222 and Codex CLI 0.160.1. It is not a report workflow evaluation, a measurement of every host, or a provider-wide token guarantee.

## Claude Code

| Profile | Input tokens including cache | Increase over no MCP | With output schemas removed |
| --- | ---: | ---: | ---: |
| No MCP | 7,959 | — | — |
| Core | 27,544 | 19,585 | 27,544 |
| Full | 34,372 | 26,413 | 34,372 |

Removing output schemas produced **zero input-token savings** in both Claude Code comparisons. The test proxy's tools/list was checked: all 34 core definitions were returned with zero outputSchema fields. This supports the conclusion that output schemas were not contributing to the model context on this tested path. It does not imply the same behavior in Claude's web connector or other hosts.

A single-turn fixed `Reply READY only. Do not call tools.` prompt and matching system prompt were used with empty built-in tools, disabled slash commands, isolated MCP configuration and no settings sources. The selected model remained the client's configured model (the result identifies Claude Opus 5); no model override was supplied. Counts include input, cache-read and cache-creation tokens in the main response usage, excluding separate helper-model calls. Caching changes billing, not the logical size of that input.

## Codex CLI

No MCP, core and full each reported **15,046 initial input tokens** for the same one-turn READY prompt. The configured server was confirmed through `codex mcp list`. A separate metadata-discovery prompt listed 50 model-visible full-profile tools (the App-only approval action is excluded).

The two-turn discovery probe reported 30,880 aggregate input tokens with output schemas and 30,776 after stripping them. The model's intermediary text differed, so the 104-token difference is **not a clean estimate of schema cost**. The no-call probes show no initial-context increase on this tested path; discovery/selected tools can still add context later. Do not interpret aggregate multi-turn usage as one prompt's context window occupancy.

## Limits and recommendation

Cursor was not measurable because its account usage limit prevented an answer. ChatGPT was not measured because this workspace does not expose per-tool model-input attribution for that host. No fabricated values are assigned to either client.

Wire bytes divided by four are not host model-context measurements. In particular, the 46% output-schema wire fraction does not establish a 46% context saving. Preserve typed output contracts and paid-workflow guidance; prefer a smaller profile where appropriate, then measure selected-tool loading before optimizing that host.

Only metadata was needed. The local server used a deliberately invalid placeholder credential, and no backend tool was called. No real API credentials were provided to the MCP probe. Usage-summary.json contains only counters and public client/version metadata; private raw client/session logs are not published.

## Reproduction

Run the same minimal prompt with no MCP, the core profile and the full profile, using isolated client configurations. Record primary-response usage including cache counts for Claude and total input tokens for Codex (its cached count is already a subset). Repeat with a local stdio proxy that removes only `outputSchema` from tools/list responses. Validate that the proxy returned the same tool names and counts. Preserve identical prompts and settings and report any multi-turn variation rather than attributing it to schemas.
