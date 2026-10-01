export function config() {
  const apiKey = process.env.USERINTUITION_API_KEY;
  const modelKey = process.env.OPENAI_API_KEY;
  const studyId = process.env.USERINTUITION_STUDY_ID;
  if (!apiKey || !modelKey || !studyId) {
    throw new Error('Set USERINTUITION_API_KEY, OPENAI_API_KEY, and USERINTUITION_STUDY_ID in the environment.');
  }
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(studyId)) {
    throw new Error('USERINTUITION_STUDY_ID must be a UUID.');
  }
  return {
    url: 'https://mcp.userintuition.ai/read-only/mcp',
    headers: { Authorization: `Bearer ${apiKey}` },
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    prompt: `For study ${studyId}, read the saved plan and report overview. Summarize the main findings with source identifiers. State when no report is available.`,
  };
}

export const instructions = 'Use User Intuition research tools to answer. Cite source identifiers returned by the tools. Never invent interview evidence or claim a report is ready when it is not.';
