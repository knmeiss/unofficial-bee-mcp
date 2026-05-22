import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { executeBee } from "../cli.js";
import { BeeCliError } from "../errors.js";

export const conversationsTools: Tool[] = [
  {
    name: "bee_conversations_list",
    description:
      "List conversations that Bee has captured from the user's ambient audio. Each conversation represents a distinct interaction — a meeting, phone call, in-person chat, or overheard discussion. Use this when the user asks about recent conversations, wants to find a specific discussion, or asks who they talked to. Returns an array of conversation summaries with IDs, timestamps, duration, and participant information. Use bee_conversations_get with a specific ID to read the full transcript.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description:
            "Maximum number of conversations to return. Omit for default. Most recent conversations are returned first.",
        },
      },
    },
  },
  {
    name: "bee_conversations_get",
    description:
      "Retrieve the complete transcript of a specific conversation, including all individual utterances with speaker labels and timestamps. Use this when the user wants to know exactly what was said in a conversation, who said what, or needs to recall specific details from a discussion. Returns the full conversation object with all utterances in chronological order.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description:
            "The unique conversation ID, obtained from bee_conversations_list or bee_search results.",
        },
      },
      required: ["id"],
    },
  },
];

export async function handleConversationsTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  try {
    switch (name) {
      case "bee_conversations_list": {
        const cliArgs = ["conversations", "list"];
        if (args.limit) cliArgs.push("--limit", String(args.limit));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_conversations_get": {
        const data = await executeBee({
          args: ["conversations", "get", String(args.id)],
        });
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
