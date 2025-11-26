# Verbalized Sampling MCP Server

A Model Context Protocol (MCP) server that provides Verbalized Sampling (VS) prompt templates and response processing utilities to mitigate mode collapse in LLM outputs.

## Overview

Verbalized Sampling is a training-free prompting strategy that improves LLM diversity by 2-3x. It works by asking the model to generate multiple responses with their probabilities, then sampling from the tails of the distribution to encourage creative, less common outputs.

This MCP server provides **three core tools** that work together to implement the VS methodology:

1. **`vs_create_prompt`** - Generate optimized VS prompts for any task
2. **`vs_process_response`** - Parse LLM responses and select diverse outputs
3. **`vs_recommend_params`** - Get model-specific VS parameter recommendations

## Features

### Core VS Tools

- **Prompt Generation**: Creates research-backed VS prompts optimized for different models
- **Response Processing**: Parses XML-formatted responses and implements tail sampling
- **Model Optimization**: Provides parameter recommendations for 20+ current LLM models

### Model Support

Supports the latest models from all major providers:

- **Anthropic**: Claude Sonnet 4.5, Haiku 4.5, Opus 4.1
- **OpenAI**: GPT-5.1, GPT-5 mini/nano/pro, GPT-4.1 series, o4-mini
- **Google**: Gemini 2.5 Pro/Flash, Gemini 1.5 Pro
- **Meta/Open Source**: Llama 3.3, DeepSeek R1, Qwen3

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g verbalized-sampling-mcp
```

### Option 2: Install from Source

```bash
# Clone the repository
git clone https://github.com/johnferguson/verbalized-sampling-mcp.git
cd verbalized-sampling-mcp

# Install dependencies
npm install

# Configure environment variables (optional)
cp .env.example .env.development
# Edit .env.development with your Sentry DSN and other settings

# Build the project
npm run build

# Start the server
npm start
```

## Sentry Monitoring

This server includes comprehensive Sentry monitoring for production observability:

### Features
- **Performance Monitoring**: 100% trace sampling for detailed performance insights
- **Error Tracking**: MCP-specific error categorization and context
- **Custom Metrics**: VS tool execution times, success rates, confidence scores
- **Health Monitoring**: Server uptime, memory usage, connection tracking

### Configuration
The server automatically detects environment and configures monitoring accordingly:

- **Development**: Full tracing with local error handling
- **Production**: Optimized performance with comprehensive error tracking

### Environment Variables
```bash
# Required
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=development|production

# MCP-specific tags (automatically added to all events)
MCP_SERVER_NAME=verbalized-sampling-mcp
MCP_TRANSPORT_TYPE=stdio
MCP_TOOL_COUNT=4
MCP_CLIENT_INFO=vscode-extension@1.0.0
```

### Monitoring Dashboard
View real-time metrics and errors at: [Sentry Dashboard](https://sentry.fergify.work)

For detailed monitoring setup and procedures, see [OBSERVABILITY.md](./OBSERVABILITY.md).

## Usage

### Quick Start

```bash
# Install and start
npm install -g verbalized-sampling-mcp
verbalized-sampling-mcp

# In another terminal, test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

### Basic Workflow

1. **Generate VS Prompt**: Use `vs_create_prompt` to get an optimized prompt
2. **Send to LLM**: Give the prompt to your LLM (via any interface)
3. **Process Response**: Use `vs_process_response` to parse and select the best diverse output

### Examples

#### Example 1: Creative Writing with Claude

```javascript
// Generate VS prompt for creative writing
const promptResult = await mcp.callTool("vs_create_prompt", {
  topic: "Write a short story about a robot learning to paint",
  method: "creative_writing", // Optimized for creative tasks
  model_name: "claude-sonnet-4-5"
});

// Send to Claude and get response
const claudeResponse = await callClaude(promptResult.content[0].text);

// Process for diverse selection
const storyResult = await mcp.callTool("vs_process_response", {
  llm_output: claudeResponse,
  tau: 0.08 // Model-specific threshold
});

console.log(storyResult.content[0].text); // Selected diverse story
```

#### Example 2: Technical Documentation with GPT-5

```javascript
// Get model-specific parameters first
const params = await mcp.callTool("vs_recommend_params", {
  model_name: "gpt-5"
});
// Returns: {"k": 10, "tau": 0.05, "temperature": 1.1}

// Generate technical explanation prompt
const promptResult = await mcp.callTool("vs_create_prompt", {
  topic: "Explain quantum computing in simple terms",
  method: "cot", // Chain-of-thought for complex topics
  model_name: "gpt-5"
});

// Process GPT's XML response
const result = await mcp.callTool("vs_process_response", {
  llm_output: gptResponse,
  tau: params.tau // Use research-optimized threshold
});
```

#### Example 3: Dialogue Generation

```javascript
// Generate diverse dialogue responses
const promptResult = await mcp.callTool("vs_create_prompt", {
  topic: "Write a conversation between a human and AI about climate change",
  method: "dialogue", // Specialized for conversation
  model_name: "gemini-2.5-pro"
});

// Get multiple dialogue options
const dialogueResult = await mcp.callTool("vs_process_response", {
  llm_output: geminiResponse,
  tau: 0.12 // Gemini-specific threshold
});
```

#### Example 4: Batch Processing

```javascript
// Process multiple responses efficiently
const responses = [
  "<response><text>Option A</text><probability>0.15</probability></response>",
  "<response><text>Option B</text><probability>0.07</probability></response>",
  "<response><text>Option C</text><probability>0.03</probability></response>"
];

for (const response of responses) {
  const result = await mcp.callTool("vs_process_response", {
    llm_output: response,
    tau: 0.10 // Standard threshold
  });
  console.log(`Selected: ${result.content[0].text}`);
}
```

