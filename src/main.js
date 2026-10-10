import { lang, setLang, t, L } from './i18n';
import { S, IDX, W, setW } from './state';
import { $, sleep, esc, el } from './utils';
import { pet, getLine, applySkin, SKINS } from './pet/pet';
import { initSky, setWarp, setLit, kOf } from './sky/sky';
import { GEN_SIM, TOPICS, PROV, CMDS, curTopic, tName } from './config';
function cSvg(k) {
    const P = k.pts.map((p) => [4 + p[0] * 92, 4 + p[1] * 52]);
    return k.edges.map((e) => `<line x1="${P[e[0]][0]}" y1="${P[e[0]][1]}" x2="${P[e[1]][0]}" y2="${P[e[1]][1]}"/>`).join('') + P.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.2"/>`).join('');
}
function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i]').forEach(e => { e.textContent = t(e.dataset.i); });
    document.querySelectorAll('[data-ph]').forEach(e => { e.placeholder = t(e.dataset.ph); });
    document.querySelectorAll('[data-t]').forEach(e => { e.title = t(e.dataset.t); e.setAttribute('aria-label', t(e.dataset.t)); });
    document.querySelectorAll('[data-l]').forEach(b => { b.classList.toggle('on', b.dataset.l === lang); });
    $('#wp').textContent = S.sky ? t('sky_on') : t('sky_off');
    $('#vw').textContent = S.focus ? t('v_focus') : t('v_stage');
    $('#stt').textContent = document.body.classList.contains('working') ? $('#stt').textContent : t('idle');
    renderRail();
    renderHead();
    renderEmpty();
    plate();
    if (W)
        renderWizard();
    if ($('#sett').classList.contains('open'))
        renderSett();
}
function plate() { $('#plate').textContent = S.awake ? `${S.pet.name.toLowerCase()} / ${t('p_' + S.pet.persona)}` : t('plate_locked'); }
function renderHead() {
    const tp = curTopic();
    const tk = tp.tokens ? ` (~${tp.tokens} tokens)` : '';
    $('#tn').textContent = tName(tp) + tk;
    $('#app').dataset.st = S.station;
}
function renderEmpty() {
    const tp = curTopic();
    $('#eh').textContent = t('empty_h');
    $('#ep').textContent = t('topic_line', { n: tName(tp).toLowerCase(), i: L(tp.ins).toLowerCase() });
    const c = $('#chips');
    c.innerHTML = '';
    (tp.chips ? L(tp.chips) : []).forEach((x) => { const b = el('button', 'sg'); b.textContent = x; c.append(b); });
}
function renderRail() {
    $('#stations').innerHTML = ['chat', 'hermes'].map(k => `<button data-st="${k}" class="${S.station === k ? 'on' : ''}">${t('st_' + k)}</button>`).join('');
    const w = $('#tops');
    w.innerHTML = '';
    TOPICS[S.station].forEach((tp, i) => {
        const b = el('button', 'tp' + (i === IDX[S.station] ? ' on' : ''), '<svg viewBox="0 0 100 60" aria-hidden="true">' + cSvg(kOf(tp)) + '</svg><span><b></b><small></small></span>');
        b.querySelector('b').textContent = tName(tp);
        b.querySelector('small').textContent = L(tp.ins);
        b.onclick = () => pickTopic(i);
        w.append(b);
    });
    const f = $('#foot'), ok = S.connected[S.station];
    const planet = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(-24 12 12)"><ellipse cx="12" cy="12" rx="10" ry="3.8" opacity=".55"/><circle class="f a2" cx="0" cy="0" r="1.5"><animateMotion dur="5s" repeatCount="indefinite" path="M2 12a10 3.8 0 1 0 20 0a10 3.8 0 1 0 -20 0"/></circle></g><circle class="f" cx="12" cy="12" r="3.2"/></svg>';
    f.className = 'foot' + (ok ? '' : ' off');
    f.innerHTML = planet + '<span>' + (ok ? (S.station === 'hermes' ? `<b>${t('conn_hermes_ok')}</b><br>${t('conn_hermes_sub')}` : `<b>${t('conn_chat_ok', { p: t(PROV[S.provider || 'gemini'][0]) })}</b><br>${t('conn_chat_sub')}`) : `<b>${t('conn_none')}</b><br>${t('conn_none_sub')}`) + '</span>';
}
function pickTopic(i) {
    if (S.busy)
        return;
    const cur = curTopic();
    cur.log = $('#log').innerHTML;
    cur.title = $('#ttl').textContent;
    IDX[S.station] = i;
    const tp = curTopic();
    $('#log').innerHTML = tp.log || '';
    $('#ttl').textContent = tp.title || t('new_session');
    $('#empty').hidden = !!tp.log;
    renderRail();
    renderHead();
    renderEmpty();
    closeRail();
    const feed = $('#feed');
    feed.scrollTop = feed.scrollHeight;
}
function switchStation(st) {
    if (S.busy || st === S.station)
        return;
    const cur = curTopic();
    cur.log = $('#log').innerHTML;
    cur.title = $('#ttl').textContent;
    S.station = st;
    setW(null);
    const tp = curTopic();
    $('#log').innerHTML = tp.log || '';
    $('#ttl').textContent = tp.title || t('new_session');
    $('#empty').hidden = !!tp.log;
    renderRail();
    renderHead();
    renderEmpty();
    if (!S.connected[st])
        startConnect(st);
    else
        showView();
    closeRail();
}
$('#stations').onclick = e => { const b = e.target.closest('button[data-st]'); if (b)
    switchStation(b.dataset.st); };
