#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { VSTools } from "./tools/vs-tools.js";

class VerbalizedSamplingMcpServer {
  private server: Server;
  private vsTools: VSTools;

  constructor() {
    this.vsTools = new VSTools();

    this.server = new Server(
      {
        name: "verbalized-sampling-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.vsTools.getTools();
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params;

      try {
        return await this.vsTools.handleTool(name, args);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Verbalized Sampling MCP Server running on stdio");
  }
}

// Start the server
const server = new VerbalizedSamplingMcpServer();
server.run().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});