### MCP Integration

#### Claude Desktop (Recommended)

1. **Install from npm**:
```bash
npm install -g verbalized-sampling-mcp
```

2. **Add to Claude Desktop**:
   - Open Claude Desktop → Settings → Developer → Edit MCP Servers
   - Add new server:
     ```json
     {
       "name": "verbalized-sampling-mcp",
       "command": "verbalized-sampling-mcp",
       "args": []
     }
     ```
   - Restart Claude Desktop

#### Other MCP Clients

```json
{
  "mcpServers": {
    "verbalized-sampling": {
      "command": "node",
      "args": ["/path/to/verbalized-sampling-mcp/dist/index.js"]
    }
  }
}
```

#### Environment Variables (Optional)

```bash
# Sentry monitoring (recommended for production)
export SENTRY_DSN="your-dsn@sentry.io/project-id"
export SENTRY_ENVIRONMENT="production"

# Or create .env file
echo "SENTRY_DSN=your-dsn@sentry.io/project-id" > .env
echo "SENTRY_ENVIRONMENT=production" >> .env
```

## Available Tools

### vs_create_prompt

Generates a Verbalized Sampling prompt optimized for a specific model and task.

**Parameters:**

- `topic` (string, required): The user's query or task
- `method` (string, optional): VS strategy - "standard", "cot", or "multi-turn"
- `model_name` (string, optional): Target model name for parameter optimization

**Returns:** A complete VS prompt string ready to send to an LLM.

### vs_process_response

Parses an LLM's XML response and selects the most diverse option using tail sampling.

**Parameters:**

- `llm_output` (string, required): Raw text output from LLM containing `<response>` tags
- `tau` (number, optional): Probability threshold for tail sampling (default: 0.10)

**Returns:** The selected diverse response with metadata.

### vs_recommend_params

Gets recommended VS parameters for a specific model.

**Parameters:**

- `model_name` (string, required): The model name to look up

**Returns:** JSON object with `k` (sample count), `tau` (threshold), and `temperature` values.

## MCP Server Details

### Server Configuration

The server runs on **stdio transport** and provides these MCP tools:

| Tool | Description | Parameters |
|------|-------------|-----------|
| `vs_create_prompt` | Generate optimized VS prompts | `topic` (required), `method`, `model_name` |
| `vs_process_response` | Parse XML responses and select diverse output | `llm_output` (required), `tau` |
| `vs_recommend_params` | Get model-specific VS parameters | `model_name` (required) |

### VS Methods Available

| Method | Description | Best For |
|--------|-------------|-----------|
| `standard` | Basic VS prompting | General use |
| `cot` | Chain-of-thought reasoning | Complex tasks |
| `multi-turn` | Progressive diversity building | Conversations |
| `research_standard` | Official research format | Research compliance |
| `creative_writing` | Optimized for creativity | Stories, poems |
| `dialogue` | Varied tone/style | Conversations |

### Model Support

Supports 20+ models with optimized parameters:

**Anthropic**: Claude Sonnet 4.5, Haiku 4.5, Opus 4.1
**OpenAI**: GPT-5, GPT-5 mini/nano/pro, GPT-4.1 series, o4-mini  
**Google**: Gemini 2.5 Pro/Flash, Gemini 1.5 Pro
**Meta/Open Source**: Llama 3.3, DeepSeek R1, Qwen3

## Development

```bash
# Development mode
npm run dev

# Run tests
npm test

# Test Sentry integration
npm run sentry:test

# Lint and fix code
npm run lint:fix

# Format code
npm run format

# Type checking
npm run typecheck
```

## Production Deployment

### Environment Setup

```bash
# Production environment
export NODE_ENV=production
export SENTRY_DSN="your-dsn@sentry.io/project-id"
export SENTRY_ENVIRONMENT=production

# Start with monitoring
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

### Monitoring

The server includes comprehensive Sentry monitoring:

- **Performance Metrics**: 100% trace sampling
- **Error Tracking**: MCP-specific error categorization  
- **Custom Metrics**: VS tool execution times, success rates
- **Health Monitoring**: Server uptime, memory usage, connections

View metrics at: [Sentry Dashboard](https://sentry.fergify.work)

### Testing Sentry Integration

```bash
# Test error reporting
npm run sentry:test

# Start server with monitoring
npm run start

# Use MCP Inspector to test tools and verify metrics
npx @modelcontextprotocol/inspector node dist/index.js
```

All tool executions, errors, and performance metrics are automatically sent to Sentry with MCP-specific context.

## Architecture

```
src/
├── tools/
│   ├── vs-tools.ts        # Main MCP tool implementations
│   ├── prompts.ts         # VS prompt templates and formatting
│   ├── sampler.ts         # Response parsing and selection logic
│   └── constants.ts       # Model-specific parameter mappings
└── index.ts               # MCP server setup
```

## Scientific Foundation

This implementation is based on the research paper ["Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity"](https://arxiv.org/abs/2510.01171) by Zhang et al. (2025), which demonstrates that VS increases diversity by 1.6-2.1x while maintaining quality.

The methodology works by:

1. **Prompting for Probabilities**: Asking LLMs to verbalize probability estimates for their own outputs
2. **Tail Sampling**: Selecting responses with low probabilities to encourage diversity
3. **XML Structure**: Using structured output format for reliable parsing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Related

- [Verbalized Sampling Research](https://www.verbalized-sampling.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Research Paper](https://arxiv.org/abs/2510.01171)
