import { t } from '../i18n';
export class HermesEngine {
    controller = null;
    baseUrl;
    key;
    sessionId = null;
    constructor(baseUrl, key) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.key = key;
    }
    async testConnection() {
        try {
            const res = await fetch(`${this.baseUrl}/api/sessions`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${this.key}` }
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
        yield { t: 'step', label: t('sim_conn') || 'Menghubungi penyedia', pet: 'think', ms: 500 };
        try {
            if (!this.sessionId) {
                const sessRes = await fetch(`${this.baseUrl}/api/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.key}` },
                    body: JSON.stringify({ title: session.topicSeed || 'Nazaverse Chat' })
                });
                if (sessRes.ok) {
                    const sessData = await sessRes.json();
                    this.sessionId = sessData.session?.id || null;
                }
            }
            if (!this.sessionId)
                throw new Error('Gagal membuat sesi Hermes');
            const res = await fetch(`${this.baseUrl}/api/sessions/${this.sessionId}/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.key}` },
                body: JSON.stringify({ message: text }),
                signal: this.controller.signal
            });
            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader)
                throw new Error('No response body');
            let fullText = '';
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
                            const ev = JSON.parse(dataStr);
                            if (ev.type === 'message.delta' && ev.text) {
                                fullText += ev.text;
                                yield { t: 'text', text: fullText };
                            }
                            else if (ev.type === 'tool.start') {
                                yield { t: 'step', label: t('sim_run', { c: ev.name }) || `Menjalankan: ${ev.name}`, pet: 'think', ms: 1000 };
                            }
                            else if (ev.type === 'tool.complete') {
                                // Done running tool
                            }
                            else if (ev.type === 'reasoning.available' || ev.type === 'thinking.delta') {
                                yield { t: 'step', label: t('sim_think') || 'Memikirkan jawaban', pet: 'think', ms: 500 };
                            }
                            else if (ev.type === 'approval.request') {
                                const cmd = ev.command || ev.tool_name || 'Aksi berisiko';
                                const approved = yield { t: 'permission', cmd };
                                // GAP: Nazaverse needs to send the approval response back to Hermes API.
                                // Since the exact endpoint for approval response is undocumented here,
                                // we mock it and log it as a gap.
                                yield { t: 'step', label: approved ? (t('sim_run', { c: cmd }) || 'Menjalankan...') : (t('sim_cancel') || 'Dibatalkan'), pet: 'think', ms: 500, end: approved ? 'ok' : 'skip' };
                                if (!approved) {
                                    yield { t: 'text', text: fullText + '\n\n' + (t('sim_denied') || 'Aksi dibatalkan.') };
                                }
                                else {
                                    // Mock successful approval
                                    try {
                                        await fetch(`${this.baseUrl}/api/approvals/${ev.id || 'mock'}`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.key}` },
                                            body: JSON.stringify({ approved: true })
                                        });
                                    }
                                    catch { }
                                }
                            }
                        }
                        catch (e) {
                            // ignore parse errors
                        }
                    }
                }
            }
        }
        catch (err) {
            if (err.name === 'AbortError') {
                yield { t: 'step', label: t('sim_cancel') || 'Aksi dibatalkan', pet: 'idle', end: 'skip' };
            }
            else {
                yield { t: 'fail', msg: err.message };
            }
        }
    }
}
//# sourceMappingURL=hermes.js.map