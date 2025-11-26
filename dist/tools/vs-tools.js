import { getModelParams } from "./constants.js";
import { formatPrompt } from "./prompts.js";
import { VSSampler } from "./sampler.js";
export class VSTools {
    sampler = new VSSampler();
    tools = [
        {
            name: "vs_create_prompt",
            description: "Generate a Verbalized Sampling prompt optimized for a specific model.",
            inputSchema: {
                type: "object",
                properties: {
                    topic: {
                        type: "string",
                        description: "The user's query or task (e.g., 'Tell me a joke about AI')",
                    },
                    method: {
                        type: "string",
                        enum: ["standard", "cot", "multi-turn", "research_standard", "creative_writing", "dialogue"],
                        description: "The VS prompting strategy to use. Defaults to 'standard'.",
                    },
                    model_name: {
                        type: "string",
                        description: "The target model name (e.g., 'claude-3-5-sonnet', 'gpt-4o') to optimize parameters.",
                    },
                },
                required: ["topic"],
            },
        },
        {
            name: "vs_process_response",
            description: "Parse the LLM's XML response and select the best option using tail sampling.",
            inputSchema: {
                type: "object",
                properties: {
                    llm_output: {
                        type: "string",
                        description: "The raw text output from the LLM containing <response> tags.",
                    },
                    tau: {
                        type: "number",
                        description: "Optional override for the probability threshold (default: 0.10).",
                    },
                },
                required: ["llm_output"],
            },
        },
        {
            name: "vs_recommend_params",
            description: "Get the recommended VS parameters (k, tau) for a specific model.",
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
    getTools() {
        return this.tools;
    }
    async handleTool(name, args) {
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
    createPrompt(args) {
        if (!args.topic ||
            typeof args.topic !== "string" ||
            args.topic.trim() === "") {
            throw new Error("Parameter 'topic' is required and must be a non-empty string");
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
    processResponse(args) {
        if (!args.llm_output || typeof args.llm_output !== "string") {
            throw new Error("Parameter 'llm_output' is required and must be a string");
        }
        // We use a default tau of 0.10 if not provided, matching general research recommendations
        const tau = args.tau ?? 0.1;
        const result = this.sampler.processResponse(args.llm_output, tau);
        // Only add metadata if we actually processed candidates
        const metadata = result.candidates.length > 0
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
    recommendParams(args) {
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
//# sourceMappingURL=vs-tools.js.map