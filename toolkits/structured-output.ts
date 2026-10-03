// The MCP server puts full results here; its text block is only a pointer.
export function structuredResultText(value: unknown): string | undefined {
  return value === undefined ? undefined : JSON.stringify(value);
}
