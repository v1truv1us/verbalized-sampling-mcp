import { VSTools } from "./vs-tools.js";

describe("VSTools", () => {
  let vsTools: VSTools;

  beforeEach(() => {
    vsTools = new VSTools();
  });

  it("should have VS tools defined", () => {
    const tools = vsTools.getTools();
    expect(tools).toBeDefined();
    expect(tools.length).toBe(10); // 10 VS tools total
  });

  it("should include vs_inject_subagent tool", () => {
    const tools = vsTools.getTools();
    const subagentTool = tools.find(tool => tool.name === 'vs_inject_subagent');
    expect(subagentTool).toBeDefined();
    expect(subagentTool?.description).toContain('subagent');
  });

  it("should include vs_inject_command tool", () => {
    const tools = vsTools.getTools();
    const commandTool = tools.find(tool => tool.name === 'vs_inject_command');
    expect(commandTool).toBeDefined();
    expect(commandTool?.description).toContain('command');
  });

  it("should include vs_inject_skill tool", () => {
    const tools = vsTools.getTools();
    const skillTool = tools.find(tool => tool.name === 'vs_inject_skill');
    expect(skillTool).toBeDefined();
    expect(skillTool?.description).toContain('skill');
  });

  it("should include configuration tools", () => {
    const tools = vsTools.getTools();
    const configTools = tools.filter(tool => tool.name.startsWith('vs_') && tool.name.includes('prompt'));
    expect(configTools.length).toBe(2); // configure and get prompt
  });

  it("should include evaluation tools", () => {
    const tools = vsTools.getTools();
    const evalTools = tools.filter(tool => tool.name.includes('evaluate') || tool.name.includes('select') || tool.name.includes('validate'));
    expect(evalTools.length).toBe(3); // evaluate, select, validate
  });

  it("should include generation tools", () => {
    const tools = vsTools.getTools();
    const genTools = tools.filter(tool => tool.name.includes('generate') || tool.name.includes('chain'));
    expect(genTools.length).toBe(2); // generate samples, chain evaluation
  });

  it("should have total of 10 tools", () => {
    const tools = vsTools.getTools();
    expect(tools.length).toBe(10);
  });
});