$('#addt').onclick = () => { const n = $('#nt'); n.hidden = !n.hidden; if (!n.hidden) {
    $('#ntn').focus();
    $('#ntn').dispatchEvent(new Event('input'));
} };
$('#ntn').oninput = () => { $('#npv').innerHTML = cSvg(kOf({ seed: $('#ntn').value || 'new topic' })); };
$('#mk').onclick = () => {
    const n = $('#ntn').value.trim();
    if (!n || S.busy)
        return;
    const ins = $('#nti').value.trim() || (lang === 'id' ? 'Topik buatanmu sendiri' : 'Your own topic');
    const slug = n.toLowerCase().replace(/\s+/g, '-');
    TOPICS[S.station].push({ seed: n, name: n, ins: ins, chips: { id: ['Mulai tugas pertama'], en: ['Start the first task'] }, sim: Object.assign({}, GEN_SIM, { cmd: 'save result to ~/Nazaverse/' + slug + '/result.md' }) });
    $('#ntn').value = '';
    $('#nti').value = '';
    $('#nt').hidden = true;
    pickTopic(TOPICS[S.station].length - 1);
};
$('#foot').onclick = () => { if (!S.connected[S.station])
    startConnect(S.station);
else
    openSett('conn'); };
function closeRail() { $('#rail').classList.remove('open'); $('#scrim').classList.remove('on'); }
$('#menu').onclick = () => { $('#rail').classList.add('open'); $('#scrim').classList.add('on'); };
$('#scrim').onclick = closeRail;
import { Storage } from './storage';
function showView() { $('#chatcol').classList.toggle('wizard', !!W); $('#wiz').innerHTML = ''; if (W)
    renderWizard(); }
