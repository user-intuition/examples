import { createMCPClient } from '@ai-sdk/mcp';
import { openai } from '@ai-sdk/openai';
import { generateText, stepCountIs } from 'ai';
import { config, instructions } from './config.ts';

const { url, headers, model, prompt } = config();
const client = await createMCPClient({ transport: { type: 'http', url, headers } });

try {
  const tools = await client.tools();
  const result = await generateText({
    model: openai(model),
    system: instructions,
    prompt,
    tools,
    stopWhen: stepCountIs(6),
  });
  console.log(result.text);
} finally {
  await client.close();
}
