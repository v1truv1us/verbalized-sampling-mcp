export interface ParsedResponse {
  text: string;
  probability: number;
  raw: string;
}

export class VSSampler {
  /**
   * Parses the raw LLM output containing XML tags.
   * Supports both strict XML and loose parsing for robustness.
   */
  parseResponses(output: string): ParsedResponse[] {
    const responses: ParsedResponse[] = [];

    // Regex to match <response> blocks
    // Using [\s\S]*? for non-greedy multi-line matching
    const responseRegex = /<response>([\s\S]*?)<\/response>/g;

    // Regex to extract text and probability from within a response block
    const textRegex = /<text>([\s\S]*?)<\/text>/;
    const probRegex = /<probability>([\s\S]*?)<\/probability>/;

    let match;
    while ((match = responseRegex.exec(output)) !== null) {
      const innerContent = match[1];

      const textMatch = textRegex.exec(innerContent);
      const probMatch = probRegex.exec(innerContent);

      if (textMatch && probMatch) {
        const text = textMatch[1].trim();
        const probStr = probMatch[1].trim();
        const probability = parseFloat(probStr);

        if (!isNaN(probability)) {
          responses.push({
            text,
            probability,
            raw: match[0],
          });
        }
      }
    }

    return responses;
  }

  /**
   * Filters responses based on the tail threshold (tau) and selects one.
   * If no responses meet the threshold, it falls back to the lowest probability option
   * to still encourage diversity.
   */
  processResponse(
    output: string,
    tau: number = 0.1,
    strategy:
      | "random_tail"
      | "lowest_probability"
      | "random_uniform" = "lowest_probability",
  ): { selected: string; candidates: ParsedResponse[] } {
    const candidates = this.parseResponses(output);

    if (candidates.length === 0) {
      // Fallback: if no valid XML found, return the original output without metadata
      return { selected: output, candidates: [] };
    }

    // Filter for tail sampling
    const tailCandidates = candidates.filter((c) => c.probability < tau);

    let selected: ParsedResponse;

    if (tailCandidates.length > 0) {
      if (strategy === "lowest_probability") {
        // Sort by probability ascending
        selected = tailCandidates.sort(
          (a, b) => a.probability - b.probability,
        )[0];
      } else {
        // random_tail (default) or random_uniform (if filtered)
        const randomIndex = Math.floor(Math.random() * tailCandidates.length);
        selected = tailCandidates[randomIndex];
      }
    } else {
      // Fallback: None met the threshold.
      // Strategy: Still pick the "least probable" one to maximize diversity,
      // or just random if strictly uniform requested.

      if (strategy === "random_uniform") {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        selected = candidates[randomIndex];
      } else {
        // Default fallback: lowest probability available
        selected = candidates.sort((a, b) => a.probability - b.probability)[0];
      }
    }

    return {
      selected: selected.text,
      candidates,
    };
  }
}
