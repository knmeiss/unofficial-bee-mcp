import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { executeBee, executeBeeRaw } from "../cli.js";
import { BeeCliError } from "../errors.js";

export const statusTools: Tool[] = [
  {
    name: "bee_status",
    description:
      "Check whether the Bee CLI is installed, authenticated, and able to reach the Bee API. Use this when troubleshooting connectivity issues or verifying setup before calling other Bee tools. Returns authentication state, CLI version, and connection health.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "bee_me",
    description:
      "Retrieve the authenticated user's Bee profile including their name, email, and account details. Use this when you need to identify who the Bee account belongs to or confirm which user's data you're accessing. Returns the user's profile object.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "bee_today",
    description:
      "Get a comprehensive summary of everything Bee captured today — conversations, extracted facts, todos, and key moments. Use this when the user asks what happened today, wants a daily overview, or asks what Bee recorded. Returns a structured summary combining all data types from the current day.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "bee_now",
    description:
      "Get the most recent context from Bee — what was just captured or is currently happening. Use this when the user asks about their current situation, what just happened, or what's going on right now. Returns the latest captures and extracted information from the most recent time window.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "bee_changed",
    description:
      "Get all Bee items (facts, todos, conversations, journals) that have been created or modified since a given cursor position. Use this for polling or syncing — to find out what's new since the last check. Returns changed entities and a new cursor for subsequent calls. If no cursor is provided, returns recent changes.",
    inputSchema: {
      type: "object" as const,
      properties: {
        cursor: {
          type: "string",
          description:
            "Opaque cursor string from a previous bee_changed call. Omit to get all recent changes.",
        },
      },
    },
  },
];

export async function handleStatusTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  try {
    switch (name) {
      case "bee_status": {
        const output = await executeBeeRaw({ args: ["status"] });
        return { content: [{ type: "text" as const, text: output }] };
      }
      case "bee_me": {
        const data = await executeBee({ args: ["me"] });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_today": {
        const data = await executeBee({ args: ["today"] });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_now": {
        const data = await executeBee({ args: ["now"] });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_changed": {
        const cliArgs = ["changed"];
        if (args.cursor) cliArgs.push("--cursor", String(args.cursor));
        const data = await executeBee({ args: cliArgs });
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
