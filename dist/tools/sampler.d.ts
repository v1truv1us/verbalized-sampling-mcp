export interface ParsedResponse {
    text: string;
    probability: number;
    raw: string;
}
export declare class VSSampler {
    /**
     * Parses the raw LLM output containing XML tags.
     * Supports both strict XML and loose parsing for robustness.
     */
    parseResponses(output: string): ParsedResponse[];
    /**
     * Filters responses based on the tail threshold (tau) and selects one.
     * If no responses meet the threshold, it falls back to the lowest probability option
     * to still encourage diversity.
     */
    processResponse(output: string, tau?: number, strategy?: "random_tail" | "lowest_probability" | "random_uniform"): {
        selected: string;
        candidates: ParsedResponse[];
    };
}
//# sourceMappingURL=sampler.d.ts.map