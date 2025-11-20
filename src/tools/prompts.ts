import { ModelParams } from "./constants.js";

export type VSMethod = "standard" | "cot" | "multi-turn";

export const VS_TEMPLATES: Record<VSMethod, string> = {
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

export function formatPrompt(
  task: string,
  method: VSMethod,
  params: ModelParams,
): string {
  const template = VS_TEMPLATES[method] || VS_TEMPLATES.standard;

  return template
    .replace(/{k}/g, params.k.toString())
    .replace(/{tau}/g, params.tau.toString())
    .replace(/{task}/g, task);
}
