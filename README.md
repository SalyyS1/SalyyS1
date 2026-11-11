# SalyyS1 — AI & MCP Infrastructure Engineering

Focused on Model Context Protocol (MCP) tooling, LLM context-window optimization, and Python AI infrastructure.

---

## Featured Open-Source Project: [mcp-slim](https://github.com/SalyyS1/mcp-slim)

**[SalyyS1/mcp-slim](https://github.com/SalyyS1/mcp-slim)** is a zero-dependency stdio middleware proxy for Model Context Protocol (MCP) servers that strips redundant JSON Schema metadata, normalizes verbose tool docstrings, truncates oversized `tools/call` outputs, and redacts leaked credentials before they enter the LLM context window.

- **Average Schema Token Reduction:** `-48.8%` across 6 production MCP tool suites (`2,217` -> `1,135` tokens per turn via `cl100k_base` BPE)
- **Full Proxy Turn Overhead (`MCPProxy`):** `930.6 us` (`0.93 ms`) median p50 latency (`1,059 ops/sec`), `16.4 KiB` peak heap allocation
- **Secret Guard (`SecretGuard`):** `141.2 us` (`0.14 ms`) median p50 latency across 11 credential families (AWS, GitHub, OpenAI, Anthropic, Slack, Google, Stripe, JWT, PEM private keys, DB URLs, Bearer tokens)
- **Runtime Dependencies:** `0` (100% Python 3.10+ standard library)

```bash
pip install git+https://github.com/SalyyS1/mcp-slim.git
mcp-slim wrap -- npx -y @modelcontextprotocol/server-github
```

![Token Reduction Benchmark](https://raw.githubusercontent.com/SalyyS1/mcp-slim/main/assets/benchmark-tokens.svg)

![Latency and Memory Benchmark](https://raw.githubusercontent.com/SalyyS1/mcp-slim/main/assets/benchmark-latency.svg)

---

## Recent Open-Source Contributions (AI & MCP Ecosystem)

- **[datalayer/jupyter-mcp-server#502](https://github.com/datalayer/jupyter-mcp-server/pull/502)** — `feat(cli): autodiscover running local Jupyter server URL and token` via `jupyter_server.serverapp.list_running_servers()`
- **[alpacahq/alpaca-mcp-server#146](https://github.com/alpacahq/alpaca-mcp-server/pull/146)** — `fix(deps): relax fastmcp constraint and support FastMCP 4.x ToolResult import`
- **[datagouv/datagouv-mcp#136](https://github.com/datagouv/datagouv-mcp/pull/136)** — `docs(readme): reorganize Connect your chatbot section by client type`
- **[PrefectHQ/fastmcp#3695](https://github.com/PrefectHQ/fastmcp/pull/3695)** — `fix(cli): handle FileNotFoundError when runtime command is missing in stdio client`
- **[modelcontextprotocol/python-sdk#2375](https://github.com/modelcontextprotocol/python-sdk/pull/2375)** — `fix(client): preserve HTTP status code when raise_for_status fails in StreamableHTTP`
- **[BerriAI/litellm#23751](https://github.com/BerriAI/litellm/pull/23751)** — `fix(proxy): handle None headers in mcp_SemanticToolFilter middleware`
