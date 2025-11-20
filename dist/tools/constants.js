"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_PARAMS = exports.DEFAULT_PARAMS = void 0;
exports.getModelParams = getModelParams;
// Default parameters if model is unknown
exports.DEFAULT_PARAMS = {
    k: 5,
    tau: 0.1,
    temperature: 1.0, // High temp to encourage diversity in generation
};
// Mappings for various model families including current and latest models from 2025
exports.MODEL_PARAMS = {
    // Anthropic Models (tend to need lower threshold) - Latest as of Oct 2025
    claude: { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-sonnet-4-5": { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-sonnet-4-5-20250929": { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-haiku-4-5": { k: 5, tau: 0.07, temperature: 1.0 },
    "claude-haiku-4-5-20251001": { k: 5, tau: 0.07, temperature: 1.0 },
    "claude-opus-4-1": { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-opus-4-1-20250805": { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-3-5-sonnet": { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-3-opus": { k: 5, tau: 0.08, temperature: 1.0 },
    "claude-3-haiku": { k: 5, tau: 0.08, temperature: 1.0 },
    // OpenAI Models - Latest as of Oct 2025
    "gpt-5": { k: 10, tau: 0.05, temperature: 1.1 },
    "gpt-5-1": { k: 10, tau: 0.05, temperature: 1.1 },
    "gpt-5-mini": { k: 7, tau: 0.08, temperature: 1.0 },
    "gpt-5-nano": { k: 5, tau: 0.1, temperature: 1.0 },
    "gpt-5-pro": { k: 15, tau: 0.03, temperature: 1.2 },
    "gpt-4": { k: 5, tau: 0.1, temperature: 1.0 },
    "gpt-4o": { k: 5, tau: 0.1, temperature: 1.0 },
    "gpt-4-1": { k: 5, tau: 0.1, temperature: 1.0 },
    "gpt-4-1-mini": { k: 5, tau: 0.1, temperature: 1.0 },
    "gpt-4-1-nano": { k: 5, tau: 0.1, temperature: 1.0 },
    "gpt-4-turbo": { k: 5, tau: 0.1, temperature: 1.0 },
    o1: { k: 5, tau: 0.1, temperature: 1.0 },
    o3: { k: 7, tau: 0.08, temperature: 1.0 },
    "o4-mini": { k: 5, tau: 0.1, temperature: 1.0 },
    // Google Models - Latest as of Oct 2025
    gemini: { k: 7, tau: 0.12, temperature: 1.0 },
    "gemini-pro": { k: 7, tau: 0.12, temperature: 1.0 },
    "gemini-1.5-pro": { k: 10, tau: 0.12, temperature: 1.0 },
    "gemini-flash": { k: 7, tau: 0.12, temperature: 1.0 },
    "gemini-2.5-pro": { k: 10, tau: 0.1, temperature: 1.0 },
    "gemini-2.5-flash": { k: 7, tau: 0.12, temperature: 1.0 },
    // Meta / Open Source
    llama: { k: 5, tau: 0.15, temperature: 0.9 },
    "llama-3": { k: 5, tau: 0.15, temperature: 0.9 },
    "llama-3.1": { k: 5, tau: 0.15, temperature: 0.9 },
    "llama-3.2": { k: 5, tau: 0.15, temperature: 0.9 },
    "llama-3.3": { k: 5, tau: 0.15, temperature: 0.9 },
    deepseek: { k: 5, tau: 0.1, temperature: 1.0 },
    "deepseek-r1": { k: 5, tau: 0.1, temperature: 1.0 },
    qwen: { k: 5, tau: 0.1, temperature: 1.0 },
    qwen3: { k: 5, tau: 0.1, temperature: 1.0 },
    "qwen3-235b": { k: 5, tau: 0.1, temperature: 1.0 },
};
function getModelParams(modelName) {
    if (!modelName)
        return exports.DEFAULT_PARAMS;
    const normalized = modelName.toLowerCase();
    // Exact match
    if (exports.MODEL_PARAMS[normalized]) {
        return exports.MODEL_PARAMS[normalized];
    }
    // Partial match (e.g., "claude-3-5-sonnet-20240620" -> "claude-3-5-sonnet")
    const key = Object.keys(exports.MODEL_PARAMS).find((k) => normalized.includes(k));
    if (key) {
        return exports.MODEL_PARAMS[key];
    }
    return exports.DEFAULT_PARAMS;
}
//# sourceMappingURL=constants.js.map