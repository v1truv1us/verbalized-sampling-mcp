import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class VSTools {
    private sampler;
    private tools;
    getTools(): Tool[];
    handleTool(name: string, args: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    private createPrompt;
    private processResponse;
    private recommendParams;
}
//# sourceMappingURL=vs-tools.d.ts.map