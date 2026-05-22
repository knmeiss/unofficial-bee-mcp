import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { executeBee } from "../cli.js";
import { BeeCliError } from "../errors.js";

export const todosTools: Tool[] = [
  {
    name: "bee_todos_list",
    description:
      "List action items and tasks that Bee has automatically extracted from the user's conversations, or that were manually created. Use this when the user asks about their tasks, action items, things they need to do, or commitments they made in conversation. Can filter by open (incomplete) or done (completed) status. Returns an array of todo objects with IDs, text, status, due dates, and creation timestamps.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description:
            "Maximum number of todos to return. Omit for default.",
        },
        status: {
          type: "string",
          description:
            "Filter todos by completion status. Use 'open' to see pending tasks, 'done' to see completed ones. Omit to return all.",
          enum: ["open", "done"],
        },
      },
    },
  },
  {
    name: "bee_todos_get",
    description:
      "Retrieve the full details of a single todo item by its ID, including metadata like when it was captured, which conversation it came from, and its current status. Use this after listing todos to get more context on a specific item.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique todo ID, obtained from bee_todos_list or bee_search results.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "bee_todos_create",
    description:
      "Create a new todo or action item in the user's Bee task list. Use this when the user wants to add a task, reminder, or action item that wasn't automatically captured from a conversation. Returns the created todo with its assigned ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        text: {
          type: "string",
          description:
            "The todo content describing the task or action item (e.g., 'Schedule dentist appointment for next week').",
        },
        due: {
          type: "string",
          description:
            "Optional due date in ISO 8601 format (YYYY-MM-DD). Set when the user specifies a deadline.",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "bee_todos_update",
    description:
      "Modify an existing todo — change its text, mark it as complete, or reopen it. Use this when the user wants to mark a task as done, update what it says, or change its status. At least one of text or status must be provided alongside the ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique todo ID to update, obtained from bee_todos_list or bee_search.",
        },
        text: {
          type: "string",
          description: "New text content to replace the existing todo description.",
        },
        status: {
          type: "string",
          description:
            "Set to 'done' to mark the todo as completed, or 'open' to reopen a completed todo.",
          enum: ["open", "done"],
        },
      },
      required: ["id"],
    },
  },
  {
    name: "bee_todos_delete",
    description:
      "Permanently remove a todo from the user's Bee task list. Use this when the user wants to delete a task entirely (not just mark it done). This action cannot be undone.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The unique todo ID to delete, obtained from bee_todos_list or bee_search.",
        },
      },
      required: ["id"],
    },
  },
];

export async function handleTodosTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  try {
    switch (name) {
      case "bee_todos_list": {
        const cliArgs = ["todos", "list"];
        if (args.limit) cliArgs.push("--limit", String(args.limit));
        if (args.status) cliArgs.push("--status", String(args.status));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_todos_get": {
        const data = await executeBee({ args: ["todos", "get", String(args.id)] });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_todos_create": {
        const cliArgs = ["todos", "create", "--text", String(args.text)];
        if (args.due) cliArgs.push("--due", String(args.due));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_todos_update": {
        const cliArgs = ["todos", "update", String(args.id)];
        if (args.text) cliArgs.push("--text", String(args.text));
        if (args.status) cliArgs.push("--status", String(args.status));
        const data = await executeBee({ args: cliArgs });
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      }
      case "bee_todos_delete": {
        const data = await executeBee({ args: ["todos", "delete", String(args.id)] });
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
