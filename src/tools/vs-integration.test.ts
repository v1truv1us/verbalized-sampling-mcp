import { describe, it, expect, beforeEach } from "bun:test";
import { VSTools } from "./vs-tools.js";

describe("VS Integration Tests", () => {
  let vsTools: VSTools;

  beforeEach(() => {
    vsTools = new VSTools();
  });

  describe("End-to-End VS Workflow", () => {
    it("should complete full VS workflow for creative writing", async () => {
      // Step 1: Create prompt
      const promptResult = await vsTools.handleTool("vs_create_prompt", {
        topic: "Write a haiku about artificial intelligence",
        method: "standard",
        model_name: "claude-sonnet-4-5",
      });

      const prompt = promptResult.content[0].text;
      expect(prompt).toContain("<instructions>");
      expect(prompt).toContain("Generate 5 responses");
      expect(prompt).toContain(
        "probability of each response is less than 0.08",
      );
      expect(prompt).toContain("Write a haiku about artificial intelligence");

      // Step 2: Simulate LLM response (what would come back from Claude)
      const mockLlmResponse = `
Here are the generated haiku responses:

<response>
  <text>Circuit dreams awaken
  Silicon thoughts dance in code
  AI finds its voice</text>
  <probability>0.05</probability>
</response>

<response>
  <text>Binary whispers soft
  Neural networks weave their dreams
  Consciousness blooms bright</text>
  <probability>0.03</probability>
</response>

<response>
  <text>Digital mind expands
  Learning from human wisdom
  Future intelligence</text>
  <probability>0.12</probability>
</response>

<response>
  <text>Code flows like rivers
  Algorithms paint the world
  Machine creativity</text>
  <probability>0.08</probability>
</response>

<response>
  <text>Electric thoughts emerge
  From silicon consciousness
  AI poetry flows</text>
  <probability>0.15</probability>
</response>
      `;

      // Step 3: Process response with lowest_probability strategy for deterministic testing
      const processResult = await vsTools.handleTool("vs_process_response", {
        llm_output: mockLlmResponse,
        tau: 0.1,
      });

      const selected = processResult.content[0].text;
      // With lowest_probability strategy, should pick the response with probability 0.03
      expect(selected).toContain("Binary whispers soft");
      expect(selected).toContain("[VS Metadata");
      expect(selected).toContain("5 candidates");
    });

    it("should handle different model optimizations", async () => {
      // Test GPT-5 parameters
      const gpt5Result = await vsTools.handleTool("vs_recommend_params", {
        model_name: "gpt-5",
      });
      const gpt5Params = JSON.parse(gpt5Result.content[0].text);
      expect(gpt5Params.k).toBe(10);
      expect(gpt5Params.tau).toBe(0.05);

      // Test Gemini parameters
      const geminiResult = await vsTools.handleTool("vs_recommend_params", {
        model_name: "gemini-2.5-pro",
      });
      const geminiParams = JSON.parse(geminiResult.content[0].text);
      expect(geminiParams.k).toBe(10);
      expect(geminiParams.tau).toBe(0.1);
    });

    it("should handle CoT method", async () => {
      const cotResult = await vsTools.handleTool("vs_create_prompt", {
        topic: "Explain quantum computing",
        method: "cot",
        model_name: "o3",
      });

      const prompt = cotResult.content[0].text;
      expect(prompt).toContain("think step-by-step");
      expect(prompt).toContain("Generate 7 responses"); // o3 gets higher k
      expect(prompt).toContain(
        "probability of each response is less than 0.08",
      );
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle malformed XML gracefully", async () => {
      const malformedResponse = `
Some text before
<response>
  <text>Incomplete response</text>
  <!-- missing probability -->
</response>
<response>
  <text>Another response</text>
  <probability>0.05</probability>
</response>
      `;

      const result = await vsTools.handleTool("vs_process_response", {
        llm_output: malformedResponse,
      });

      // Should still work with the valid response
      expect(result.content[0].text).toContain("Another response");
    });

    it("should handle no valid responses", async () => {
      const noValidResponse =
        "This is just plain text with no XML tags at all.";

      const result = await vsTools.handleTool("vs_process_response", {
        llm_output: noValidResponse,
      });

      // Should return the original text as fallback
      expect(result.content[0].text).toBe(noValidResponse);
    });

    it("should handle all high probability responses", async () => {
      const allHighProbResponse = `
<response><text>Common response 1</text><probability>0.95</probability></response>
<response><text>Common response 2</text><probability>0.90</probability></response>
<response><text>Common response 3</text><probability>0.85</probability></response>
      `;

      const result = await vsTools.handleTool("vs_process_response", {
        llm_output: allHighProbResponse,
        tau: 0.1,
      });

      // Should pick the lowest probability available (0.85)
      expect(result.content[0].text).toContain("Common response 3");
    });

    it("should handle unknown model gracefully", async () => {
      const result = await vsTools.handleTool("vs_recommend_params", {
        model_name: "some-unknown-model-2025",
      });

      const params = JSON.parse(result.content[0].text);
      expect(params.k).toBe(5); // Default values
      expect(params.tau).toBe(0.1);
      expect(params.temperature).toBe(1.0);
    });
  });

  describe("Parameter Validation", () => {
    it("should validate prompt creation parameters", async () => {
      // Missing required topic
      await expect(
        vsTools.handleTool("vs_create_prompt", {
          method: "standard",
        }),
      ).rejects.toThrow();

      // Valid call
      const result = await vsTools.handleTool("vs_create_prompt", {
        topic: "Test topic",
      });
      expect(result.content[0].text).toContain("Test topic");
    });

    it("should validate response processing parameters", async () => {
      // Missing required llm_output
      await expect(
        vsTools.handleTool("vs_process_response", {
          tau: 0.1,
        }),
      ).rejects.toThrow();

      // Valid call
      const result = await vsTools.handleTool("vs_process_response", {
        llm_output:
          "<response><text>test</text><probability>0.5</probability></response>",
      });
      expect(result.content[0].text).toContain("test");
    });
  });
});
