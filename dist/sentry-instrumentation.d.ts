/**
 * Sentry instrumentation for verbalized-sampling-mcp
 *
 * Provides comprehensive monitoring for MCP server operations,
 * VS Code tool execution, and performance metrics
 */
export declare class SentryMcpInstrumentation {
    private activeSpans;
    /**
     * Track MCP server startup and health
     */
    trackServerStartup(): void;
    /**
     * Track VSTools initialization
     */
    trackVSToolsInit(): void;
    /**
     * Track transport initialization
     */
    trackTransportInit(transportType: string): void;
    /**
     * Track individual VS Code tool execution
     */
    trackVSToolExecution(toolName: string, strategy: string, prompt: string): void;
    /**
     * Complete tool execution with metrics
     */
    completeVSToolExecution(toolName: string, strategy: string, result: any, executionTime: number, error?: Error): void;
    /**
     * Track MCP protocol operations
     */
    trackMcpOperation(operation: string, details?: Record<string, any>): void;
    /**
     * Track client connections
     */
    trackClientConnection(clientType: string): void;
    /**
     * Track server health metrics
     */
    trackServerHealth(): void;
    /**
     * Handle graceful shutdown
     */
    trackShutdown(reason: string): void;
}
export declare const sentryInstrumentation: SentryMcpInstrumentation;
//# sourceMappingURL=sentry-instrumentation.d.ts.map