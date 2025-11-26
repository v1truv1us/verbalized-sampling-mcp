import { ModelParams } from "./constants.js";
export type VSMethod = "standard" | "cot" | "multi-turn" | "research_standard" | "creative_writing" | "dialogue";
export declare const VS_TEMPLATES: Record<VSMethod, string>;
export declare function formatPrompt(task: string, method: VSMethod, params: ModelParams): string;
//# sourceMappingURL=prompts.d.ts.map