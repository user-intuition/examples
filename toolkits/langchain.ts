import { MCPAdapter } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
import { config, instructions } from './config.ts';

const { url, headers, model, prompt } = config();
const adapter = new MCPAdapter({ servers: { userintuition: { url, headers } } });

try {
  const tools = await adapter.listTools();
  const agent = createAgent({
    model: new ChatOpenAI({ model }),
    tools,
    systemPrompt: instructions,
  });
  const result = await agent.invoke({ messages: [{ role: 'user', content: prompt }] });
  console.log(result.messages.at(-1)?.content);
} finally {
  await adapter.close();
}
