# Read-only research tools for agent frameworks

These runnable examples connect three TypeScript agent frameworks to the
User Intuition MCP read-only profile. They retrieve a saved study and report;
they cannot launch recruitment, send invitations, or change study data. Each
example uses the same environment variables and prompt, so you can compare
tool discovery and answer behavior without changing the underlying study.

```sh
cd toolkits
npm ci
export USERINTUITION_API_KEY=...    # organization key with read scope
export OPENAI_API_KEY=...
export USERINTUITION_STUDY_ID=... # owned study UUID
npm run openai
npm run langchain
npm run ai-sdk
```

Set `OPENAI_MODEL` to override the model. Do not commit credentials or run
these examples with participant data you cannot send to the selected model.
Each command makes live API/model requests and may incur model usage costs.
For a staging study, set `USERINTUITION_MCP_URL=https://mcp.sandbox.userintuition.ai/read-only/mcp`
and use a staging API key. The examples reject other hosts and MCP profiles so
the key is only sent to User Intuition's read-only endpoint.

The examples use [OpenAI Agents SDK MCP support](https://openai.github.io/openai-agents-js/guides/mcp/),
[LangChain's MCP adapter](https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-mcp-adapters),
and [Vercel AI SDK MCP tools](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools).
They use MCP directly so each framework can discover the current research
tools. The generated [`@userintuition-ai/sdk`](https://www.npmjs.com/package/@userintuition-ai/sdk)
is available for applications that prefer typed REST calls. The full MCP
endpoint is available for write workflows, but those workflows need their own
human approval gates.

The MCP server returns full tool data in `structuredContent` and a short pointer
in its text content. These examples pass the structured data to each model so
the agent can actually read a study or report.
