import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { executeBee } from "../cli.js";
import { BeeCliError } from "../errors.js";

export const journalsTools: Tool[] = [
  {
    name: "bee_journals_list",
    description:
      "List AI-generated journal entries that Bee creates from the user's conversations. Journals are narrative reflections synthesizing what happened across multiple conversations in a day — themes, decisions, emotional tone, and key moments. Use this when the user asks for a reflective or narrative view of their days, wants to look back on a period of time, or asks about patterns in their life. Returns an array of journal entry summaries with IDs and dates.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description:
            "Maximum number of journal entries to return. Omit for default. Most recent entries returned first.",
        },
      },
    },
  },
  {
    name: "bee_journals_get",
    description:
      "Retrieve the full narrative content of a specific journal entry. Use this after listing journals to read the complete text of one entry. Returns the full journal body — an AI-written reflection on the user's day.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique journal entry ID, obtained from bee_journals_list.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "bee_daily_list",
    description:
      "List structured daily summaries that Bee generates at the end of each day. Unlike journals (which are narrative reflections), daily summaries are structured reports covering all conversations, facts learned, todos created, and key events for a single calendar day. Use this when the user asks what happened on a specific day, wants a factual recap, or needs a day-by-day breakdown. Returns an array of daily summary metadata with IDs and dates.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description:
            "Maximum number of daily summaries to return. Omit for default. Most recent days returned first.",
        },
      },
    },
  },
  {
    name: "bee_daily_get",
    description:
      "Retrieve the full structured summary for a specific day, including all conversations held, facts extracted, todos created, and notable moments. Use this after listing daily summaries to get the complete details for one day. Returns a comprehensive day report.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique daily summary ID, obtained from bee_daily_list.",
        },
      },
      required: ["id"],
    },
  },
];

export async function handleJournalsTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  try {
    switch (name) {
      case "bee_journals_list": {
        const cliArgs = ["journals", "list"];
        if (args.limit) cliArgs.push("--limit", String(args.limit));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_journals_get": {
        const data = await executeBee({
          args: ["journals", "get", String(args.id)],
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_daily_list": {
        const cliArgs = ["daily", "list"];
        if (args.limit) cliArgs.push("--limit", String(args.limit));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_daily_get": {
        const data = await executeBee({
          args: ["daily", "get", String(args.id)],
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
