# bee-mcp

> **Disclaimer:** This is an unofficial community project. It is not made by, endorsed by, or affiliated with [Bee](https://bee.computer) in any way. Use at your own discretion.

MCP server that connects Bee AI wearable data to Claude Code.

Wraps the Bee CLI so you can search conversations, manage facts and todos, read journals, and get daily summaries — all from within Claude Code.

## Prerequisites

- Node.js >= 18
- [Bee CLI](https://www.npmjs.com/package/@beeai/cli) installed: `npm install -g @beeai/cli`
- Authenticated: `bee login`

## Quick Start

Add to your Claude Code MCP config (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "bee": {
      "command": "npx",
      "args": ["-y", "bee-mcp"]
    }
  }
}
```

Or if installed globally (`npm install -g bee-mcp`):

```json
{
  "mcpServers": {
    "bee": {
      "command": "bee-mcp"
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `bee_status` | Check auth status and connectivity |
| `bee_me` | Get your Bee profile |
| `bee_today` | Today's summary (facts, todos, conversations) |
| `bee_now` | Current context from recent captures |
| `bee_changed` | Items changed since a cursor |
| `bee_facts_list` | List extracted facts |
| `bee_facts_get` | Get a fact by ID |
| `bee_facts_create` | Create a fact manually |
| `bee_facts_update` | Update a fact |
| `bee_facts_delete` | Delete a fact |
| `bee_todos_list` | List todos |
| `bee_todos_get` | Get a todo by ID |
| `bee_todos_create` | Create a todo |
| `bee_todos_update` | Update a todo |
| `bee_todos_delete` | Delete a todo |
| `bee_conversations_list` | List captured conversations |
| `bee_conversations_get` | Get full conversation transcript |
| `bee_journals_list` | List journal entries |
| `bee_journals_get` | Get a journal entry |
| `bee_daily_list` | List daily summaries |
| `bee_daily_get` | Get a daily summary |
| `bee_search` | Search all data (keyword or neural) |

## Example Usage in Claude Code

> "What did I talk about yesterday?"
> "Search my Bee for anything about the project deadline"
> "Mark my todo about the dentist as done"
> "What facts does Bee know about me?"

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Bee CLI is not installed" | `npm install -g @beeai/cli` |
| "Not authenticated" | `bee login` |
| "Bee API request timed out" | Check your internet connection |

## Development

```bash
git clone <this-repo>
cd bee-mcp
npm install
npm run build
# Test locally:
claude mcp add bee-mcp -- node /path/to/bee-mcp/dist/index.js
```

## License

MIT
