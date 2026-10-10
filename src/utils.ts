export const $ = (s: string) => document.querySelector(s) as HTMLElement;
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const esc = (s: any) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
export function el(t: string, c?: string, h?: string) {
  const e = document.createElement(t);
  if (c) e.className = c;
  if (h !== undefined) e.innerHTML = h;
  return e;
}
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const pick = (a: any[]) => a[Math.floor(Math.random() * a.length)];

