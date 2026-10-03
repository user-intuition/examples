import { Agent, MCPServerStreamableHttp, run } from '@openai/agents';
import { config, instructions } from './config.ts';

const { url, headers, model, prompt } = config();
const server = new MCPServerStreamableHttp({
  url, name: 'userintuition-research',
  requestInit: { headers },
  cacheToolsList: true,
  useStructuredContent: true,
});

try {
  await server.connect();
  const agent = new Agent({
    name: 'Research reader',
    instructions,
    model,
    mcpServers: [server],
  });
  const result = await run(agent, prompt);
  console.log(result.finalOutput);
} finally {
  await server.close();
}
