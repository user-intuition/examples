import assert from 'node:assert/strict';
import { test } from 'node:test';
import { config } from './config.ts';

const validEnv = {
  USERINTUITION_API_KEY: 'ui_sk_fixture',
  OPENAI_API_KEY: 'sk-fixture',
  USERINTUITION_STUDY_ID: '0060532c-27eb-4459-baad-c9f4d0bde713',
};

test('defaults to the production read-only MCP endpoint', () => {
  const result = config(validEnv);
  assert.equal(result.url, 'https://mcp.userintuition.ai/read-only/mcp');
  assert.equal(result.headers.Authorization, 'Bearer ui_sk_fixture');
  assert.match(result.prompt, /source identifiers that the report actually returns/);
});

test('allows the staging read-only MCP endpoint', () => {
  const result = config({
    ...validEnv,
    USERINTUITION_MCP_URL: 'https://mcp.sandbox.userintuition.ai/read-only/mcp',
  });
  assert.equal(result.url, 'https://mcp.sandbox.userintuition.ai/read-only/mcp');
});

test('rejects endpoints that could expose an API key or enable write tools', () => {
  for (const url of [
    'https://mcp.userintuition.ai/mcp',
    'https://mcp.userintuition.ai/core/mcp',
    'https://example.com/read-only/mcp',
    'http://mcp.sandbox.userintuition.ai/read-only/mcp',
    'https://mcp.userintuition.ai/read-only/mcp?redirect=https://example.com',
  ]) {
    assert.throws(() => config({ ...validEnv, USERINTUITION_MCP_URL: url }), /read-only MCP endpoint/, url);
  }
});

test('requires a well-formed study ID', () => {
  assert.throws(() => config({ ...validEnv, USERINTUITION_STUDY_ID: 'not-a-uuid' }), /must be a UUID/);
});
