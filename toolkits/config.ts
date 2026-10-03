export function config(env: NodeJS.ProcessEnv = process.env) {
  const apiKey = env.USERINTUITION_API_KEY;
  const modelKey = env.OPENAI_API_KEY;
  const studyId = env.USERINTUITION_STUDY_ID;
  const url = env.USERINTUITION_MCP_URL || 'https://mcp.userintuition.ai/read-only/mcp';
  if (!apiKey || !modelKey || !studyId) {
    throw new Error('Set USERINTUITION_API_KEY, OPENAI_API_KEY, and USERINTUITION_STUDY_ID in the environment.');
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studyId)) {
    throw new Error('USERINTUITION_STUDY_ID must be a UUID.');
  }
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' ||
      !['mcp.userintuition.ai', 'mcp.sandbox.userintuition.ai'].includes(endpoint.hostname) ||
      endpoint.pathname !== '/read-only/mcp' ||
      endpoint.search || endpoint.hash || endpoint.username || endpoint.password || endpoint.port) {
    throw new Error('USERINTUITION_MCP_URL must be a User Intuition read-only MCP endpoint.');
  }
  return {
    url: endpoint.href,
    headers: { Authorization: `Bearer ${apiKey}` },
    model: env.OPENAI_MODEL || 'gpt-4.1-mini',
    prompt: `For study ${studyId}, read the saved plan and report overview. If a report is available, read its study findings and references. Summarize the main findings with source identifiers that the report actually returns. State when no report or source identifiers are available.`,
  };
}

export const instructions = 'Use User Intuition research tools to answer. Cite source identifiers returned by the tools. Never invent interview evidence or claim a report is ready when it is not.';
