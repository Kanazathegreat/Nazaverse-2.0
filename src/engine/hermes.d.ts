import { IEngine, EngineEvent, ChatSession } from './engine';
export declare class HermesEngine implements IEngine {
    private controller;
    private baseUrl;
    private key;
    private sessionId;
    constructor(baseUrl: string, key: string);
    testConnection(): Promise<boolean>;
    abort(): void;
    chat(text: string, session: ChatSession): AsyncGenerator<EngineEvent, void, unknown>;
}
//# sourceMappingURL=hermes.d.ts.map