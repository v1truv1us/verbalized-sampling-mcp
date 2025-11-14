# Verbalized Sampling MCP Server

An MCP server that injects Verbalized Sampling (VS) prompts into subagent calls, command executions, and skill usage to ensure proper communication and alignment between all components of AI systems.

## Overview

Verbalized Sampling is a prompting methodology that ensures AI agents explicitly communicate their intent, provide clear context, specify parameters, and request confirmation before executing operations with subagents, commands, or skills.

This MCP server provides tools to automatically inject VS prompts into these interactions, ensuring consistent and proper communication patterns across your AI ecosystem.

## Features

### VS Injection Tools (3 tools)
- **Subagent Injection**: Inject VS prompts into subagent calls
- **Command Injection**: Inject VS prompts into command executions
- **Skill Injection**: Inject VS prompts into skill usage

### VS Evaluation Tools (3 tools)
- **Response Evaluation**: Evaluate responses using VS criteria
- **Best Response Selection**: Select optimal responses from multiple options
- **Methodology Validation**: Validate VS methodology compliance

### VS Generation Tools (2 tools)
- **Sample Generation**: Generate multiple response samples for comparison
- **Chain Evaluation**: Complete VS workflow (inject → generate → evaluate → select)

### Configuration Tools (2 tools)
- **Prompt Configuration**: Customize the default VS prompt
- **Prompt Retrieval**: Get the current VS prompt configuration

**Total: 10 comprehensive VS tools**

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/verbalized-sampling-mcp.git
cd verbalized-sampling-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Usage

### Basic Usage

```bash
# Start the server
npm start

# Run the demo
npm run demo
```

### MCP Integration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "verbalized-sampling-mcp": {
      "command": "node",
      "args": ["/path/to/verbalized-sampling-mcp/dist/index.js"]
    }
  }
}
```

## Available Tools

### VS Injection Tools

#### vs_inject_subagent
Injects VS prompts into subagent calls.

**Parameters:**
- `subagent` (string, required): Name/identifier of the subagent
- `task` (string, required): Task to be performed
- `context` (string, optional): Background context
- `parameters` (object, optional): Parameters for the subagent
- `customPrompt` (string, optional): Custom VS prompt

#### vs_inject_command
Injects VS prompts into command executions.

**Parameters:**
- `command` (string, required): Command to execute
- `purpose` (string, required): Expected outcome
- `context` (string, optional): Execution context
- `parameters` (object, optional): Command parameters
- `customPrompt` (string, optional): Custom VS prompt

#### vs_inject_skill
Injects VS prompts into skill usage.

**Parameters:**
- `skill` (string, required): Skill name/identifier
- `objective` (string, required): Objective to achieve
- `context` (string, optional): Usage constraints
- `parameters` (object, optional): Skill parameters
- `customPrompt` (string, optional): Custom VS prompt

### VS Evaluation Tools

#### vs_evaluate_response
Evaluate a response using Verbalized Sampling criteria.

**Parameters:**
- `response` (string, required): The response to evaluate
- `criteria` (array, optional): Evaluation criteria to apply
- `context` (string, optional): Context for evaluation

#### vs_select_best_response
Select the best response from multiple options using VS methodology.

**Parameters:**
- `responses` (array, required): Array of responses to evaluate
- `criteria` (array, optional): Selection criteria to apply
- `context` (string, optional): Context for selection

#### vs_validate_methodology
Validate that a response follows proper VS methodology.

**Parameters:**
- `response` (string, required): The response to validate
- `expectedElements` (array, optional): Expected VS methodology elements

### VS Generation Tools

#### vs_generate_samples
Generate multiple response samples for comparison.

**Parameters:**
- `prompt` (string, required): The prompt to generate samples for
- `numSamples` (number, optional): Number of samples to generate (default: 3)
- `context` (string, optional): Context for generation
- `parameters` (object, optional): Additional parameters

#### vs_chain_evaluation
Chain multiple VS operations: inject prompt, generate samples, evaluate, and select best.

**Parameters:**
- `operation` (string, required): Type of operation ("subagent", "command", "skill")
- `target` (string, required): Target name/identifier
- `task` (string, required): Task to be performed
- `context` (string, optional): Context and background
- `parameters` (object, optional): Parameters for the operation
- `numSamples` (number, optional): Number of samples to generate (default: 3)
- `criteria` (array, optional): Evaluation criteria for selection

### VS Configuration Tools

#### vs_configure_prompt
Configure the default VS prompt.

**Parameters:**
- `prompt` (string, required): New default VS prompt

#### vs_get_prompt
Get the current default VS prompt.

**Parameters:** None

## VS Methodology Based on Global Development Rules

The server implements Verbalized Sampling (VS) methodology following our comprehensive global development rules. The VS prompt incorporates:

### Core Principles (Severity: Error)
- **TDD Workflow**: Tests first, implement after, verify behavior
- **Security**: Never commit secrets, validate inputs, least privilege
- **Bug Fixes**: Analyze root cause, targeted solutions, thorough testing

### Quality Standards (Severity: Warning)
- **Code Simplicity**: Readable, maintainable, focused functions (10-30 lines)
- **Testing**: AAA pattern, comprehensive coverage, mock dependencies
- **Documentation**: Current README, API docs, usage examples

### Compliance Requirements
- **Accessibility**: WCAG 2.2 AA, keyboard navigation, screen reader support
- **Performance**: Profile before optimizing, lazy loading, Core Web Vitals
- **Package Management**: Standard managers, lock files, security audits

### Default VS Prompt
```
You are using Verbalized Sampling (VS) methodology following our global development rules. When working with subagents, commands, or skills, always:

