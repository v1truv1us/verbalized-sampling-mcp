#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const vs_tools_js_1 = require("./tools/vs-tools.js");
class VerbalizedSamplingMcpServer {
    server;
    vsTools;
    constructor() {
        this.vsTools = new vs_tools_js_1.VSTools();
        this.server = new index_js_1.Server({
            name: "verbalized-sampling-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            const tools = this.vsTools.getTools();
            return { tools };
        });
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args = {} } = request.params;
            try {
                return await this.vsTools.handleTool(name, args);
            }
            catch (error) {
                if (error instanceof types_js_1.McpError) {
                    throw error;
                }
                const message = error instanceof Error
                    ? error.message
                    : String(error ?? "Unknown error");
                // Unknown tool errors are treated as InvalidParams to surface clearer feedback
                if (message.startsWith("Unknown VS tool")) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, `Unknown tool: ${message.replace("Unknown VS tool: ", "")}`);
                }
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Tool execution failed: ${message}`);
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
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
//# sourceMappingURL=index.js.map