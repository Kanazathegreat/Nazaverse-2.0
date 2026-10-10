import { IEngine, EngineEvent, ChatSession } from './engine';
export declare class GeminiEngine implements IEngine {
    private controller;
    private key;
    constructor(key: string);
    testConnection(): Promise<boolean>;
    abort(): void;
    chat(text: string, session: ChatSession): AsyncGenerator<EngineEvent, void, unknown>;
}
//# sourceMappingURL=gemini.d.ts.map