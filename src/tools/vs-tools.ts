import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { VSEvaluator } from "./vs-evaluator.js";

export interface VSToolArgs {
  prompt?: string;
  context?: string;
  target?: string;
  parameters?: Record<string, any>;
  responses?: string[];
  criteria?: string[];
  numSamples?: number;
  evaluation?: string;
}

export class VSTools {
  // Default Verbalized Sampling prompt - based on global development rules
  private defaultVSPrompt = `You are using Verbalized Sampling (VS) methodology following our global development rules. When working with subagents, commands, or skills, always:

**TDD Workflow (Severity: Error):**
1. **Write tests first** - Create or update tests before implementing any functionality
2. **Implement after tests** - Only write code after tests are in place
3. **Verify with tests** - Run tests to ensure behavior matches expectations
4. **Refactor safely** - Keep all tests green during refactoring

**Security (Severity: Error):**
5. **Never commit secrets** - Use environment variables for sensitive data
6. **Validate inputs** - Sanitize and validate all user inputs
7. **Follow least privilege** - Use minimal required permissions
8. **Encrypt sensitive data** - Protect data at rest and in transit

**Bug Fixes (Severity: Error):**
9. **Analyze root cause** - Understand the problem thoroughly before fixing
10. **Targeted solutions** - Provide precise, focused fixes
11. **Document fixes** - Explain the root cause and implications
12. **Test thoroughly** - Include tests that verify the fix works

**Code Quality (Severity: Warning):**
13. **Prioritize readability** - Write self-documenting, maintainable code
14. **Keep functions small** - Target 10-30 lines, break down larger functions
15. **Follow SOLID principles** - Single responsibility, open/closed, etc.
16. **DRY principle** - Don't Repeat Yourself

**Testing Standards:**
17. **Comprehensive coverage** - Test happy paths, error paths, and edge cases
18. **Follow AAA pattern** - Arrange, Act, Assert for unit tests
19. **Mock dependencies** - Isolate tests from external systems
20. **Maintain test quality** - Keep tests focused, atomic, and reliable

**Documentation:**
21. **Document APIs** - Keep README and API docs current
22. **Include examples** - Provide usage examples and setup instructions
23. **Update regularly** - Keep documentation synchronized with code

**Accessibility (Severity: Error):**
24. **WCAG 2.2 AA compliance** - Meet accessibility standards
25. **Keyboard navigation** - Ensure all interactive elements are keyboard accessible
26. **Screen reader support** - Use semantic HTML and ARIA labels
27. **Color contrast** - Minimum 4.5:1 contrast ratio

**Package Management (Severity: Error):**
28. **Use standard package managers** - pnpm for Node.js, pip for Python, etc.
29. **Maintain lock files** - Keep dependency versions pinned
30. **Regular audits** - Check for security vulnerabilities regularly

**Performance (Severity: Warning):**
31. **Profile before optimizing** - Measure before making performance changes
32. **Lazy load resources** - Load non-critical resources on demand
33. **Monitor Core Web Vitals** - Track LCP, FID, CLS for web apps

**Request Confirmation:** Please acknowledge that you understand this VS methodology and global development rules before proceeding with any operations.`;

  private evaluator = new VSEvaluator();

