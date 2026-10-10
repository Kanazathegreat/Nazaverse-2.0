export type EngineEvent = 
  | { t: 'step', label: string, pet: string, ms?: number, end?: string }
  | { t: 'text', text: string }
  | { t: 'doc', title: string, body: string }
  | { t: 'sources', list: string[] }
  | { t: 'code', name: string, body: string }
  | { t: 'fail', msg: string }
  | { t: 'permission', cmd: string };

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  topicSeed: string;
  history: Message[];
  web?: boolean;
}

export interface IEngine {
  chat(text: string, session: ChatSession): AsyncGenerator<EngineEvent, void, unknown>;
  testConnection(): Promise<boolean>;
  abort(): void;
}
