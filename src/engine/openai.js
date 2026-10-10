import { t } from '../i18n';
export class OpenAICompatEngine {
    controller = null;
    key;
    baseUrl;
    model;
    constructor(key, baseUrl = 'https://api.openai.com/v1', model = 'gpt-4o-mini') {
        this.key = key;
        this.baseUrl = baseUrl;
        this.model = model;
    }
    async testConnection() {
        try {
            const res = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.key}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: 'hi' }],
                    max_tokens: 1
                })
            });
            return res.ok;
        }
        catch {
            return false;
        }
    }
    abort() {
        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }
    }
    async *chat(text, session) {
        this.controller = new AbortController();
        yield { t: 'step', label: t('gen_t1'), pet: 'think', ms: 500 };
        const messages = session.history.map(m => ({
            role: m.role,
            content: m.content
        }));
        messages.push({ role: 'user', content: text });
        const reqBody = {
            model: this.model,
            messages,
            stream: true,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "generate_document",
                        description: "Creates a formatted document/file (markdown or text) to present to the user. Use this when the user asks to write a document, letter, proposal, or report.",
                        parameters: {
                            type: "object",
                            properties: {
                                title: { type: "string", description: "Title of the document" },
                                body: { type: "string", description: "The complete content of the document" }
                            },
                            required: ["title", "body"]
                        }
                    }
                }
            ]
        };
        try {
            const res = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.key}`
                },
                body: JSON.stringify(reqBody),
                signal: this.controller.signal
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403)
                    throw new Error(t('sim_fail') || 'Invalid API Key');
                throw new Error(`API Error: ${res.status}`);
            }
            yield { t: 'step', label: t('gen_t2'), pet: 'think', ms: 500 };
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader)
                throw new Error('No response body');
            let fullText = '';
            let toolArgs = '';
            let isDoc = false;
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.trim().startsWith('data: ')) {
                        const dataStr = line.trim().slice(6);
                        if (dataStr === '[DONE]')
                            break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.choices && data.choices[0].delta) {
                                const delta = data.choices[0].delta;
                                if (delta.tool_calls && delta.tool_calls[0]) {
                                    const tc = delta.tool_calls[0];
                                    if (tc.function?.name === 'generate_document')
                                        isDoc = true;
                                    if (tc.function?.arguments)
                                        toolArgs += tc.function.arguments;
                                }
                                if (delta.content) {
                                    fullText += delta.content;
                                    yield { t: 'text', text: fullText };
                                }
                            }
                        }
                        catch (e) { }
                    }
                }
            }
            if (isDoc && toolArgs) {
                try {
                    const args = JSON.parse(toolArgs);
                    if (args.title && args.body) {
                        yield { t: 'step', label: t('sim_write') || 'Menulis dokumen', pet: 'doc', ms: 1000 };
                        yield { t: 'doc', title: args.title, body: args.body };
                        if (!fullText) {
                            yield { t: 'text', text: t('sim_docr') || 'Dokumennya sudah siap. Kamu bisa menyalinnya.' };
                        }
                    }
                }
                catch (e) {
                    // invalid json in tool args
                }
            }
        }
        catch (err) {
            if (err.name === 'AbortError') {
                yield { t: 'step', label: t('sim_cancel'), pet: 'idle', end: 'skip' };
            }
            else {
                yield { t: 'fail', msg: err.message };
            }
        }
    }
}
//# sourceMappingURL=openai.js.map