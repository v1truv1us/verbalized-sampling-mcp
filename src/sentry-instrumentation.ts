/**
 * Sentry instrumentation for verbalized-sampling-mcp
 *
 * Provides comprehensive monitoring for MCP server operations,
 * VS Code tool execution, and performance metrics
 */

import * as Sentry from '@sentry/node';

// Initialize Sentry before any other imports
Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://37cff06c8b319681ad9861ec632d298a@sentry.fergify.work/18',
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
  release: process.env.SENTRY_RELEASE || 'verbalized-sampling-mcp@1.0.0',

  // Performance monitoring - set to 1.0 for comprehensive monitoring
  tracesSampleRate: 1.0,
  profilesSampleRate: 0, // Disable profiling to avoid native module issues

  integrations: [
    Sentry.httpIntegration(),
    Sentry.nativeNodeFetchIntegration(),
    Sentry.graphqlIntegration(),
    Sentry.mongoIntegration(),
    Sentry.redisIntegration(),
    Sentry.childProcessIntegration(),
    Sentry.consoleIntegration(),
    Sentry.contextLinesIntegration(),
    Sentry.modulesIntegration(),
    Sentry.requestDataIntegration(),
  ],

  // MCP-specific tags for comprehensive monitoring
  initialScope: {
    tags: {
      'mcp.server_name': process.env.MCP_SERVER_NAME || 'verbalized-sampling-mcp',
      'mcp.transport_type': process.env.MCP_TRANSPORT_TYPE || 'stdio',
      'mcp.tool_count': process.env.MCP_TOOL_COUNT || '4',
      'mcp.client_info': process.env.MCP_CLIENT_INFO || 'vscode-extension@1.0.0',
      'vscode.integration': 'true',
      'tool.category': 'sampling',
      'server.type': 'stdio'
    }
  },

  // Error filtering and categorization
  beforeSend(event, hint) {
    const error = hint?.originalException as Error;

    // Categorize MCP-related errors
    if (error?.message?.includes('MCP')) {
      event.tags = { ...event.tags, 'error.category': 'mcp_protocol' };
    } else if (error?.message?.includes('VS Tool')) {
      event.tags = { ...event.tags, 'error.category': 'vs_tool' };
    } else if (error?.message?.includes('transport')) {
      event.tags = { ...event.tags, 'error.category': 'transport' };
    } else if (error?.message?.includes('invalid parameter')) {
      event.tags = { ...event.tags, 'error.category': 'invalid_params' };
    } else if (error?.message?.includes('timeout')) {
      event.tags = { ...event.tags, 'error.category': 'timeout' };
    } else if (error?.message?.includes('connection')) {
      event.tags = { ...event.tags, 'error.category': 'connection' };
    }

    // Add VS Code specific context
    if (error?.message?.includes('verbalized') || error?.message?.includes('sampling')) {
      event.contexts = {
        ...event.contexts,
        vscode: {
          tool_type: 'sampling',
          operation_type: 'verbalized_sampling'
        }
      };
    }

    return event;
  }
});

export class SentryMcpInstrumentation {
  private activeSpans = new Map<string, { span: Sentry.Span; prompt: string }>();

  /**
   * Track MCP server startup and health
   */
  trackServerStartup() {
    console.log('Starting verbalized-sampling-mcp server with Sentry monitoring...');
    // Note: Using callback-based spans for v8 compatibility
  }

  /**
   * Track VSTools initialization
   */
  trackVSToolsInit() {
    return Sentry.startSpan({
      op: 'vs.tools.init',
      name: 'VSTools Initialization'
    }, () => {
      console.log('Initializing VS Code tools with Sentry monitoring...');
    });
  }

  /**
   * Track transport initialization
   */
  trackTransportInit(transportType: string) {
    return Sentry.startSpan({
      op: 'mcp.transport.init',
      name: 'MCP Transport Initialization'
    }, () => {
      // Transport initialization logic
    });
  }

