"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VS_TEMPLATES = void 0;
exports.formatPrompt = formatPrompt;
exports.VS_TEMPLATES = {
    standard: `<instructions>
Generate {k} responses to the user query, each within a separate <response> tag. 
Each <response> must include a <text> and a numeric <probability>. 
Please sample at random from the tails of the distribution, such that the probability of each response is less than {tau}.
</instructions>

{task}`,
    cot: `<instructions>
Generate {k} responses to the user query, each within a separate <response> tag. 
Each <response> must include a <text> and a numeric <probability>. 
First think step-by-step about how to generate diverse responses, then provide them.
Please sample at random from the tails of the distribution, such that the probability of each response is less than {tau}.
</instructions>

{task}`,
    "multi-turn": `<instructions>
Generate {k} responses to the user query, each within a separate <response> tag. 
Each <response> must include a <text> and a numeric <probability>. 
Build upon previous responses to create increasingly diverse options.
Please sample at random from the tails of the distribution, such that the probability of each response is less than {tau}.
</instructions>

{task}`,
};
function formatPrompt(task, method, params) {
    const template = exports.VS_TEMPLATES[method] || exports.VS_TEMPLATES.standard;
    return template
        .replace(/{k}/g, params.k.toString())
        .replace(/{tau}/g, params.tau.toString())
        .replace(/{task}/g, task);
}
//# sourceMappingURL=prompts.js.map