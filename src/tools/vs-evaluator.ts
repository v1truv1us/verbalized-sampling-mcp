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

export class VSEvaluator {
  evaluateResponse(
    response: string,
    criteria: string[],
  ): { results: VSEvaluationResult[]; overall: number } {
    const normalized = response.toLowerCase();
    const results: VSEvaluationResult[] = criteria.map((criterion) => {
      const tokens = criterion.toLowerCase().split(/\s+/).filter(Boolean);
      const hits = tokens.filter((t) => normalized.includes(t)).length;
      const coverage = hits / Math.max(tokens.length, 1);
      const score = Math.round(coverage * 4) + 1; // 1-5
      return { criterion, score };
    });

    const overall =
      results.reduce((sum, r) => sum + r.score, 0) /
      Math.max(results.length, 1);

    return { results, overall };
  }

  selectBestResponse(
    responses: string[],
    criteria: string[],
  ): VSSelectionResult[] {
    const scored: VSSelectionResult[] = responses.map((response, index) => {
      const { overall } = this.evaluateResponse(response, criteria);
      return { index, response, score: overall };
    });

    return scored.sort((a, b) => b.score - a.score);
  }

  validateMethodology(
    response: string,
    expectedElements: string[],
  ): VSValidationResult[] {
    const normalized = response.toLowerCase();
    return expectedElements.map((element) => {
      const tokens = element.toLowerCase().split(/\s+/).filter(Boolean);
      const present = tokens.some((t) => normalized.includes(t));
      return { element, present };
    });
  }
}
