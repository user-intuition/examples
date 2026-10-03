import { createMCPClient } from '@ai-sdk/mcp';
import { openai } from '@ai-sdk/openai';
import { generateText, stepCountIs } from 'ai';
import { config, instructions } from './config.ts';
import { structuredResultText } from './structured-output.ts';

const { url, headers, model, prompt } = config();
const client = await createMCPClient({ transport: { type: 'http', url, headers } });

try {
  const discovered = await client.tools();
  const tools = Object.fromEntries(Object.entries(discovered).map(([name, tool]) => {
    const original = tool.toModelOutput;
    return [name, {
      ...tool,
      toModelOutput: (options: Parameters<NonNullable<typeof original>>[0]) => {
        const output = options.output as { isError?: boolean; structuredContent?: unknown };
        const text = output.isError ? undefined : structuredResultText(output.structuredContent);
        return text === undefined
          ? original?.(options) ?? { type: 'text' as const, value: JSON.stringify(output) }
          : { type: 'text' as const, value: text };
      },
    }];
  }));
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
