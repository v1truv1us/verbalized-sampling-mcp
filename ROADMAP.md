# Verbalized Sampling (VS) Alignment Plan & Design Document

## 1. Executive Summary
This document outlines the plan to transform the `verbalized-sampling-mcp` project from a set of static development guidelines into a functional implementation of the **Verbalized Sampling** inference technique described in [Zhang et al. (2025)](https://arxiv.org/abs/2510.01171).

**Goal:** Mitigate "Mode Collapse" in LLM outputs by implementing a toolset that forces the model to verbalize response probabilities and sample from the tails of the distribution.

## 2. Scientific Alignment Strategy

### 2.1. The Core Problem: Mode Collapse & Typicality Bias
The research identifies that RLHF/alignment training causes models to disproportionately favor "typical" (high probability) responses, reducing diversity.
*   **Our Solution:** We will build tools that specifically counteract this by using the "Magic Prompt" technique to explicitly request probability distributions.

### 2.2. The "Magic Prompt" Implementation
The official documentation specifies a prompt structure that must be strictly followed.

**Research Prompt Structure:**
```xml
<instructions>
Generate {N} responses to the user query, each within a separate <response> tag. 
Each <response> must include a <text> and a numeric <probability>. 
Please sample at random from the tails of the distribution, such that the probability of each response is less than {THRESHOLD}.
</instructions>
```

**Proposed MCP Implementation:**
We will create a dedicated tool `vs_generate_prompt` (or `vs_create_sampling_context`) that accepts:
*   `user_query`: The actual task (e.g., "Write a poem about robots").
*   `num_samples`: Number of variants to generate (Paper suggests 5-10).
*   `tail_threshold`: The probability cutoff (Paper uses < 0.10 to force diversity).

### 2.3. Parsing & Selection (The "Verbalized" Part)
The methodology relies on the model *outputting* XML tags with probabilities.
*   **Requirement:** We need a robust parser to extract:
    *   `<response>` blocks
    *   `<text>` content
    *   `<probability>` values
*   **Selection Logic:** Unlike standard "best of N", our selection tool (`vs_select_response`) should allow users to choose based on:
    *   **Diversity:** Choosing lower probability responses (Tail Sampling).
    *   **Confidence:** Choosing higher probability responses (if needed for factual tasks).
    *   **Randomness:** True random sampling from the generated set.

## 3. Proposed Architecture Changes

### Phase 1: Tool Re-alignment (Current vs. Target)

| Current Tool | Current Function | **Target Function (Aligned with Research)** |
| :--- | :--- | :--- |
| `vs_inject_*` | Injects static Dev Rules | **Injects the VS Magic Prompt wrapper around the task.** |
| `vs_evaluate_response` | Checks against Dev Rules | **Parses `<probability>` tags and calculates "typicality" score.** |
| `vs_generate_samples` | Simulates samples | **Constructs the full VS prompt for the LLM to execute.** |
| `vs_select_best` | Random selection | **Selects response based on user preference (e.g., "most diverse" vs "most probable").** |

### Phase 2: New Resources
We should expose the "Magic Prompt" templates as MCP **Resources** so users can read them directly or use them in other contexts.
*   `verbalized-sampling://templates/creative-writing`
*   `verbalized-sampling://templates/reasoning`

### Phase 3: Metrics & Validation
To ensure we are actually mitigating mode collapse, we need a way to measure success.
*   **Proposal:** Implement a `vs_calculate_diversity` tool that (if possible via embeddings or n-gram overlap) calculates how different the generated samples are from each other.

## 4. Workflow Example (How it will work)

1.  **User:** "I need a creative name for my new coffee shop."
2.  **Agent** calls `vs_generate_samples(prompt="Name for coffee shop", threshold=0.10, count=5)`.
3.  **Tool** returns the *exact prompt string* required:
    *   *"Generate 5 responses... probability < 0.10..."*
4.  **Agent** sends this prompt to the LLM.
5.  **LLM** returns XML with 5 options and low probabilities.
6.  **Agent** calls `vs_select_response(strategy="lowest_probability")`.
7.  **Tool** parses the XML and returns the most unique/creative name.

## 5. Detailed Task List (Next Steps)

1.  **Refactor `vs-tools.ts`:**
    *   [ ] Separate "Global Dev Rules" (context) from "Verbalized Sampling" (inference technique). They are distinct features.
    *   [ ] Implement the exact XML prompt template from the paper.
2.  **Implement Parser:**
    *   [ ] Create a helper class to robustly parse the specific XML structure `<response><text>...</text><probability>...</probability></response>`.
3.  **Update Tests:**
    *   [ ] Verify that generated prompts match the string equality of the research prompt.
    *   [ ] Test the parser against mock LLM XML output.
4.  **Documentation:**
    *   [ ] Update README to explain the *scientific* basis of the tool (Typicality Bias).
    *   [ ] Add attribution to Zhang et al.

## 6. Discussion Points
*   **Prompt Injection vs. Execution:** Should the MCP tool *execute* the call to the LLM (using an API key) or just *return the string* for the Agent to send?
    *   *Recommendation:* Just return the string. This keeps the MCP server stateless and model-agnostic.
*   **Default Thresholds:** The paper uses 0.10 for "tail sampling". Should this be the hard default, or customizable?
    *   *Recommendation:* Default to 0.10 but allow override.

---
**Verification:** This plan aligns directly with the `verbalized-sampling.com` methodology by adopting its prompt structure, probability-based sampling approach, and focus on mitigating typicality bias.
