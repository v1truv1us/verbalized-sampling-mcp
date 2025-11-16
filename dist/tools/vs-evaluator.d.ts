export interface VSEvaluationCriteria {
    name: string;
}
export interface VSEvaluationResult {
    criterion: string;
    score: number;
}
export interface VSSelectionResult {
    index: number;
    response: string;
    score: number;
}
export interface VSValidationResult {
    element: string;
    present: boolean;
}
export declare class VSEvaluator {
    evaluateResponse(response: string, criteria: string[]): {
        results: VSEvaluationResult[];
        overall: number;
    };
    selectBestResponse(responses: string[], criteria: string[]): VSSelectionResult[];
    validateMethodology(response: string, expectedElements: string[]): VSValidationResult[];
}
//# sourceMappingURL=vs-evaluator.d.ts.map