function startConnect(st) {
    const awakeBefore = S.awake;
    let key = Storage.get(st === 'chat' ? 'api_key' : 'h_key') || '';
    let prov = Storage.get('api_prov') || S.provider || 'gemini';
    let addr = Storage.get('h_addr') || 'http://127.0.0.1:8642';
    if (key) {
        S.connected[st] = true;
        if (st === 'chat')
            S.provider = prov;
        renderRail();
        if (!awakeBefore)
            pet.wake();
        return;
    }
    setW({ station: st, step: st === 'chat' ? 'provider' : 'hermes', awakeBefore, prov, key, addr, hkey: key, show: false, testing: false, err: '', name: S.pet.name, persona: S.pet.persona, custom: S.pet.custom });
    showView();
}
function seqOf() { const base = W.station === 'chat' ? ['provider', 'key'] : ['hermes']; return W.awakeBefore ? base : base.concat(['persona']); }
function stepLabel() { const q = seqOf(), i = q.indexOf(W.step); return i < 0 ? '' : `<div class="stp">${t('w_step', { a: (i + 1).toString(), b: q.length.toString() })}</div>`; }
function renderWizard() {
    const z = $('#wiz');
    if (!W) {
        z.innerHTML = '';
        return;
    }
    let h = '';
    if (W.step === 'provider') {
        h = `${stepLabel()}<h2>${t('w_provider_h')}</h2><p>${t('w_provider_p')}</p>` + Object.keys(PROV).map(k => `<button class="prow ${W.prov === k ? 'on' : ''}" data-act="prov" data-v="${k}"><b style="font-weight:500">${t(PROV[k][0])}</b><small>${t(PROV[k][1])}</small></button>`).join('') +
            `<div class="acts"><button class="btn pri" data-act="next" ${W.prov ? '' : 'disabled'}>${t('w_next')}</button></div>`;
    }
    else if (W.step === 'key') {
        h = `${stepLabel()}<h2>${t('w_key_h')}</h2><p>${t(PROV[W.prov][0])}</p>
    <div class="keyrow"><label class="fld"><span>API key</span><input id="wkey" type="${W.show ? 'text' : 'password'}" autocomplete="off" spellcheck="false" placeholder="${t('w_key_ph')}" value="${esc(W.key)}"></label><button class="lnk" style="margin:0 0 10px" data-act="show"><span>${W.show ? t('w_hide') : t('w_show')}</span></button></div>
    <div class="note">${t('w_key_note')}</div>
    <details><summary>${t('w_howto')}</summary><ol><li>${t('w_how1')}</li><li>${t('w_how2')}</li><li>${t('w_how3')}</li><li>${t('w_how4')}</li></ol></details>
    ${W.err ? `<div class="errl">${W.err}</div>` : ''}
    <div class="acts"><button class="btn pri" data-act="test" ${W.testing ? 'disabled' : ''}>${W.testing ? t('w_testing') + ' <span class="dots3"><i></i><i></i><i></i></span>' : t('w_test')}</button><button class="lnk" style="margin:0" data-act="back"><span>${t('w_back')}</span></button></div>`;
    }
    else if (W.step === 'hermes') {
        h = `${stepLabel()}<h2>${t('w_hermes_h')}</h2><p>${t('w_hermes_p')}</p>
    <label class="fld"><span>${t('w_addr')}</span><input id="waddr" autocomplete="off" spellcheck="false" value="${esc(W.addr)}"></label>
    <label class="fld"><span>${t('w_hkey')}</span><input id="whkey" type="password" autocomplete="off" value="${esc(W.hkey)}"></label>
    ${W.err ? `<div class="errl">${W.err}</div>` : ''}
    <div class="acts"><button class="btn pri" data-act="test" ${W.testing ? 'disabled' : ''}>${W.testing ? t('w_testing') + ' <span class="dots3"><i></i><i></i><i></i></span>' : t('w_test')}</button></div>`;
    }
    else if (W.step === 'wake') {
        h = `<div class="stp">${t('w_ok')}</div><h2>${t('w_wake_h')}</h2><p>${t('w_wake_p')}</p><span class="dots3"><i></i><i></i><i></i></span>`;
    }
    else if (W.step === 'persona') {
        h = `${stepLabel()}<h2>${t('w_persona_h')}</h2><p>${t('w_persona_p')}</p>
    <label class="fld"><span>${t('w_name')}</span><input id="wname" maxlength="14" value="${esc(W.name)}"></label>
    <div class="pers">${['cheerful', 'calm', 'mischief'].map(k => `<button class="prow ${W.persona === k ? 'on' : ''}" data-act="persona" data-v="${k}"><b style="font-weight:500">${t('p_' + k)}</b><small>${t('p_' + k + '_d')}</small></button>`).join('')}</div>
    <label class="fld"><span>${t('w_custom')}</span><textarea id="wcustom" rows="2" maxlength="160" placeholder="${t('w_custom_ph')}">${esc(W.custom)}</textarea></label>
    <div class="acts"><button class="btn pri" data-act="finish">${t('w_start')}</button></div>`;
    }
    z.innerHTML = '<div class="wz">' + h + '</div>';
}
$('#wiz').addEventListener('input', e => {
    if (!W)
        return;
    const target = e.target;
    if (target.id === 'wkey')
        W.key = target.value;
    if (target.id === 'waddr')
        W.addr = target.value;
    if (target.id === 'whkey')
        W.hkey = target.value;
    if (target.id === 'wname') {
        W.name = target.value;
    }
    if (target.id === 'wcustom')
        W.custom = target.value;
});
$('#wiz').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || !W)
        return;
    const a = b.dataset.act;
    if (a === 'prov') {
        W.prov = b.dataset.v;
        renderWizard();
    }
    else if (a === 'next') {
        if (W.prov) {
            W.step = 'key';
            W.err = '';
            renderWizard();
            const k = $('#wkey');
            if (k)
                k.focus();
        }
    }
    else if (a === 'back') {
        W.step = 'provider';
        W.err = '';
        renderWizard();
    }
    else if (a === 'show') {
        W.show = !W.show;
        renderWizard();
        const k = $('#wkey');
        if (k)
            k.focus();
    }
    else if (a === 'persona') {
        W.persona = b.dataset.v;
        renderWizard();
    }
    else if (a === 'test') {
        if (W.testing)
            return;
        W.err = '';
        W.testing = true;
        renderWizard();
        await sleep(1300);
        if (!W)
            return;
        W.testing = false;
        const ok = W.station === 'chat' ? W.key.trim().length >= 8 : (W.addr.trim() && W.hkey.trim().length >= 1);
        if (!ok) {
            W.err = W.station === 'chat' ? t('w_err') : t('w_herr');
            renderWizard();
            return;
        }
        S.connected[W.station] = true;
        if (W.station === 'chat') {
            S.provider = W.prov;
            Storage.set('api_key', W.key.trim());
            Storage.set('api_prov', W.prov);
        }
        else {
            Storage.set('h_key', W.hkey.trim());
            Storage.set('h_addr', W.addr.trim());
        }
        renderRail();
        if (W.awakeBefore) {
            finishConnect(false);
        }
        else {
            W.step = 'wake';
            renderWizard();
            pet.wake();
            await sleep(2600);
            if (W) {
                W.step = 'persona';
                renderWizard();
                plate();
            }
        }
    }
    else if (a === 'finish') {
        S.pet.name = (W.name.trim() || 'Nova');
        S.pet.persona = W.persona;
        S.pet.custom = W.custom.trim();
        finishConnect(true);
    }
});
function finishConnect(greet) { setW(null); showView(); plate(); renderRail(); renderEmpty(); if (greet)
    pet.say(getLine('greet'), 5200);
else
    pet.say(getLine('greet'), 3800); }
