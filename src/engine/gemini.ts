import { IEngine, EngineEvent, ChatSession, Message } from './engine';
import { Storage } from '../storage';
import { t } from '../i18n';

export class GeminiEngine implements IEngine {
  private controller: AbortController | null = null;
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  abort(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  async *chat(text: string, session: ChatSession): AsyncGenerator<EngineEvent, void, unknown> {
    this.controller = new AbortController();
    
    yield { t: 'step', label: t('gen_t1'), pet: 'think', ms: 500 };
    
    const contents = session.history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    contents.push({ role: 'user', parts: [{ text }] });

    const reqBody: any = { contents, tools: [] };
    if (session.web) {
      reqBody.tools.push({ googleSearchRetrieval: {} });
    }
    reqBody.tools.push({
      functionDeclarations: [{
        name: "generate_document",
        description: "Creates a formatted document/file (markdown or text) to present to the user. Use this when the user asks to write a document, letter, proposal, or report.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING", description: "Title of the document" },
            body: { type: "STRING", description: "The complete content of the document" }
          },
          required: ["title", "body"]
        }
      }]
    });

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${this.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
        signal: this.controller.signal
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new Error(t('sim_fail') || 'Invalid API Key');
        throw new Error(`API Error: ${res.status}`);
      }
      
      yield { t: 'step', label: t('gen_t2'), pet: 'think', ms: 500 };
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      let fullText = '';
      let hasSearched = false;
      let hasSources = false;
      let docTitle = '';
      let docBody = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.candidates && data.candidates[0]) {
                const cand = data.candidates[0];
                if (cand.groundingMetadata) {
                  const gm = cand.groundingMetadata;
                  if (gm.webSearchQueries && !hasSearched) {
                    hasSearched = true;
                    const q = gm.webSearchQueries[0] || '';
                    yield { t: 'step', label: t('sim_search', { q }) || `Mencari di web: ${q}`, pet: 'search', ms: 1000 };
                  }
                  if (gm.groundingChunks && !hasSources) {
                    hasSources = true;
                    const sources = gm.groundingChunks
                      .map((c: any) => c.web?.title || c.web?.uri)
                      .filter(Boolean)
                      .slice(0, 3);
                    if (sources.length) {
                      yield { t: 'sources', list: sources };
                    }
                  }
                }
                if (cand.content?.parts) {
                  for (const part of cand.content.parts) {
                    if (part.functionCall && part.functionCall.name === 'generate_document') {
                      const args = part.functionCall.args || {};
                      if (args.title) docTitle = args.title;
                      if (args.body) docBody = args.body;
                    } else if (part.text) {
                      fullText += part.text;
                      yield { t: 'text', text: fullText };
                    }
                  }
                }
              }
            } catch (e) {
              // ignore parse errors for partial chunks if any
            }
          }
        }
      }
      
      if (docBody) {
        yield { t: 'step', label: t('sim_write') || 'Menulis dokumen', pet: 'doc', ms: 1000 };
        yield { t: 'doc', title: docTitle || 'Document', body: docBody };
        if (!fullText) {
          yield { t: 'text', text: t('sim_docr') || 'Dokumennya sudah siap. Kamu bisa menyalinnya.' };
        }
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        yield { t: 'step', label: t('sim_cancel'), pet: 'idle', end: 'skip' };
      } else {
        yield { t: 'fail', msg: err.message };
      }
    }
  }
}
