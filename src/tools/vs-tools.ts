import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { getModelParams } from "./constants.js";
import { formatPrompt, VSMethod } from "./prompts.js";
import { VSSampler } from "./sampler.js";

export class VSTools {
  private sampler = new VSSampler();

  private tools: Tool[] = [
    {
      name: "vs_create_prompt",
      description:
        "Generate a Verbalized Sampling prompt optimized for a specific model.",
      inputSchema: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description:
              "The user's query or task (e.g., 'Tell me a joke about AI')",
          },
          method: {
            type: "string",
            enum: ["standard", "cot", "multi-turn"],
            description:
              "The VS prompting strategy to use. Defaults to 'standard'.",
          },
          model_name: {
            type: "string",
            description:
              "The target model name (e.g., 'claude-3-5-sonnet', 'gpt-4o') to optimize parameters.",
          },
        },
        required: ["topic"],
      },
    },
    {
      name: "vs_process_response",
      description:
        "Parse the LLM's XML response and select the best option using tail sampling.",
      inputSchema: {
        type: "object",
        properties: {
          llm_output: {
            type: "string",
            description:
              "The raw text output from the LLM containing <response> tags.",
          },
          tau: {
            type: "number",
            description:
              "Optional override for the probability threshold (default: 0.10).",
          },
        },
        required: ["llm_output"],
      },
    },
    {
      name: "vs_recommend_params",
      description:
        "Get the recommended VS parameters (k, tau) for a specific model.",
      inputSchema: {
        type: "object",
        properties: {
          model_name: {
            type: "string",
            description: "The model name to look up.",
          },
        },
        required: ["model_name"],
      },
    },
  ];

  getTools(): Tool[] {
    return this.tools;
  }

  async handleTool(name: string, args: any) {
    switch (name) {
      case "vs_create_prompt":
        return this.createPrompt(args);
      case "vs_process_response":
        return this.processResponse(args);
      case "vs_recommend_params":
        return this.recommendParams(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private createPrompt(args: {
    topic: string;
    method?: VSMethod;
    model_name?: string;
  }) {
    if (
      !args.topic ||
      typeof args.topic !== "string" ||
      args.topic.trim() === ""
    ) {
      throw new Error(
        "Parameter 'topic' is required and must be a non-empty string",
      );
    }

    const method = args.method || "standard";
    const params = getModelParams(args.model_name);
    const prompt = formatPrompt(args.topic, method, params);

    return {
      content: [
        {
          type: "text",
          text: prompt,
        },
      ],
    };
  }

  private processResponse(args: { llm_output: string; tau?: number }) {
    if (!args.llm_output || typeof args.llm_output !== "string") {
      throw new Error(
        "Parameter 'llm_output' is required and must be a string",
      );
    }

    // We use a default tau of 0.10 if not provided, matching general research recommendations
    const tau = args.tau ?? 0.1;
    const result = this.sampler.processResponse(args.llm_output, tau);

    // Only add metadata if we actually processed candidates
    const metadata =
      result.candidates.length > 0
        ? `\n\n[VS Metadata: Selected from ${result.candidates.length} candidates. Threshold: ${tau}]`
        : "";

    return {
      content: [
        {
          type: "text",
          text: result.selected + metadata,
        },
      ],
    };
  }

  private recommendParams(args: { model_name: string }) {
    const params = getModelParams(args.model_name);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(params, null, 2),
        },
      ],
    };
  }
}
