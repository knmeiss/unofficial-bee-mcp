import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { executeBee } from "../cli.js";
import { BeeCliError } from "../errors.js";

export const factsTools: Tool[] = [
  {
    name: "bee_facts_list",
    description:
      "List facts that Bee has automatically extracted from the user's ambient conversations. Facts include personal details, preferences, contact information, project context, opinions, and anything Bee identified as worth remembering. Use this when the user asks what Bee knows about them, a person, a topic, or wants to browse their knowledge base. Returns an array of fact objects with IDs, text content, and timestamps.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description:
            "Maximum number of facts to return. Omit for default. Use a small number (5-10) for quick lookups, larger for comprehensive review.",
        },
      },
    },
  },
  {
    name: "bee_facts_get",
    description:
      "Retrieve the full details of a single fact by its ID, including metadata like when it was captured and from which conversation. Use this after listing facts to get more context on a specific one.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique fact ID, obtained from bee_facts_list or bee_search results.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "bee_facts_create",
    description:
      "Manually create a new fact in the user's Bee knowledge base. Use this when the user wants Bee to remember something specific that wasn't captured from a conversation — for example, a preference, a note, or context they want stored. Returns the created fact with its assigned ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: {
          type: "string",
          description:
            "The fact content to store. Should be a clear, standalone statement (e.g., 'My dentist is Dr. Smith on Oak Street').",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "bee_facts_update",
    description:
      "Update the text content of an existing fact. Use this when the user wants to correct, refine, or add detail to a fact that Bee previously captured. Returns the updated fact.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique fact ID to update, obtained from bee_facts_list or bee_search.",
        },
        text: {
          type: "string",
          description: "The new text content to replace the existing fact content.",
        },
      },
      required: ["id", "text"],
    },
  },
  {
    name: "bee_facts_delete",
    description:
      "Permanently delete a fact from the user's Bee knowledge base. Use this when the user wants to remove incorrect, outdated, or unwanted information. This action cannot be undone.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique fact ID to delete, obtained from bee_facts_list or bee_search.",
        },
      },
      required: ["id"],
    },
  },
];

export async function handleFactsTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  try {
    switch (name) {
      case "bee_facts_list": {
        const cliArgs = ["facts", "list"];
        if (args.limit) cliArgs.push("--limit", String(args.limit));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_facts_get": {
        const data = await executeBee({ args: ["facts", "get", String(args.id)] });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_facts_create": {
        const data = await executeBee({
          args: ["facts", "create", "--text", String(args.text)],
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_facts_update": {
        const data = await executeBee({
          args: ["facts", "update", String(args.id), "--text", String(args.text)],
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_facts_delete": {
        const data = await executeBee({ args: ["facts", "delete", String(args.id)] });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      default:
        return {
          content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof BeeCliError ? error.message : String(error);
    return { content: [{ type: "text" as const, text: message }], isError: true };
  }
}
