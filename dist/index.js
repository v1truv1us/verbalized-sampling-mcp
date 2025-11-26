/**
 * Main entry point for verbalized-sampling-mcp with Sentry integration
 *
 * This file initializes Sentry monitoring before any other imports
 * and sets up the MCP server with comprehensive instrumentation
 */
// MUST be first import - Sentry initialization
import './sentry-instrumentation.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { sentryInstrumentation } from './sentry-instrumentation.js';
import { VSTools } from './tools/vs-tools.js';
import { z } from 'zod';
class InstrumentedVerbalizedSamplingMCP {
    server;
    vsTools;
    constructor() {
        // Track server startup
        sentryInstrumentation.trackServerStartup();
        this.vsTools = new VSTools();
        this.server = new McpServer({
            name: 'verbalized-sampling-mcp',
            version: '1.0.0'
        });
        this.setupVSTools();
        this.setupErrorHandling();
        this.setupHealthMonitoring();
    }
    setupVSTools() {
        // Track VSTools initialization
        sentryInstrumentation.trackVSToolsInit();
        // Get the research-aligned tools from VSTools
        const vsTools = this.vsTools.getTools();
        // Register each research-aligned tool
        for (const tool of vsTools) {
            this.server.registerTool(tool.name, {
                title: tool.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: tool.description,
                inputSchema: this.convertToolSchemaToZod(tool.inputSchema),
            }, async (args) => {
                sentryInstrumentation.trackVSToolExecution(tool.name, 'research-aligned', JSON.stringify(args));
                const startTime = Date.now();
                try {
                    const result = await this.vsTools.handleTool(tool.name, args);
                    const executionTime = Date.now() - startTime;
                    sentryInstrumentation.completeVSToolExecution(tool.name, 'research-aligned', result, executionTime);
                    // VSTools returns { content: [...] }, MCP expects content directly
                    return { content: result.content };
                }
                catch (error) {
                    const executionTime = Date.now() - startTime;
                    sentryInstrumentation.completeVSToolExecution(tool.name, 'research-aligned', null, executionTime, error);
                    throw error;
                }
            });
        }
        console.log('✅ Registered research-aligned verbalized sampling tools with Sentry monitoring');
    }
    convertToolSchemaToZod(schema) {
        // Convert MCP tool schema to Zod schema
        if (!schema.properties) {
            return z.object({});
        }
        const zodShape = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
            let zodType;
            switch (prop.type) {
                case 'string':
                    zodType = z.string();
                    if (prop.enum) {
                        zodType = z.enum(prop.enum);
                    }
                    break;
                case 'number':
                    let numType = z.number();
                    if (prop.minimum !== undefined) {
                        numType = numType.min(prop.minimum);
                    }
                    if (prop.maximum !== undefined) {
                        numType = numType.max(prop.maximum);
                    }
                    zodType = numType;
                    break;
                case 'boolean':
                    zodType = z.boolean();
                    break;
                case 'array':
                    zodType = z.array(z.any());
                    break;
                default:
                    zodType = z.any();
            }
            if (schema.required?.includes(key)) {
                zodShape[key] = zodType.describe(prop.description || '');
            }
            else {
                zodShape[key] = zodType.optional().describe(prop.description || '');
            }
        }
        return z.object(zodShape);
    }
    setupErrorHandling() {
        // Global error handlers
        process.on('uncaughtException', (error) => {
            sentryInstrumentation.trackShutdown('uncaught_exception');
            console.error('Uncaught exception:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            sentryInstrumentation.trackShutdown('unhandled_rejection');
            console.error('Unhandled rejection:', reason);
            process.exit(1);
        });
    }
    setupHealthMonitoring() {
        // Periodic health checks
        setInterval(() => {
            sentryInstrumentation.trackServerHealth();
        }, 30000); // Every 30 seconds
        // Track client connections
        sentryInstrumentation.trackClientConnection('stdio');
    }
    async start() {
        try {
            // Track transport initialization
            sentryInstrumentation.trackTransportInit('stdio');
            const transport = new StdioServerTransport();
            // Connect to MCP server with transport
            await this.server.connect(transport);
            console.log('🚀 verbalized-sampling-mcp server started with comprehensive Sentry monitoring');
            console.log('📊 Monitoring: VS Code tools, MCP operations, performance metrics');
            console.log('🔍 DSN:', process.env.SENTRY_DSN || 'Development mode - no DSN set');
        }
        catch (error) {
            console.error('❌ Failed to start server:', error);
            sentryInstrumentation.completeVSToolExecution('server-startup', 'initialization', null, 0, error);
            process.exit(1);
        }
    }
}
// Start the server
async function main() {
    try {
        const server = new InstrumentedVerbalizedSamplingMCP();
        await server.start();
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGINT', () => {
    sentryInstrumentation.trackShutdown('sigint');
    console.log('\n🛑 Shutting down verbalized-sampling-mcp server gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    sentryInstrumentation.trackShutdown('sigterm');
    console.log('\n🛑 Shutting down verbalized-sampling-mcp server gracefully...');
    process.exit(0);
});
main().catch((error) => {
    console.error('💥 Fatal error starting server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map