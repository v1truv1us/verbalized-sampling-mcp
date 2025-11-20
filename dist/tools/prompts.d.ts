import { ModelParams } from "./constants.js";
export type VSMethod = "standard" | "cot" | "multi-turn";
export declare const VS_TEMPLATES: Record<VSMethod, string>;
export declare function formatPrompt(task: string, method: VSMethod, params: ModelParams): string;
//# sourceMappingURL=prompts.d.ts.map