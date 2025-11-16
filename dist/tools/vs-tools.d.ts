import { Tool } from "@modelcontextprotocol/sdk/types.js";
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
export declare class VSTools {
    private defaultVSPrompt;
    private evaluator;
    private tools;
    getTools(): Tool[];
    hasTool(name: string): boolean;
    handleTool(name: string, args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    private vsInjectSubagent;
    private vsInjectCommand;
    private vsInjectSkill;
    private vsConfigurePrompt;
    private vsGetPrompt;
    private vsEvaluateResponse;
    private vsSelectBestResponse;
    private vsGenerateSamples;
    private vsChainEvaluation;
    private vsValidateMethodology;
}
//# sourceMappingURL=vs-tools.d.ts.map