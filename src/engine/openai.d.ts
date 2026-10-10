import { IEngine, EngineEvent, ChatSession } from './engine';
export declare class OpenAICompatEngine implements IEngine {
    private controller;
    private key;
    private baseUrl;
    private model;
    constructor(key: string, baseUrl?: string, model?: string);
    testConnection(): Promise<boolean>;
    abort(): void;
    chat(text: string, session: ChatSession): AsyncGenerator<EngineEvent, void, unknown>;
}
//# sourceMappingURL=openai.d.ts.map