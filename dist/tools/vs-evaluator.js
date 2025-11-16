"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSEvaluator = void 0;
class VSEvaluator {
    evaluateResponse(response, criteria) {
        const normalized = response.toLowerCase();
        const results = criteria.map((criterion) => {
            const tokens = criterion.toLowerCase().split(/\s+/).filter(Boolean);
            const hits = tokens.filter((t) => normalized.includes(t)).length;
            const coverage = hits / Math.max(tokens.length, 1);
            const score = Math.round(coverage * 4) + 1; // 1-5
            return { criterion, score };
        });
        const overall = results.reduce((sum, r) => sum + r.score, 0) /
            Math.max(results.length, 1);
        return { results, overall };
    }
    selectBestResponse(responses, criteria) {
        const scored = responses.map((response, index) => {
            const { overall } = this.evaluateResponse(response, criteria);
            return { index, response, score: overall };
        });
        return scored.sort((a, b) => b.score - a.score);
    }
    validateMethodology(response, expectedElements) {
        const normalized = response.toLowerCase();
        return expectedElements.map((element) => {
            const tokens = element.toLowerCase().split(/\s+/).filter(Boolean);
            const present = tokens.some((t) => normalized.includes(t));
            return { element, present };
        });
    }
}
exports.VSEvaluator = VSEvaluator;
//# sourceMappingURL=vs-evaluator.js.map