# Use the same workflow through MCP and CLI

The [public docs](https://docs.userintuition.ai/mcp-server/overview) are authoritative for client setup and current operation names. This guide avoids hardcoding a tool count.

## MCP

Connect an OAuth-capable client to `https://mcp.userintuition.ai/mcp`. For local stdio:

```json
{
  "mcpServers": {
    "userintuition": {
      "command": "npx",
      "args": ["-y", "@userintuition-ai/mcp"],
      "env": {"USERINTUITION_API_KEY": "ui_sk_your_key_here"}
    }
  }
}
```

Keep real credentials out of source control. Ask the agent to list your studies to verify authorized access. A tool listing alone does not establish that an account-scoped operation succeeds.

Try these workflows after connection:

1. “Help me plan interviews about why customers hesitate before trying our product. Ask for missing audience details. Show the saved plan and recruitment estimate before launching anything.”
2. “Retrieve the report for this study. Show the four sections, coverage, and freshness, then inspect the source interview behind a participant answer.”
3. “Search our existing research for price objections. Return relevant evidence with sources and sample context. Do not create a new study.”

The first workflow uses `create_study`, `customize_study`, and `get_study`, followed by the approved recruitment path. The second uses `get_study_report` and `get_interview`. Discover the released C1 search tool name from the live catalog; this repository does not invent one.

## CLI

```sh
npx -y @userintuition-ai/mcp login
npx -y @userintuition-ai/mcp list
npx -y @userintuition-ai/mcp describe get_study_report
npx -y @userintuition-ai/mcp get_study_report --study_id YOUR_STUDY_ID
npx -y @userintuition-ai/mcp get_interview --interview_id YOUR_INTERVIEW_ID
```

Use the current command schema for exact options. CLI and REST field shapes may differ. Do not assume the newest package has a particular C1 command until it appears in discovery.

Paid panel launch and invitations require the same plan, recruitment, and cost review whichever transport you use. If a command fails or a write response is lost, inspect the output and current state before retrying.