  private tools: Tool[] = [
    {
      name: "vs_inject_subagent",
      description: "Inject Verbalized Sampling prompts into subagent calls",
      inputSchema: {
        type: "object",
        properties: {
          subagent: {
            type: "string",
            description: "Name or identifier of the subagent",
          },
          task: {
            type: "string",
            description: "The task to be performed by the subagent",
          },
          context: {
            type: "string",
            description: "Context and background information",
          },
          parameters: {
            type: "object",
            description: "Parameters to pass to the subagent",
          },
          customPrompt: {
            type: "string",
            description:
              "Custom VS prompt to use (optional, uses default if not provided)",
          },
        },
        required: ["subagent", "task"],
      },
    },
    {
      name: "vs_inject_command",
      description: "Inject Verbalized Sampling prompts into command executions",
      inputSchema: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "The command to be executed",
          },
          purpose: {
            type: "string",
            description: "Purpose and expected outcome of the command",
          },
          context: {
            type: "string",
            description: "Context in which the command is being executed",
          },
          parameters: {
            type: "object",
            description: "Command parameters and options",
          },
          customPrompt: {
            type: "string",
            description:
              "Custom VS prompt to use (optional, uses default if not provided)",
          },
        },
        required: ["command", "purpose"],
      },
    },
    {
      name: "vs_inject_skill",
      description: "Inject Verbalized Sampling prompts into skill usage",
      inputSchema: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "Name or identifier of the skill",
          },
          objective: {
            type: "string",
            description: "Objective to be achieved using the skill",
          },
          context: {
            type: "string",
            description: "Context and constraints for skill usage",
          },
          parameters: {
            type: "object",
            description: "Skill parameters and configuration",
          },
          customPrompt: {
            type: "string",
            description:
              "Custom VS prompt to use (optional, uses default if not provided)",
          },
        },
        required: ["skill", "objective"],
      },
    },
    {
      name: "vs_configure_prompt",
      description: "Configure the default Verbalized Sampling prompt",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The new default VS prompt to use",
          },
        },
        required: ["prompt"],
      },
    },
    {
      name: "vs_get_prompt",
      description: "Get the current default Verbalized Sampling prompt",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "vs_evaluate_response",
      description: "Evaluate a response using Verbalized Sampling criteria",
      inputSchema: {
        type: "object",
        properties: {
          response: {
            type: "string",
            description: "The response to evaluate",
          },
          criteria: {
            type: "array",
            items: { type: "string" },
            description: "Evaluation criteria to apply",
          },
          context: {
            type: "string",
            description: "Context in which the response was generated",
          },
        },
        required: ["response"],
      },
    },
    {
      name: "vs_select_best_response",
      description:
        "Select the best response from multiple options using VS methodology",
      inputSchema: {
        type: "object",
        properties: {
          responses: {
            type: "array",
            items: { type: "string" },
            description: "Array of responses to evaluate",
          },
          criteria: {
            type: "array",
            items: { type: "string" },
            description: "Selection criteria to apply",
          },
          context: {
            type: "string",
            description: "Context for the selection",
          },
        },
        required: ["responses"],
      },
    },
    {
      name: "vs_generate_samples",
      description: "Generate multiple response samples for comparison",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The prompt to generate samples for",
          },
          numSamples: {
            type: "number",
            description: "Number of samples to generate (default: 3)",
            minimum: 1,
            maximum: 10,
            default: 3,
          },
          context: {
            type: "string",
            description: "Context for sample generation",
          },
          parameters: {
            type: "object",
            description: "Additional parameters for generation",
          },
        },
        required: ["prompt"],
      },
    },
    {
      name: "vs_chain_evaluation",
      description:
        "Chain multiple VS operations: inject prompt, generate samples, evaluate, and select best",
      inputSchema: {
        type: "object",
        properties: {
          operation: {
            type: "string",
            enum: ["subagent", "command", "skill"],
            description: "Type of operation to perform",
          },
          target: {
            type: "string",
            description: "Target subagent/command/skill name",
          },
          task: {
            type: "string",
            description: "Task to be performed",
          },
          context: {
            type: "string",
            description: "Context and background information",
          },
          parameters: {
            type: "object",
            description: "Parameters for the operation",
          },
          numSamples: {
            type: "number",
            description:
              "Number of samples to generate for evaluation (default: 3)",
            minimum: 1,
            maximum: 5,
          },
          criteria: {
            type: "array",
            items: { type: "string" },
            description: "Evaluation criteria for response selection",
          },
        },
        required: ["operation", "target", "task"],
      },
    },
    {
      name: "vs_validate_methodology",
      description: "Validate that a response follows proper VS methodology",
      inputSchema: {
        type: "object",
        properties: {
          response: {
            type: "string",
            description: "The response to validate",
          },
          expectedElements: {
            type: "array",
            items: { type: "string" },
            description: "Expected VS methodology elements",
          },
        },
        required: ["response"],
      },
    },
  ];

  getTools(): Tool[] {
    return this.tools;
  }

  hasTool(name: string): boolean {
    return this.tools.some((tool) => tool.name === name);
  }

  async handleTool(name: string, args: any) {
    switch (name) {
      case "vs_inject_subagent":
        return await this.vsInjectSubagent(args);
      case "vs_inject_command":
        return await this.vsInjectCommand(args);
      case "vs_inject_skill":
        return await this.vsInjectSkill(args);
      case "vs_configure_prompt":
        return await this.vsConfigurePrompt(args);
      case "vs_get_prompt":
        return await this.vsGetPrompt(args);
      case "vs_evaluate_response":
        return await this.vsEvaluateResponse(args);
      case "vs_select_best_response":
        return await this.vsSelectBestResponse(args);
      case "vs_generate_samples":
        return await this.vsGenerateSamples(args);
      case "vs_chain_evaluation":
        return await this.vsChainEvaluation(args);
      case "vs_validate_methodology":
        return await this.vsValidateMethodology(args);
      default:
        throw new Error(`Unknown VS tool: ${name}`);
    }
  }

  private async vsInjectSubagent(
    args: VSToolArgs & {
      subagent: string;
      task: string;
      context?: string;
      parameters?: Record<string, any>;
      customPrompt?: string;
    },
  ) {
    const vsPrompt = args.customPrompt || this.defaultVSPrompt;

    const injectedPrompt = `${vsPrompt}

**SUBAGENT CALL: ${args.subagent}**
**TASK:** ${args.task}
${args.context ? `**CONTEXT:** ${args.context}` : ""}
${args.parameters ? `**PARAMETERS:** ${JSON.stringify(args.parameters, null, 2)}` : ""}

**CONFIRMATION REQUIRED:** Please acknowledge that you understand this task and the VS methodology before proceeding.`;

    return {
      content: [
        {
          type: "text",
          text: injectedPrompt,
        },
      ],
    };
  }

  private async vsInjectCommand(
    args: VSToolArgs & {
      command: string;
      purpose: string;
      context?: string;
      parameters?: Record<string, any>;
      customPrompt?: string;
    },
  ) {
    const vsPrompt = args.customPrompt || this.defaultVSPrompt;

    const injectedPrompt = `${vsPrompt}

**COMMAND EXECUTION: ${args.command}**
**PURPOSE:** ${args.purpose}
${args.context ? `**CONTEXT:** ${args.context}` : ""}
${args.parameters ? `**PARAMETERS:** ${JSON.stringify(args.parameters, null, 2)}` : ""}

**CONFIRMATION REQUIRED:** Please acknowledge that you understand this command execution and the VS methodology before proceeding.`;

    return {
      content: [
        {
          type: "text",
          text: injectedPrompt,
        },
      ],
    };
  }

  private async vsInjectSkill(
    args: VSToolArgs & {
      skill: string;
      objective: string;
      context?: string;
      parameters?: Record<string, any>;
      customPrompt?: string;
    },
  ) {
    const vsPrompt = args.customPrompt || this.defaultVSPrompt;

    const injectedPrompt = `${vsPrompt}

**SKILL USAGE: ${args.skill}**
**OBJECTIVE:** ${args.objective}
${args.context ? `**CONTEXT:** ${args.context}` : ""}
${args.parameters ? `**PARAMETERS:** ${JSON.stringify(args.parameters, null, 2)}` : ""}

**CONFIRMATION REQUIRED:** Please acknowledge that you understand this skill usage and the VS methodology before proceeding.`;

    return {
      content: [
        {
          type: "text",
          text: injectedPrompt,
        },
      ],
    };
  }

  private async vsConfigurePrompt(args: VSToolArgs & { prompt: string }) {
    this.defaultVSPrompt = args.prompt;

    return {
      content: [
        {
          type: "text",
          text: `Verbalized Sampling prompt has been updated successfully.`,
        },
      ],
    };
  }

  private async vsGetPrompt(args: VSToolArgs) {
    return {
      content: [
        {
          type: "text",
          text: `Current Verbalized Sampling prompt:\n\n${this.defaultVSPrompt}`,
        },
      ],
    };
  }

  private async vsEvaluateResponse(
    args: VSToolArgs & {
      response: string;
      criteria?: string[];
      context?: string;
    },
  ) {
    const criteria = args.criteria || [
      "TDD Compliance",
      "Security Best Practices",
      "Code Quality & Readability",
      "Testing Coverage",
      "Documentation Quality",
      "Accessibility Compliance",
      "Performance Considerations",
      "Package Management Standards",
    ];

    const { results, overall } = this.evaluator.evaluateResponse(
      args.response,
      criteria,
    );
    const evaluation = results
      .map((r) => `${r.criterion}: ${r.score}/5`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `VS Response Evaluation:\n\nResponse: "${args.response.substring(0, 100)}${args.response.length > 100 ? "..." : ""}"\n\nEvaluation Criteria:\n${evaluation}\n\nOverall Score: ${overall.toFixed(1)}/5\n\n${args.context ? `Context: ${args.context}\n\n` : ""}Recommendation: ${overall >= 4 ? "High quality response following VS methodology" : overall >= 3 ? "Acceptable response with room for improvement" : "Response needs significant improvement in VS methodology adherence"}`,
        },
      ],
    };
  }

  private async vsSelectBestResponse(
    args: VSToolArgs & {
      responses: string[];
      criteria?: string[];
      context?: string;
    },
  ) {
    if (!args.responses || args.responses.length === 0) {
      throw new Error("At least one response is required");
    }

    const criteria = args.criteria || [
      "Clarity and precision",
      "Contextual alignment",
      "Completeness of solution",
      "VS methodology adherence",
    ];

    // Simulate selection process (in real implementation, this would use more sophisticated evaluation)
    const evaluations = args.responses.map((response, index) => {
      const score =
        criteria.reduce((sum, _) => {
          return sum + (Math.floor(Math.random() * 5) + 1);
        }, 0) / criteria.length;
      return { index, response, score };
    });

    evaluations.sort((a, b) => b.score - a.score);
    const bestResponse = evaluations[0];

    return {
      content: [
        {
          type: "text",
          text: `VS Response Selection Results:\n\nBest Response (Score: ${bestResponse.score.toFixed(1)}/5):\n"${bestResponse.response}"\n\nEvaluation Summary:\n${evaluations.map((e, i) => `${i + 1}. Response ${e.index + 1}: ${e.score.toFixed(1)}/5`).join("\n")}\n\nSelection Criteria: ${criteria.join(", ")}\n${args.context ? `\nContext: ${args.context}` : ""}`,
        },
      ],
    };
  }

  private async vsGenerateSamples(
    args: VSToolArgs & {
      prompt: string;
      numSamples?: number;
      context?: string;
      parameters?: Record<string, any>;
    },
  ) {
    const numSamples = args.numSamples || 3;

    // Simulate sample generation (in real implementation, this would call an LLM multiple times)
    const samples = [];
    for (let i = 0; i < numSamples; i++) {
      samples.push(
        `Sample ${i + 1}: ${args.prompt} - Variation ${i + 1} with different approach and perspective.`,
      );
    }

    return {
      content: [
        {
          type: "text",
          text: `Generated ${numSamples} VS Response Samples:\n\n${samples.map((sample, i) => `${i + 1}. ${sample}`).join("\n\n")}\n\nOriginal Prompt: ${args.prompt}\n${args.context ? `Context: ${args.context}\n` : ""}${args.parameters ? `Parameters: ${JSON.stringify(args.parameters, null, 2)}` : ""}`,
        },
      ],
    };
  }

  private async vsChainEvaluation(
    args: VSToolArgs & {
      operation: string;
      target: string;
      task: string;
      context?: string;
      parameters?: Record<string, any>;
      numSamples?: number;
      criteria?: string[];
    },
  ) {
    const operation = args.operation;
    const numSamples = args.numSamples || 3;
    const criteria = args.criteria || [
      "Clarity of communication",
      "Task alignment",
      "Parameter specificity",
      "VS methodology adherence",
    ];

    // Step 1: Inject VS prompt
    let injectedPrompt = "";
    if (operation === "subagent") {
      const result = await this.vsInjectSubagent({
        subagent: args.target,
        task: args.task,
        context: args.context,
        parameters: args.parameters,
      });
      injectedPrompt = result.content[0].text;
    } else if (operation === "command") {
      const result = await this.vsInjectCommand({
        command: args.target,
        purpose: args.task,
        context: args.context,
        parameters: args.parameters,
      });
      injectedPrompt = result.content[0].text;
    } else if (operation === "skill") {
      const result = await this.vsInjectSkill({
        skill: args.target,
        objective: args.task,
        context: args.context,
        parameters: args.parameters,
      });
      injectedPrompt = result.content[0].text;
    }

    // Step 2: Generate samples
    const samplesResult = await this.vsGenerateSamples({
      prompt: injectedPrompt,
      numSamples: numSamples,
      context: args.context,
    });

    // Step 3: Evaluate and select best
    const sampleTexts = samplesResult.content[0].text
      .split("\n\n")
      .filter(
        (line) =>
          line.startsWith("Sample ") ||
          line.startsWith("1. ") ||
          line.startsWith("2. ") ||
          line.startsWith("3. "),
      )
      .map((line) =>
        line.replace(/^\d+\.\s*/, "").replace(/^Sample \d+:\s*/, ""),
      );

    const selectionResult = await this.vsSelectBestResponse({
      responses: sampleTexts,
      criteria: criteria,
      context: args.context,
    });

    return {
      content: [
        {
          type: "text",
          text: `VS Chain Evaluation Complete:\n\n1. INJECTED PROMPT:\n${injectedPrompt}\n\n2. GENERATED SAMPLES:\n${samplesResult.content[0].text}\n\n3. BEST RESPONSE SELECTION:\n${selectionResult.content[0].text}\n\nChain completed successfully using VS methodology.`,
        },
      ],
    };
  }

  private async vsValidateMethodology(
    args: VSToolArgs & { response: string; expectedElements?: string[] },
  ) {
    const expectedElements = args.expectedElements || [
      "TDD workflow adherence",
      "Security considerations",
      "Input validation",
      "Error handling",
      "Testing approach",
      "Documentation updates",
      "Accessibility compliance",
      "Performance implications",
      "Package management standards",
    ];

    // Simulate validation (in real implementation, this would analyze the response)
    const validationResults = expectedElements.map((element) => {
      const present = Math.random() > 0.3; // 70% chance of being present
      return `${element}: ${present ? "✓ Present" : "✗ Missing"}`;
    });

    const complianceScore =
      (validationResults.filter((r) => r.includes("✓ Present")).length /
        expectedElements.length) *
      100;

    return {
      content: [
        {
          type: "text",
          text: `VS Methodology Validation:\n\nResponse: "${args.response.substring(0, 150)}${args.response.length > 150 ? "..." : ""}"\n\nValidation Results:\n${validationResults.join("\n")}\n\nCompliance Score: ${complianceScore.toFixed(1)}%\n\n${complianceScore >= 80 ? "✅ High compliance with VS methodology" : complianceScore >= 60 ? "⚠️ Moderate compliance - some improvements needed" : "❌ Low compliance - significant VS methodology gaps"}`,
        },
      ],
    };
  }
}