async function* simulate(st, text, tp) {
    if (/^(error|gagal|fail)/i.test(text)) {
        yield { t: 'step', label: t('sim_conn'), pet: 'think', ms: 900 };
        yield { t: 'fail', msg: t('sim_fail') };
        return;
    }
    if (st === 'hermes') {
        const sm = tp.sim || GEN_SIM;
        for (const s of sm.steps)
            yield { t: 'step', label: L(s.k), pet: s.p, ms: 1300 };
        const ok = yield { t: 'permission', cmd: sm.cmd };
        yield { t: 'step', label: ok ? t('sim_run', { c: sm.cmd }) : t('sim_cancel'), pet: 'think', ms: ok ? 1400 : 400, end: ok ? 'ok' : 'skip' };
        yield { t: 'text', text: ok ? L(sm.done) : t('sim_denied') };
        if (ok)
            yield { t: 'code', name: sm.file, body: L(sm.out) };
        return;
    }
    const wantSearch = S.web && /cari|search|berita|news|terbaru|latest|bandingkan|compare/i.test(text);
    const wantDoc = /dokumen|document|surat|proposal|laporan|report|draf|draft/i.test(text);
    yield { t: 'step', label: t('sim_think'), pet: 'think', ms: 900 };
    if (wantSearch) {
        yield { t: 'step', label: t('sim_search', { q: text.slice(0, 30) }), pet: 'search', ms: 1700 };
        yield { t: 'step', label: t('sim_read'), pet: 'search', ms: 1300 };
        yield { t: 'sources', list: ['sumber-contoh-1.example', 'sumber-contoh-2.example', 'sumber-contoh-3.example'] };
    }
    if (wantDoc) {
        yield { t: 'step', label: t('sim_outline'), pet: 'think', ms: 900 };
        yield { t: 'step', label: t('sim_write'), pet: 'doc', ms: 2000 };
    }
    yield { t: 'text', text: wantDoc ? t('sim_docr') : (wantSearch ? t('sim_web') : t('sim_plain')) };
    if (wantDoc)
        yield { t: 'doc', title: text.slice(0, 48), body: t('doc_body') };
}
const feed = $('#feed'), log = $('#log'), inp = $('#inp'), sendB = $('#send'), menuC = $('#menuC'), stateEl = $('#stt');
const down = () => { feed.scrollTop = feed.scrollHeight; };
const clock = () => new Date().toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
function ent(cls, role, text) {
    const e = el('div', 'ent ' + cls, '<div class="g"><time>' + clock() + '</time><span></span></div><div class="body"></div>');
    e.querySelector('.g span').textContent = role;
    if (text) {
        const p = el('p');
        p.textContent = text;
        e.querySelector('.body').append(p);
    }
    log.append(e);
    down();
    return e;
}
async function stepRow(steps, label, ms, end) { const s = el('div', 'step run'); s.textContent = label; steps.append(s); down(); await sleep(ms); s.className = 'step ' + (end || 'ok'); }
function askCard(body, cmd) {
    return new Promise(res => {
        const c = el('div', 'ask', '<p>' + t('perm') + '</p><code></code><div class="row"><button class="btn pri go">' + t('allow') + '</button><button class="btn no">' + t('deny') + '</button></div>');
        c.querySelector('code').textContent = cmd;
        const fin = (ok) => { c.classList.add('done'); c.querySelector('p').textContent = ok ? t('allowed') : t('denied'); c.querySelector('.row').remove(); res(ok); };
        c.querySelector('.go').onclick = () => fin(true);
        c.querySelector('.no').onclick = () => fin(false);
        body.append(c);
        down();
    });
}
async function typeIn(p, text) { p.classList.add('live'); for (const w of text.split(' ')) {
    p.textContent += w + ' ';
    down();
    await sleep(30);
} p.classList.remove('live'); }
function copyBtn(btn, txt) {
    btn.onclick = async () => {
        try {
            await navigator.clipboard.writeText(txt);
        }
        catch (e) {
            const r = document.createRange();
            const pre = btn.closest('.code').querySelector('pre');
            r.selectNodeContents(pre);
            const s = getSelection();
            s.removeAllRanges();
            s.addRange(r);
        }
        btn.textContent = t('copied');
        setTimeout(() => btn.textContent = t('copy'), 1400);
    };
}
function codeBlock(body, name, txt, title) {
    const b = el('div', 'code', '<div class="ch"><span></span><div style="display:flex;gap:4px"><button class="save">' + (lang === 'id' ? 'Simpan' : 'Save') + '</button><button class="copy">' + t('copy') + '</button></div></div>' + (title ? '<div class="dt"></div>' : '') + '<pre></pre>');
    b.querySelector('.ch span').textContent = name;
    b.querySelector('pre').textContent = txt;
    if (title)
        b.querySelector('.dt').textContent = title;
    copyBtn(b.querySelector('.copy'), txt);
    b.querySelector('.save').onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([txt], { type: 'text/markdown' }));
        a.download = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.md' : name;
        a.click();
    };
    body.append(b);
    down();
}
let t0 = 0, tm;
function work(on) {
    document.body.classList.toggle('working', on);
    setWarp(on && S.sky ? 1 : 0);
    clearInterval(tm);
    if (on) {
        t0 = Date.now();
        stateEl.textContent = t('working') + ' 00:00';
        tm = setInterval(() => { const d = Math.floor((Date.now() - t0) / 1000); stateEl.textContent = t('working') + ' ' + String(Math.floor(d / 60)).padStart(2, '0') + ':' + String(d % 60).padStart(2, '0'); }, 1000);
    }
    else
        stateEl.textContent = t('idle');
}
import { GeminiEngine } from './engine/gemini';
import { OpenAICompatEngine } from './engine/openai';
import { HermesEngine } from './engine/hermes';
let activeEngine = null;
async function send(text) {
    text = text.trim();
    if (!text || W)
        return;
    if (text === '/stop') {
        if (activeEngine)
            activeEngine.abort();
        return;
    }
    if (S.busy)
        return;
    if (text === '/persona') {
        openSett('pet');
        return;
    }
    if (text === '/clear') {
        newSession();
        return;
    }
    const st = S.station, tp = curTopic();
    S.busy = true;
    sendB.disabled = true;
    $('#empty').hidden = true;
    $('#ttl').textContent = text.slice(0, 44);
    work(true);
    setLit(0);
    ent('u', t('you'), text);
    const a = ent('a', st === 'hermes' ? 'hermes' : S.pet.name.toLowerCase()), body = a.querySelector('.body'), steps = el('div', 'steps');
    body.append(steps);
    pet.set('think', { line: getLine('think') });
    const apiKey = Storage.get(st === 'chat' ? 'api_key' : 'h_key') || '';
    if (st === 'chat') {
        if (S.provider === 'gemini')
            activeEngine = new GeminiEngine(apiKey);
        else if (S.provider === 'openai')
            activeEngine = new OpenAICompatEngine(apiKey, 'https://api.openai.com/v1', 'gpt-4o-mini');
        else if (S.provider === 'router')
            activeEngine = new OpenAICompatEngine(apiKey, 'https://openrouter.ai/api/v1', 'meta-llama/llama-3-8b-instruct:free');
        else
            activeEngine = new GeminiEngine(apiKey);
    }
    else {
        activeEngine = new HermesEngine(Storage.get('h_addr') || 'http://127.0.0.1:8642', apiKey);
    }
    const gen = activeEngine.chat(text, { topicSeed: tp.seed, history: tp.history, web: S.web });
    let r = await gen.next();
    let n = 0, failed = false;
    let hasTextResponse = false;
    while (!r.done) {
        const ev = r.value;
        let back;
        if (ev.t === 'step') {
            pet.set(ev.pet, { line: getLine(ev.pet) });
            await stepRow(steps, ev.label, ev.ms || 1000, ev.end);
            n++;
            setLit(1 - 1 / (n + 1.4));
        }
        else if (ev.t === 'permission') {
            back = S.mode === 'ask' ? await askCard(body, ev.cmd) : true;
        }
        else if (ev.t === 'sources') {
            const d = el('div', 'srcs');
            d.innerHTML = '<span>' + t('src') + '</span>' + ev.list.map(() => '<span></span>').join('');
            [...d.children].slice(1).forEach((s, i) => s.textContent = ev.list[i]);
            body.append(d);
        }
        else if (ev.t === 'text') {
            let p = body.querySelector('.ans.live');
            if (!p) {
                p = el('p', 'ans live');
                body.append(p);
            }
            p.textContent = ev.text;
            down();
            hasTextResponse = true;
            pet.set('talk');
        }
        else if (ev.t === 'code') {
            codeBlock(body, ev.name, ev.body);
        }
        else if (ev.t === 'doc') {
            codeBlock(body, 'document.md', ev.body, ev.title);
        }
        else if (ev.t === 'fail') {
            failed = true;
            const p = el('p', 'ans err');
            p.textContent = ev.msg;
            body.append(p);
            pet.set('error', { ms: 3200, line: getLine('error') });
        }
        r = await gen.next(back);
    }
    if (hasTextResponse) {
        const p = body.querySelector('.ans.live');
        if (p)
            p.classList.remove('live');
        const replyTxt = p?.textContent || '';
        // Save to history
        tp.history.push({ role: 'user', content: text });
        tp.history.push({ role: 'assistant', content: replyTxt });
        // Rough estimate: ~4 chars per token
        tp.tokens = (tp.tokens || 0) + Math.ceil((text.length + replyTxt.length) / 4);
        renderHead();
    }
    setLit(1);
    work(false);
    setTimeout(() => { if (!S.busy)
        setLit(0); }, 3400);
    if (!failed)
        pet.set('done', { ms: 2400, line: getLine('done') });
    S.busy = false;
    sendB.disabled = false;
    inp.focus();
}
function newSession() { if (S.busy)
    return; const tp = curTopic(); tp.log = ''; tp.title = ''; log.innerHTML = ''; $('#empty').hidden = false; $('#ttl').textContent = t('new_session'); }
