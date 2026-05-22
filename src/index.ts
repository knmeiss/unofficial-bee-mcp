#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { statusTools, handleStatusTool } from "./tools/status.js";
import { factsTools, handleFactsTool } from "./tools/facts.js";
import { todosTools, handleTodosTool } from "./tools/todos.js";
import {
  conversationsTools,
  handleConversationsTool,
} from "./tools/conversations.js";
import { journalsTools, handleJournalsTool } from "./tools/journals.js";
import { searchTools, handleSearchTool } from "./tools/search.js";

const server = new Server(
  { name: "bee-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const allTools = [
  ...statusTools,
  ...factsTools,
  ...todosTools,
  ...conversationsTools,
  ...journalsTools,
  ...searchTools,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const toolArgs = (args ?? {}) as Record<string, unknown>;

  if (name.startsWith("bee_facts_")) return handleFactsTool(name, toolArgs);
  if (name.startsWith("bee_todos_")) return handleTodosTool(name, toolArgs);
  if (name.startsWith("bee_conversations_"))
    return handleConversationsTool(name, toolArgs);
  if (name.startsWith("bee_journals_") || name.startsWith("bee_daily_"))
    return handleJournalsTool(name, toolArgs);
  if (name === "bee_search") return handleSearchTool(name, toolArgs);

  return handleStatusTool(name, toolArgs);
});

const transport = new StdioServerTransport();
await server.connect(transport);
