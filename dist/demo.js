#!/usr/bin/env node
/**
 * Demo script for Verbalized Sampling MCP Server
 */
import { VSTools } from "./tools/vs-tools.js";
async function demo() {
    console.log("🗣️ Verbalized Sampling MCP Server Demo");
    console.log("=====================================\n");
    const vsTools = new VSTools();
    console.log("📋 Available VS Tools:");
    vsTools.getTools().forEach(tool => {
        console.log(`  • ${tool.name}: ${tool.description}`);
    });
    console.log("\n📊 Tool Summary:");
    console.log(`  • Total Tools: ${vsTools.getTools().length}`);
    console.log(`  • VS Injection Tools: 3 (subagent, command, skill)`);
    console.log(`  • VS Evaluation Tools: 3 (evaluate, select, validate)`);
    console.log(`  • VS Generation Tools: 1 (generate samples prompt)`);
    console.log(`  • VS Chain Tools: 1 (chain evaluation simulation)`);
    console.log(`  • VS Config Tools: 2 (configure, get prompt)`);
    console.log("\n🔧 Example Usage:\n");
    // Example 1: Subagent injection
    console.log("1. Subagent Injection (Prompt Generation):");
    const subagentResult = await vsTools.handleTool("vs_inject_subagent", {
        subagent: "code-reviewer",
        task: "Review the authentication logic in login.ts",
        context: "This is a critical security component that handles user authentication",
        parameters: { strict: true, focus: "security" }
    });
    console.log("Result (Injected Prompt):");
    console.log(subagentResult.content[0].text + "\n");
    // Example 2: Response evaluation
    console.log("2. Response Evaluation:");
    const evaluationResult = await vsTools.handleTool("vs_evaluate_response", {
        response: "I will review the authentication logic focusing on security vulnerabilities and potential exploits.",
        criteria: ["Clarity of intent", "Contextual relevance", "Parameter specificity"],
        context: "Security code review request"
    });
    console.log("Result:", evaluationResult.content[0].text.substring(0, 200) + "...\n");
    // Example 3: Chain evaluation
    console.log("3. Chain Evaluation Simulation (Inject → Prompt → Mock LLM → Select):");
    const chainResult = await vsTools.handleTool("vs_chain_evaluation", {
        operation: "subagent",
        target: "code-reviewer",
        task: "Review authentication security",
        context: "Critical security component",
        parameters: { focus: "security" },
        numSamples: 2,
        criteria: ["Clarity", "Security focus", "Completeness"]
    });
    console.log("Result:");
    console.log(chainResult.content[0].text + "\n");
    // Example 4: Generate Samples Prompt
    console.log("4. Generate Samples Prompt (Magic Prompt):");
    const genResult = await vsTools.handleTool("vs_generate_samples", {
        prompt: "Tell me a story about a robot learning to love",
        numSamples: 5,
        threshold: 0.05
    });
    console.log("Result (Magic Prompt):");
    console.log(genResult.content[0].text + "\n");
    console.log("✅ Demo completed successfully!");
    console.log("💡 The VS MCP Server provides comprehensive Verbalized Sampling methodology support!");
    console.log("\n🚀 To start the server:");
    console.log("  npm start");
}
// Run demo
demo();
//# sourceMappingURL=demo.js.map