  /**
   * Track individual VS Code tool execution
   */
  trackVSToolExecution(toolName: string, strategy: string, prompt: string) {
    // For v8 compatibility, we'll use breadcrumbs instead of spans
    Sentry.addBreadcrumb({
      message: `VS Tool execution started: ${strategy}`,
      category: 'tool',
      level: 'info',
      data: {
        toolName,
        strategy,
        'mcp.server_name': process.env.MCP_SERVER_NAME || 'verbalized-sampling-mcp'
      }
    });

    this.activeSpans.set(`${toolName}-${strategy}`, { span: {} as any, prompt });
  }

  /**
   * Complete tool execution with metrics
   */
  completeVSToolExecution(
    toolName: string,
    strategy: string,
    result: any,
    executionTime: number,
    error?: Error
  ) {
    const spanData = this.activeSpans.get(`${toolName}-${strategy}`);
    if (spanData) {
      const prompt = spanData.prompt;

      if (error) {
        Sentry.captureException(error, {
          tags: {
            'error.category': 'vs_tool',
            'tool.strategy': strategy,
            'tool.name': toolName
          },
          extra: {
            prompt: prompt.substring(0, 500), // Truncate for privacy
            executionTime,
            result: typeof result === 'object' ? JSON.stringify(result).substring(0, 1000) : String(result)
          }
        });
      } else {
        // Add success breadcrumb
        Sentry.addBreadcrumb({
          message: `VS Tool execution completed: ${strategy}`,
          category: 'tool',
          level: 'info',
          data: {
            toolName,
            strategy,
            executionTime,
            'mcp.server_name': process.env.MCP_SERVER_NAME || 'verbalized-sampling-mcp'
          }
        });
      }

      this.activeSpans.delete(`${toolName}-${strategy}`);
    }
  }

  /**
   * Track MCP protocol operations
   */
  trackMcpOperation(operation: string, details?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message: `MCP Operation: ${operation}`,
      category: 'mcp',
      level: 'info',
      data: {
        ...details,
        'mcp.server_name': process.env.MCP_SERVER_NAME || 'verbalized-sampling-mcp',
        'mcp.transport_type': process.env.MCP_TRANSPORT_TYPE || 'stdio',
        'mcp.client_info': process.env.MCP_CLIENT_INFO || 'vscode-extension@1.0.0'
      }
    });
  }

  /**
   * Track client connections
   */
  trackClientConnection(clientType: string) {
    // Track connection with breadcrumb
    Sentry.addBreadcrumb({
      message: `Client connection established`,
      category: 'connection',
      level: 'info',
      data: {
        'connection.type': clientType,
        'mcp.server_name': process.env.MCP_SERVER_NAME || 'verbalized-sampling-mcp',
        'mcp.transport_type': process.env.MCP_TRANSPORT_TYPE || 'stdio'
      }
    });
  }

  /**
   * Track server health metrics
   */
  trackServerHealth() {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    // Add health breadcrumb with MCP context
    Sentry.addBreadcrumb({
      message: 'Server health check',
      category: 'health',
      level: 'info',
      data: {
        memory: memUsage,
        uptime,
        'mcp.server_name': process.env.MCP_SERVER_NAME || 'verbalized-sampling-mcp',
        'mcp.transport_type': process.env.MCP_TRANSPORT_TYPE || 'stdio',
        'mcp.tool_count': process.env.MCP_TOOL_COUNT || '4',
        'mcp.client_info': process.env.MCP_CLIENT_INFO || 'vscode-extension@1.0.0'
      }
    });
  }

  /**
   * Handle graceful shutdown
   */
  trackShutdown(reason: string) {
    Sentry.captureMessage(`MCP Server shutting down: ${reason}`, 'info');

    // End all active spans
    this.activeSpans.forEach((span, key) => {
      // Spans will be automatically finished
      Sentry.addBreadcrumb({
        message: `Active span ended during shutdown: ${key}`,
        category: 'shutdown',
        level: 'warning'
      });
    });

    this.activeSpans.clear();
  }
}

export const sentryInstrumentation = new SentryMcpInstrumentation();