inp.oninput = () => {
    inp.style.height = 'auto';
    inp.style.height = Math.min(inp.scrollHeight, 160) + 'px';
    const v = inp.value;
    menuC.innerHTML = '';
    if (v.startsWith('/') && !v.includes(' ')) {
        CMDS[S.station].filter(c => c[0].startsWith(v)).forEach(c => { const b = el('button', '', '<b></b><span></span>'); b.firstChild.textContent = c[0]; b.lastChild.textContent = t(c[1]); b.onclick = () => { inp.value = c[0] + ' '; menuC.hidden = true; inp.focus(); }; menuC.append(b); });
        menuC.hidden = !menuC.children.length;
    }
    else
        menuC.hidden = true;
};
function go() { const v = inp.value; inp.value = ''; inp.style.height = 'auto'; menuC.hidden = true; send(v); }
sendB.onclick = go;
inp.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    go();
} };
$('#chips').onclick = e => { if (e.target.classList.contains('sg'))
    send(e.target.textContent); };
$('#att').onclick = () => { inp.value = '/doc '; inp.dispatchEvent(new Event('input')); inp.focus(); };
$('#webT').onclick = () => {
    if (S.station === 'chat' && S.provider !== 'gemini' && S.provider !== 'router') {
        alert(lang === 'id' ? 'Provider ini belum mendukung pencarian web bawaan.' : 'This provider does not support built-in web search yet.');
        S.web = false;
        $('#webT').classList.remove('on');
        return;
    }
    S.web = !S.web;
    $('#webT').classList.toggle('on', S.web);
};
$('#seg').onclick = e => {
    const b = e.target.closest('button');
    if (!b)
        return;
    if (b.dataset.m) {
        S.mode = b.dataset.m;
        document.querySelectorAll('#seg [data-m]').forEach(x => x.classList.toggle('on', x === b));
    }
    else if (b.dataset.l) {
        setLang(b.dataset.l);
        applyLang();
    }
    else if (b.id === 'wp') {
        S.sky = !S.sky;
        b.classList.toggle('on', S.sky);
        b.textContent = S.sky ? t('sky_on') : t('sky_off');
        setWarp(S.sky && document.body.classList.contains('working') ? 1 : 0);
    }
    else if (b.id === 'vw') {
        S.focus = !S.focus;
        $('#app').classList.toggle('focus', S.focus);
        b.textContent = S.focus ? t('v_focus') : t('v_stage');
        b.classList.toggle('on', S.focus);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
    }
    else if (b.id === 'gear') {
        openSett();
    }
};
function buildPrompt() { const P = S.pet; return t('prompt_tpl', { n: P.name, p: t('p_' + P.persona), c: P.custom ? P.custom + ' ' : '' }); }
function openSett(sec) { renderSett(); $('#sett').classList.add('open'); if (sec) {
    const e = $('#s-' + sec);
    if (e)
        setTimeout(() => e.scrollIntoView({ block: 'start', behavior: 'smooth' }), 60);
} }
function closeSett() { $('#sett').classList.remove('open'); }
$('#sclose').onclick = closeSett;
window.addEventListener('keydown', e => { if (e.key === 'Escape')
    closeSett(); });