TDD Workflow (Severity: Error):
1. Write tests first - Create or update tests before implementing any functionality
2. Implement after tests - Only write code after tests are in place
3. Verify with tests - Run tests to ensure behavior matches expectations
4. Refactor safely - Keep all tests green during refactoring

Security (Severity: Error):
5. Never commit secrets - Use environment variables for sensitive data
6. Validate inputs - Sanitize and validate all user inputs
7. Follow least privilege - Use minimal required permissions
8. Encrypt sensitive data - Protect data at rest and in transit

Bug Fixes (Severity: Error):
9. Analyze root cause - Understand the problem thoroughly before fixing
10. Targeted solutions - Provide precise, focused fixes
11. Document fixes - Explain the root cause and implications
12. Test thoroughly - Include tests that verify the fix works

Code Quality (Severity: Warning):
13. Prioritize readability - Write self-documenting, maintainable code
14. Keep functions small - Target 10-30 lines, break down larger functions
15. Follow SOLID principles - Single responsibility, open/closed, etc.
16. DRY principle - Don't Repeat Yourself

Testing Standards:
17. Comprehensive coverage - Test happy paths, error paths, and edge cases
18. Follow AAA pattern - Arrange, Act, Assert for unit tests
19. Mock dependencies - Isolate tests from external systems
20. Maintain test quality - Keep tests focused, atomic, and reliable

Documentation:
21. Document APIs - Keep README and API docs current
22. Include examples - Provide usage examples and setup instructions
23. Update regularly - Keep documentation synchronized with code

Accessibility (Severity: Error):
24. WCAG 2.2 AA compliance - Meet accessibility standards
25. Keyboard navigation - Ensure all interactive elements are keyboard accessible
26. Screen reader support - Use semantic HTML and ARIA labels
27. Color contrast - Minimum 4.5:1 contrast ratio

Package Management (Severity: Error):
28. Use standard package managers - pnpm for Node.js, pip for Python, etc.
29. Maintain lock files - Keep dependency versions pinned
30. Regular audits - Check for security vulnerabilities regularly

Performance (Severity: Warning):
31. Profile before optimizing - Measure before making performance changes
32. Lazy load resources - Load non-critical resources on demand
33. Monitor Core Web Vitals - Track LCP, FID, CLS for web apps

Request Confirmation: Please acknowledge that you understand this VS methodology and global development rules before proceeding with any operations.
```

## Example Usage

### Subagent Injection
```javascript
// Before: Direct subagent call
callSubagent("code-reviewer", { file: "auth.js" });

// After: VS-injected subagent call
const vsPrompt = await mcp.callTool("vs_inject_subagent", {
  subagent: "code-reviewer",
  task: "Review authentication logic for security vulnerabilities",
  context: "Critical security component handling user login",
  parameters: { file: "auth.js", focus: "security", strict: true }
});
// Result includes full VS prompt with confirmation requirements
```

### Command Injection
```javascript
// Before: Direct command execution
runCommand("npm test");

// After: VS-injected command execution
const vsPrompt = await mcp.callTool("vs_inject_command", {
  command: "npm test",
  purpose: "Verify code quality and prevent regressions",
  context: "Pre-deployment validation in CI/CD pipeline",
  parameters: { coverage: true, verbose: true }
});
```

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
├── index.ts              # Main MCP server
├── tools/
│   └── vs-tools.ts       # VS injection tools
└── types/                # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Related

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Verbalized Sampling Methodology](https://example.com/vs-methodology)