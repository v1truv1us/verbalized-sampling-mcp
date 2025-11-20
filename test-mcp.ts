#!/usr/bin/env node

// Manual MCP Protocol Test
// This script simulates MCP client messages to test the server

import { spawn } from 'child_process';
import { Readable, Writable } from 'stream';

class MockMCPClient {
  private serverProcess: any;
  private inputStream: Writable;
  private outputStream: Readable;

  constructor() {
    this.inputStream = new Writable({
      write: (chunk, encoding, callback) => {
        // Send data to server
        this.serverProcess.stdin.write(chunk, encoding, callback);
      }
    });

    this.outputStream = new Readable({
      read() {
        // This will be filled by server output
      }
    });
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('node', ['dist/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.serverProcess.stdout.on('data', (data: Buffer) => {
        const message = data.toString();
        console.log('Server output:', message);
        this.outputStream.push(data);
      });

      this.serverProcess.stderr.on('data', (data: Buffer) => {
        console.log('Server stderr:', data.toString());
      });

      this.serverProcess.on('error', reject);
      this.serverProcess.on('close', (code: number) => {
        console.log(`Server process exited with code ${code}`);
      });

      // Wait a bit for server to start
      setTimeout(() => {
        console.log('Server started successfully');
        resolve(true);
      }, 1000);
    });
  }

  async sendMessage(message: any) {
    const jsonMessage = JSON.stringify(message) + '\n';
    console.log('Sending message:', jsonMessage.trim());
    this.inputStream.write(jsonMessage);
  }

  async testListTools() {
    console.log('\n=== Testing list_tools ===');
    await this.sendMessage({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list"
    });
  }

  async testCreatePrompt() {
    console.log('\n=== Testing vs_create_prompt ===');
    await this.sendMessage({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "vs_create_prompt",
        arguments: {
          topic: "Write a short story about a robot learning to paint",
          model_name: "claude-sonnet-4-5"
        }
      }
    });
  }

  async testRecommendParams() {
    console.log('\n=== Testing vs_recommend_params ===');
    await this.sendMessage({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "vs_recommend_params",
        arguments: {
          model_name: "gpt-5"
        }
      }
    });
  }

  async testProcessResponse() {
    console.log('\n=== Testing vs_process_response ===');
    const mockResponse = `<response>
<text>A robot dipped its brush in blue paint, creating swirling patterns that danced across the canvas.</text>
<probability>0.05</probability>
</response>
<response>
<text>The machine learned to mix colors, producing art that surprised even its creators.</text>
<probability>0.08</probability>
</response>`;

    await this.sendMessage({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "vs_process_response",
        arguments: {
          llm_output: mockResponse,
          tau: 0.1
        }
      }
    });
  }

  async stop() {
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
  }
}

// Run the test
async function runTest() {
  const client = new MockMCPClient();

  try {
    await client.start();

    // Test all tools
    await client.testListTools();
    await new Promise(resolve => setTimeout(resolve, 500));

    await client.testCreatePrompt();
    await new Promise(resolve => setTimeout(resolve, 500));

    await client.testRecommendParams();
    await new Promise(resolve => setTimeout(resolve, 500));

    await client.testProcessResponse();
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('\n=== All tests completed successfully! ===');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await client.stop();
  }
}

runTest().catch(console.error);
