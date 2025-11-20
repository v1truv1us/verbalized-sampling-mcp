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

```bash
# Clone the repository
git clone https://github.com/ferg-cod3s/verbalized-sampling-mcp.git
cd verbalized-sampling-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Usage

### Basic Workflow

1. **Generate VS Prompt**: Use `vs_create_prompt` to get an optimized prompt
2. **Send to LLM**: Give the prompt to your LLM (via any interface)
3. **Process Response**: Use `vs_process_response` to parse and select the best diverse output

### Example

```javascript
// 1. Get VS prompt for a creative writing task
const prompt = await mcp.callTool("vs_create_prompt", {
  topic: "Write a short story about a robot learning to paint",
  method: "cot", // Chain-of-thought for better reasoning
  model_name: "claude-sonnet-4-5", // Optimized for Claude
});

// 2. Send prompt to your LLM and get response
const llmResponse = await callYourLLM(prompt);

// 3. Process the response to get diverse output
const result = await mcp.callTool("vs_process_response", {
  llm_output: llmResponse,
  tau: 0.08, // Tail sampling threshold
});

console.log(result.selected); // The diverse story output
```

### MCP Integration

Add to your MCP client configuration:

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

## Development

```bash
# Development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run typecheck
```

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
