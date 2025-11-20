import { describe, it, expect, beforeEach } from "bun:test";
import { VSTools } from "./vs-tools.js";

describe("VSTools", () => {
  let vsTools: VSTools;

  beforeEach(() => {
    vsTools = new VSTools();
  });

  it("should have correct tool count", () => {
    const tools = vsTools.getTools();
    expect(tools.length).toBe(3);
    expect(tools.some((t) => t.name === "vs_create_prompt")).toBe(true);
    expect(tools.some((t) => t.name === "vs_process_response")).toBe(true);
    expect(tools.some((t) => t.name === "vs_recommend_params")).toBe(true);
  });

  describe("vs_create_prompt", () => {
    it("should generate a standard prompt", async () => {
      const result = await vsTools.handleTool("vs_create_prompt", {
        topic: "Test Topic",
        model_name: "gpt-4o",
      });

      const text = result.content[0].text;
      expect(text).toContain("<instructions>");
      expect(text).toContain("Generate 5 responses"); // GPT-4 default k=5
      expect(text).toContain("probability of each response is less than 0.1"); // GPT-4 default tau=0.1
      expect(text).toContain("Test Topic");
    });

    it("should adjust parameters for Claude", async () => {
      const result = await vsTools.handleTool("vs_create_prompt", {
        topic: "Test Topic",
        model_name: "claude-3-5-sonnet",
      });

      const text = result.content[0].text;
      expect(text).toContain("probability of each response is less than 0.08"); // Claude default tau=0.08
    });

    it("should use different template for CoT", async () => {
      const result = await vsTools.handleTool("vs_create_prompt", {
        topic: "Test Topic",
        method: "cot",
      });

      const text = result.content[0].text;
      expect(text).toContain("think step-by-step");
    });
  });

  describe("vs_process_response", () => {
    const mockLlmOutput = `
Here are the responses:
<response>
  <text>Common Answer</text>
  <probability>0.9</probability>
</response>
<response>
  <text>Rare Answer</text>
  <probability>0.05</probability>
</response>
    `;

    it("should select low probability response", async () => {
      const result = await vsTools.handleTool("vs_process_response", {
        llm_output: mockLlmOutput,
        tau: 0.1,
      });

      const text = result.content[0].text;
      expect(text).toContain("Rare Answer");
      expect(text).not.toContain("Common Answer");
      expect(text).toContain("[VS Metadata");
    });

    it("should fallback if no tail candidates", async () => {
      // Both high prob
      const highProbOutput = `
<response><text>A</text><probability>0.9</probability></response>
<response><text>B</text><probability>0.8</probability></response>
      `;

      const result = await vsTools.handleTool("vs_process_response", {
        llm_output: highProbOutput,
        tau: 0.1,
      });

      // Should pick lowest prob (B is 0.8 vs A is 0.9)
      expect(result.content[0].text).toContain("B");
    });
  });

  describe("vs_recommend_params", () => {
    it("should return params for known model", async () => {
      const result = await vsTools.handleTool("vs_recommend_params", {
        model_name: "gemini-pro",
      });

      const params = JSON.parse(result.content[0].text);
      expect(params.k).toBe(7);
      expect(params.tau).toBe(0.12);
    });
  });
});