import { Billing } from './billing';
function renderSett() {
    const P = S.pet, labStates = ['sleep', 'wake', 'idle', 'think', 'talk', 'search', 'vision', 'doc', 'image', 'done', 'error', 'pet'];
    $('#settBody').innerHTML = `
  <section id="s-lang"><h3>${t('s_lang')}</h3><div class="opts"><button class="opt ${lang === 'id' ? 'on' : ''}" data-act="lang" data-v="id">Bahasa Indonesia</button><button class="opt ${lang === 'en' ? 'on' : ''}" data-act="lang" data-v="en">English</button></div></section>
  <section id="s-pet"><h3>${t('s_pet')}</h3>
   <label class="fld"><span>${t('w_name')}</span><input id="sname" maxlength="14" value="${esc(P.name)}"></label>
   <div class="opts col">${['cheerful', 'calm', 'mischief'].map(k => `<button class="opt ${P.persona === k ? 'on' : ''}" data-act="persona" data-v="${k}">${t('p_' + k)}<small>${t('p_' + k + '_d')}</small></button>`).join('')}</div>
   <label class="fld"><span>${t('w_custom')}</span><textarea id="scustom" rows="2" maxlength="160" placeholder="${t('w_custom_ph')}">${esc(P.custom)}</textarea></label>
   <div class="mini">${t('s_prompt')}</div><pre id="sprompt">${esc(buildPrompt())}</pre></section>
  <section id="s-skin"><h3>${t('s_skin')}</h3>
   ${Object.keys(SKINS).map(k => { const sk = SKINS[k], v = sk.v; return `<button class="skin ${S.skin === k ? 'on' : ''}" data-act="skin" data-v="${k}"><span class="sw3"><i style="background:${v['--sc1']}"></i><i style="background:${v['--sc2']}"></i><i style="background:${v['--ir2']}"></i></span>${t(sk.n)}<span class="tagm">${sk.free ? t('s_free') : (S.unlocked ? t('s_unlocked') : t('s_locked'))}</span></button>`; }).join('')}
   ${['pet_fox', 'pet_owl', 'pet_bot'].map(k => `<div class="skin" style="opacity:.55">${t(k)}<span class="tagm">${t('s_soon')}</span></div>`).join('')}
   <div class="acts" style="margin-top:14px">
    <button class="btn pri" data-act="unlock" ${S.unlocked ? 'disabled' : ''}>${S.unlocked ? t('s_unlocked') : t('s_unlock')}</button>
    <button class="lnk" data-act="restore" style="margin:0"><span data-i="s_restore">${lang === 'id' ? 'Pulihkan pembelian' : 'Restore purchases'}</span></button>
   </div><div class="mini">${t('s_unlock_p')}</div></section>
  <section id="s-conn"><h3>${t('s_conn')}</h3>
   ${['chat', 'hermes'].map(k => `<div class="crow"><span>${t('st_' + k)}<small>${S.connected[k] ? (k === 'chat' ? t(PROV[S.provider || 'gemini'][0]) : t('conn_hermes_sub')) : t('conn_none')}</small></span><button class="btn" data-act="${S.connected[k] ? 'disc' : 'conn'}" data-v="${k}">${S.connected[k] ? t('s_disc') : t('s_conn_btn')}</button></div>`).join('')}</section>
  <section id="s-lab"><h3>${t('s_lab')}</h3><div class="mini" style="margin-bottom:10px">${t('s_lab_p')}</div>
   <div class="lab">${labStates.map(s => `<button data-act="lab" data-v="${s}">${t('stt_' + s)}${(s === 'vision' || s === 'image') ? ' (' + t('s_next') + ')' : ''}</button>`).join('')}</div></section>
  <section id="s-clear"><h3>${t('s_clear_data')}</h3><div class="mini" style="margin-bottom:10px">${t('s_clear_data_p')}</div>
   <div class="acts"><button class="btn no" data-act="clear">${t('s_clear_data')}</button></div></section>`;
}
$('#settBody').addEventListener('input', e => {
    const target = e.target;
    if (target.id === 'sname') {
        S.pet.name = target.value || 'Nova';
        plate();
        $('#sprompt').textContent = buildPrompt();
    }
    if (target.id === 'scustom') {
        S.pet.custom = target.value;
        $('#sprompt').textContent = buildPrompt();
    }
});
$('#settBody').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b)
        return;
    const a = b.dataset.act, v = b.dataset.v;
    if (a === 'lang') {
        setLang(v);
        applyLang();
    }
    else if (a === 'persona') {
        S.pet.persona = v;
        plate();
        renderSett();
    }
    else if (a === 'skin') {
        if (SKINS[v].free || S.unlocked) {
            applySkin(v);
            renderSett();
        }
        else {
            const u = document.querySelector('[data-act=unlock]');
            u.scrollIntoView({ block: 'center', behavior: 'smooth' });
            u.focus();
        }
    }
    else if (a === 'unlock') {
        await Billing.purchase();
        renderSett();
    }
    else if (a === 'restore') {
        await Billing.restore();
        renderSett();
    }
    else if (a === 'disc') {
        S.connected[v] = false;
        renderRail();
        if (v === S.station) {
            closeSett();
            startConnect(v);
        }
        else
            renderSett();
    }
    else if (a === 'conn') {
        closeSett();
        if (v !== S.station)
            switchStation(v);
        else
            startConnect(v);
    }
    else if (a === 'lab') {
        if (!S.awake) {
            S.awake = true;
        }
        pet.set(v, { ms: v === 'sleep' ? 0 : 3800, line: v === 'sleep' ? getLine('sleep') : getLine(v === 'wake' ? 'greet' : v) });
        plate();
    }
    else if (a === 'clear') {
        if (confirm(lang === 'id' ? 'Yakin hapus semua data?' : 'Are you sure you want to clear all data?')) {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('nz_'))
                    keys.push(k);
            }
            for (const k of keys)
                localStorage.removeItem(k);
            location.reload();
        }
    }
});
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('animateMotion').forEach(a => a.remove());
    S.sky = false;
}
document.addEventListener('DOMContentLoaded', async () => {
    await Billing.init();
    pet.init();
    applyLang();
    pet.set('sleep');
    startConnect('chat');
    initSky('#sky', pet.glance.bind(pet), curTopic);
});
//# sourceMappingURL=main.js.map