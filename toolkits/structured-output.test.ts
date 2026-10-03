import assert from 'node:assert/strict';
import { test } from 'node:test';
import { structuredResultText } from './structured-output.ts';

test('makes structured MCP data visible instead of its text pointer', () => {
  const result = { result: { study_id: '0060532c-27eb-4459-baad-c9f4d0bde713' } };
  assert.equal(structuredResultText(result), JSON.stringify(result));
  assert.equal(structuredResultText(undefined), undefined);
});
