#!/usr/bin/env node
"use strict";
/**
 * Demo script for Verbalized Sampling MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vs_tools_js_1 = require("./tools/vs-tools.js");
async function demo() {
    console.log("🗣️ Verbalized Sampling MCP Server Demo");
    console.log("=====================================\n");
    const vsTools = new vs_tools_js_1.VSTools();
    console.log("📋 Available VS Tools:");
    vsTools.getTools().forEach(tool => {
        console.log(`  • ${tool.name}: ${tool.description}`);
    });
    console.log("\n📊 Tool Summary:");
    console.log(`  • Total Tools: ${vsTools.getTools().length}`);
    console.log(`  • VS Injection Tools: 3 (subagent, command, skill)`);
    console.log(`  • VS Evaluation Tools: 3 (evaluate, select, validate)`);
    console.log(`  • VS Generation Tools: 1 (generate samples)`);
    console.log(`  • VS Chain Tools: 1 (chain evaluation)`);
    console.log(`  • VS Config Tools: 2 (configure, get prompt)`);
    console.log("\n🔧 Example Usage:\n");
    // Example 1: Subagent injection
    console.log("1. Subagent Injection:");
    const subagentResult = await vsTools.handleTool("vs_inject_subagent", {
        subagent: "code-reviewer",
        task: "Review the authentication logic in login.ts",
        context: "This is a critical security component that handles user authentication",
        parameters: { strict: true, focus: "security" }
    });
    console.log("Result:", subagentResult.content[0].text.substring(0, 200) + "...\n");
    // Example 2: Response evaluation
    console.log("2. Response Evaluation:");
    const evaluationResult = await vsTools.handleTool("vs_evaluate_response", {
        response: "I will review the authentication logic focusing on security vulnerabilities and potential exploits.",
        criteria: ["Clarity of intent", "Contextual relevance", "Parameter specificity"],
        context: "Security code review request"
    });
    console.log("Result:", evaluationResult.content[0].text.substring(0, 200) + "...\n");
    // Example 3: Chain evaluation
    console.log("3. Chain Evaluation (Inject → Generate → Evaluate → Select):");
    const chainResult = await vsTools.handleTool("vs_chain_evaluation", {
        operation: "subagent",
        target: "code-reviewer",
        task: "Review authentication security",
        context: "Critical security component",
        parameters: { focus: "security" },
        numSamples: 2,
        criteria: ["Clarity", "Security focus", "Completeness"]
    });
    console.log("Result:", chainResult.content[0].text.substring(0, 300) + "...\n");
    console.log("✅ Demo completed successfully!");
    console.log("💡 The VS MCP Server provides comprehensive Verbalized Sampling methodology support!");
    console.log("\n🚀 To start the server:");
    console.log("  npm start");
}
// Run demo
demo();
//# sourceMappingURL=demo.js.map