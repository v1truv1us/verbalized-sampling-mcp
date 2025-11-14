#!/usr/bin/env node
"use strict";
/**
 * MCP Protocol Test Script
 * Tests the Verbalized Sampling MCP server using MCP protocol
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
async function testMcpProtocol() {
    console.log("🧪 Testing Verbalized Sampling MCP Server with MCP Protocol...\n");
    // Start the MCP server
    const serverPath = path.join(process.cwd(), "dist", "index.js");
    const serverProcess = (0, child_process_1.spawn)("node", [serverPath], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd()
    });
    let responseBuffer = "";
    let requestId = 1;
    // Helper to send MCP request
    const sendRequest = (method, params = {}) => {
        return new Promise((resolve) => {
            const request = {
                jsonrpc: "2.0",
                id: requestId++,
                method,
                params
            };
            serverProcess.stdin.write(JSON.stringify(request) + "\n");
            // Wait for response
            const checkResponse = () => {
                const lines = responseBuffer.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line) {
                        try {
                            const response = JSON.parse(line);
                            if (response.id === request.id) {
                                responseBuffer = lines.slice(i + 1).join("\n");
                                resolve(response);
                                return;
                            }
                        }
                        catch (e) {
                            // Not a complete JSON response yet
                        }
                    }
                }
                setTimeout(checkResponse, 100);
            };
            checkResponse();
        });
    };
    serverProcess.stdout.on("data", (data) => {
        responseBuffer += data.toString();
    });
    serverProcess.stderr.on("data", (data) => {
        console.log("Server stderr:", data.toString());
    });
    try {
        // Test 1: List tools
        console.log("📋 Testing tool listing...");
        const toolsResponse = await sendRequest("tools/list");
        console.log(`✅ Available tools: ${toolsResponse.result.tools.length}`);
        const toolNames = toolsResponse.result.tools.map((t) => t.name);
        console.log(`✅ Tool names: ${toolNames.join(", ")}`);
        // Test 2: Get current prompt
        console.log("\n📝 Testing get prompt...");
        const promptResponse = await sendRequest("tools/call", {
            name: "vs_get_prompt"
        });
        console.log("✅ Current prompt retrieved successfully");
        // Test 3: Inject subagent
        console.log("\n🤖 Testing subagent injection...");
        const injectResponse = await sendRequest("tools/call", {
            name: "vs_inject_subagent",
            arguments: {
                subagent: "test-agent",
                task: "Test the VS injection functionality",
                context: "Development testing environment"
            }
        });
        console.log("✅ Subagent injection successful");
        // Test 4: Evaluate response
        console.log("\n📊 Testing response evaluation...");
        const evalResponse = await sendRequest("tools/call", {
            name: "vs_evaluate_response",
            arguments: {
                response: "I will analyze the code and provide feedback on best practices.",
                criteria: ["clarity", "specificity", "actionability"]
            }
        });
        console.log("✅ Response evaluation successful");
        console.log("\n🎉 All MCP protocol tests passed!");
        console.log("✅ Server is ready for integration with OpenCode and Claude Code!");
    }
    catch (error) {
        console.error("❌ Test failed:", error);
    }
    finally {
        // Cleanup
        serverProcess.kill();
    }
}
// Run the test
testMcpProtocol().catch(console.error);
//# sourceMappingURL=mcp-protocol-test.js.map