export interface ModelParams {
    k: number;
    tau: number;
    temperature: number;
}
export declare const DEFAULT_PARAMS: ModelParams;
export declare const MODEL_PARAMS: Record<string, ModelParams>;
export declare function getModelParams(modelName?: string): ModelParams;
//# sourceMappingURL=constants.d.ts.map