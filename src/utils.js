export const $ = (s) => document.querySelector(s);
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function el(t, c, h) {
    const e = document.createElement(t);
    if (c)
        e.className = c;
    if (h !== undefined)
        e.innerHTML = h;
    return e;
}
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
//# sourceMappingURL=utils.js.map