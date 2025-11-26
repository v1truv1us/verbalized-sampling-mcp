# Sentry Observability Setup for verbalized-sampling-mcp

## Overview

This document outlines the comprehensive Sentry monitoring setup for the verbalized-sampling-mcp server, including configuration, monitoring procedures, and alerting guidelines.

## Sentry Project Configuration

### Project Details
- **Project Name**: verbalized-sampling-mcp
- **Organization**: unfergettable-designs
- **Environment**: development, production
- **DSN**: https://37cff06c8b319681ad9861ec632d298a@sentry.fergify.work/18

### Environment Variables

#### Development (.env.development)
```bash
SENTRY_DSN=https://37cff06c8b319681ad9861ec632d298a@sentry.fergify.work/18
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=verbalized-sampling-mcp@1.0.0-dev
NODE_ENV=development

# MCP Server Configuration
MCP_SERVER_NAME=verbalized-sampling-mcp
MCP_TRANSPORT_TYPE=stdio
MCP_TOOL_COUNT=4
MCP_CLIENT_INFO=vscode-extension@1.0.0
```

#### Production (.env.production)
```bash
SENTRY_DSN=https://37cff06c8b319681ad9861ec632d298a@sentry.fergify.work/18
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=verbalized-sampling-mcp@1.0.0
NODE_ENV=production

# MCP Server Configuration
MCP_SERVER_NAME=verbalized-sampling-mcp
MCP_TRANSPORT_TYPE=stdio
MCP_TOOL_COUNT=4
MCP_CLIENT_INFO=vscode-extension@1.0.0
```

## Monitoring Configuration

### Performance Monitoring
- **Traces Sample Rate**: 1.0 (100% sampling for comprehensive monitoring)
- **Profiles Sample Rate**: 0.1 in production, 1.0 in development
- **Custom Spans**: MCP operations, VS tool executions, transport initialization

### Error Tracking
- **Error Categorization**: MCP protocol errors, VS tool errors, transport errors, invalid parameters
- **Custom Tags**: MCP-specific context including server name, transport type, tool count, client info
- **Breadcrumbs**: Detailed operation logs with MCP context

### Metrics Collection
- **Server Health**: Memory usage, uptime, connection counts
- **Tool Performance**: Execution time, success/failure rates, confidence scores
- **MCP Operations**: Protocol message counts, transport stability

## MCP-Specific Tags

The following tags are automatically added to all Sentry events:

| Tag | Description | Example Value |
|-----|-------------|---------------|
| `mcp.server_name` | Name of the MCP server | `verbalized-sampling-mcp` |
| `mcp.transport_type` | Transport mechanism | `stdio` |
| `mcp.tool_count` | Number of registered tools | `4` |
| `mcp.client_info` | Client application info | `vscode-extension@1.0.0` |
| `tool.category` | Tool category | `sampling` |
| `tool.strategy` | VS sampling strategy | `vs_inject`, `vs_evaluate`, `vs_chain` |
| `error.category` | Error classification | `mcp_protocol`, `vs_tool`, `transport` |

## Custom Spans and Operations

### Server Lifecycle
- `mcp.server.startup`: Server initialization and health checks
- `mcp.transport.init`: Transport layer setup and connection
- `vs.tools.init`: VSTools initialization and registration

### Tool Execution
- `vs.tool.execution`: Individual VS tool execution with strategy context
- Performance metrics: execution time, confidence scores, success rates

### MCP Operations
- `mcp.operations`: Protocol message handling and routing
- Connection tracking: client connections, transport stability

## Alerting Rules

### Recommended Sentry Alerts

#### Critical Alerts
1. **Server Crashes**
   - Query: `error.category:mcp_protocol AND level:fatal`
   - Threshold: Any occurrence
   - Action: Immediate investigation required

2. **High Error Rate**
   - Query: `error.category:vs_tool`
   - Threshold: >5% of tool executions in 5 minutes
   - Action: Review tool implementation

#### Warning Alerts
3. **Slow Tool Execution**
   - Query: `vs.tool.execution_time:>10000`
   - Threshold: >10% of executions
   - Action: Performance optimization needed

4. **Memory Usage Spikes**
   - Query: `mcp.server.memory_used`
   - Threshold: >500MB sustained
   - Action: Memory leak investigation

#### Info Alerts
5. **Server Restarts**
   - Query: `shutdown.reason:sigint OR shutdown.reason:sigterm`
   - Threshold: Any occurrence
   - Action: Log for monitoring

## Monitoring Dashboards

### Key Metrics to Monitor

#### Performance Dashboard
- Average tool execution time by strategy
- Tool success/failure rates
- Memory usage trends
- Server uptime

#### Error Dashboard
- Error rate by category
- Most common error types
- Error trends over time
- MCP protocol errors

#### Usage Dashboard
- Tool usage by type
- Client connection patterns
- Transport stability metrics

## Health Checks

### Automated Health Checks
The server includes automated health monitoring:
- Memory usage tracking every 30 seconds
- Uptime monitoring
- Connection count tracking
- Tool execution metrics

### Manual Health Verification
```bash
# Test Sentry integration
npm run sentry:test

# Check server startup with monitoring
npm run start

# Verify tool execution metrics
# Use MCP Inspector or VS Code to execute tools and check Sentry
```

## Troubleshooting

### Common Issues

#### No Events Appearing in Sentry
1. Verify DSN is correctly set in environment variables
2. Check network connectivity to Sentry
3. Ensure proper environment variable loading

#### Missing MCP Context
1. Verify MCP_* environment variables are set
2. Check that sentry-instrumentation.js is imported first
3. Confirm Sentry initialization completes before server startup

#### Performance Impact
1. Adjust tracesSampleRate if needed (currently 1.0 for full monitoring)
2. Monitor memory usage for profiling impact
3. Consider reducing profiling sample rate in production if needed

### Debug Mode
Enable debug logging:
```bash
DEBUG=sentry:* npm run start
```

## Maintenance Procedures

### Regular Tasks
1. **Weekly**: Review error trends and implement fixes
2. **Monthly**: Update alerting thresholds based on usage patterns
3. **Quarterly**: Review and optimize performance monitoring configuration

### Release Process
1. Update SENTRY_RELEASE version in environment files
2. Deploy with new release tag
3. Monitor for any new error patterns post-release

### Incident Response
1. Check Sentry dashboard for error spikes
2. Review recent deployments and configuration changes
3. Use breadcrumbs and spans for root cause analysis
4. Implement fixes and monitor recovery

## Integration Testing

### Test Scenarios
1. **Normal Operation**: Verify metrics collection during regular tool usage
2. **Error Conditions**: Test error categorization and alerting
3. **Performance**: Monitor execution times under load
4. **Shutdown**: Verify graceful shutdown tracking

### Test Commands
```bash
# Run with test DSN
SENTRY_DSN=https://test-dsn@sentry.io/test npm run start

# Test error scenarios
npm run test

# Performance testing
# Use load testing tools to simulate multiple tool executions
```

## Security Considerations

### Data Privacy
- Prompt content is truncated to 500 characters in error reports
- Sensitive information should not be logged in breadcrumbs
- Review Sentry data scrubbing rules for MCP-specific data

### Access Control
- Limit Sentry project access to authorized team members
- Use appropriate RBAC for alerting and dashboard access
- Regularly audit access logs

## Support

For issues with Sentry monitoring:
1. Check Sentry status page: https://status.sentry.io/
2. Review this documentation
3. Contact the development team with specific error details
4. Include relevant Sentry event IDs when reporting issues