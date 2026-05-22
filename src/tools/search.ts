import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { executeBee } from "../cli.js";
import { BeeCliError } from "../errors.js";

export const searchTools: Tool[] = [
  {
    name: "bee_search",
    description:
      "Search across all of the user's Bee data — conversations, facts, todos, and journals — for content matching a query. This is the primary way to find specific information when you don't know which data type contains it. Supports two modes: keyword search (default, BM25 ranking — best for specific names, phrases, or exact terms) and neural/semantic search (best for meaning-based queries like 'conversations about feeling stressed' or 'discussions about project timelines'). Use this when the user asks about a specific topic, person, event, or wants to find something Bee captured. Returns ranked results with snippets, relevance scores, and IDs for retrieving full items.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "The search query. For keyword mode, use specific terms and names. For neural mode, use natural language describing what you're looking for.",
        },
        neural: {
          type: "boolean",
          description:
            "Set to true for semantic/meaning-based search. Default is false (keyword/BM25 search). Use neural when searching by concept or meaning rather than exact words (e.g., 'discussions about being overwhelmed' rather than 'overwhelmed').",
        },
        limit: {
          type: "number",
          description:
            "Maximum number of results to return. Omit for default. Use higher values for broad exploratory searches.",
        },
      },
      required: ["query"],
    },
  },
];

export async function handleSearchTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  try {
    if (name !== "bee_search") {
      return {
        content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    const cliArgs = ["search", "--query", String(args.query)];
    if (args.neural) cliArgs.push("--neural");
    if (args.limit) cliArgs.push("--limit", String(args.limit));

    const data = await executeBee({ args: cliArgs });
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  } catch (error) {
    const message = error instanceof BeeCliError ? error.message : String(error);
    return { content: [{ type: "text" as const, text: message }], isError: true };
  }
}
