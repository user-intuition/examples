# User Intuition examples

Add qualitative customer research to an AI agent or product: plan a study, recruit participants, conduct interviews, retrieve source-linked results, and search previous research. Your application owns the broader reasoning and customer experience.

[API documentation](https://docs.userintuition.ai/api-reference/introduction) · [MCP setup](https://docs.userintuition.ai/mcp-server/overview) · [Pricing](https://www.userintuition.ai/pricing/) · [Research infrastructure](https://www.userintuition.ai/platform/research-infrastructure/)

## Run without an account or spending

Requires Node.js 22.18 or later. The examples use native TypeScript support; dependencies are needed only for type checking.

```sh
git clone https://github.com/Pen-and-Paper-AI/userintuition-examples.git
cd userintuition-examples
npm run demo
```

The default is **fictional fixture mode**: no credentials, network calls, invitations, or recruitment. Fixtures demonstrate control flow and data handling; they are not real interviews, measured product performance, or a hosted sandbox.

| Example | What you learn | Command |
| --- | --- | --- |
| [Conduct a study](examples/conduct-a-study/) | Create, customize, review, estimate, launch, monitor, and retrieve | `npm run study` |
| [Retrieve study results](examples/retrieve-study-results/) | Read report sections and follow references to interviews | `npm run results` |
| [Search research](examples/search-research/) | Find relevant evidence, inspect coverage, and retrieve sources | `npm run search` |

## Compatibility

**B2/C1 release verification is pending.** The results and search adapters implement the agreed example shapes; final endpoint names and nested schemas must be reconciled with the release. See [release-contract.json](release-contract.json) and the [verification checklist](docs/release-check.md). Do not infer production compatibility from passing fixture tests.

Existing study routes follow the public OpenAPI in docs commit `555c39fe5195093c5719b0a89f8f47c99887035d`, inspected September 16, 2026. Examples are maintained here; the public API reference remains authoritative. This repository is an example integration, not an official SDK or a guarantee of compatibility with every version.

## Connect a live account

Create an organization-scoped API key in Manage Account → API Keys. Supply it through your shell or secret manager, never browser-side application code or source control.

```sh
# Set USERINTUITION_API_KEY securely in your environment first.
npm run results -- --live --study YOUR_STUDY_ID
```

`--live` is explicit. Read-only examples do not generate reports or start studies. The study example exposes separate commands for writes and requires an additional approval flag for paid panel launch. Follow its guide before running it. Platform interview charges and recruitment costs are separate; use the actual estimate for your audience, country, and study.

## API, MCP, or CLI?

Use REST for direct application code. Use MCP when an agent should discover and call research operations. Use CLI for shell workflows. These examples show one research workflow through different interfaces; do not assume identical argument shapes. See [MCP and CLI walkthrough](docs/mcp-cli.md).

The research workflow returns evidence. Your agent decides whether it answers the question, compares it with other information, and makes recommendations. Keep sample context and cite original sources when reusing findings.

## Development

```sh
npm ci
npm run typecheck
npm test
npm run demo
npm run check:release -- /path/to/released-openapi.json
```

Tests cover reference resolution, explicit launch approval, invalid inputs, and failure handling. The included CI template runs fixtures only. To enable GitHub Actions, a repository maintainer with workflow permission can copy `docs/github-actions.example.yml` to `.github/workflows/check.yml`. CI is not enabled yet. The release check detects missing paths/fields; it does not authenticate or establish live behavior.

## Support and contributions

For product/API support: [support@userintuition.ai](mailto:support@userintuition.ai). For an example defect, open an issue with the example name, Node version, and a sanitized reproduction. Never include API keys, participant identities, private transcripts, or account exports.

Examples are licensed under MIT. The service has its own [terms](https://www.userintuition.ai/terms/).
