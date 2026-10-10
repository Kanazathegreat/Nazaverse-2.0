import { clamp } from '../utils';
import { S, IDX } from '../state';

/* ===== constellations (topic icons + sky) ===== */
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function constel(name: string) {
  let s = hash(String(name).toLowerCase() || 'x');
  const r = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const n = 5 + Math.floor(r() * 3);
  const pts: number[][] = [];
  const edges: number[][] = [];
  
  for (let i = 0; i < n; i++) pts.push([(i + .1 + r() * .8) / n, .1 + r() * .8]);
  for (let i = 0; i < n - 1; i++) edges.push([i, i + 1]);
  edges.push([Math.floor(r() * (n - 2)), n - 1]);
  return { pts, edges };
}

export function cSvg(k: any) {
  const P = k.pts.map((p: number[]) => [4 + p[0] * 92, 4 + p[1] * 52]);
  return k.edges.map((e: number[]) => `<line x1="${P[e[0]][0]}" y1="${P[e[0]][1]}" x2="${P[e[1]][0]}" y2="${P[e[1]][1]}"/>`).join('') + 
         P.map((p: number[]) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.2"/>`).join('');
}

export function kOf(tp: any) {
  return tp.k || (tp.k = constel(tp.seed));
}

/* ===== sky ===== */
export let warp = 0;
export let target = 0;
export let lit = 0;
export let litT = 0;

export function setWarp(v: number) { target = v; }
export function setLit(v: number) { litT = v; }

let cv: HTMLCanvasElement;
let g: CanvasRenderingContext2D;
let root: HTMLElement;
let w = 0, h = 0, dpr = 1;
let stars: any[] = [];
let shoot: any[] = [];
let band: HTMLCanvasElement;
let mx = 0, my = 0, px = 0, py = 0, cxp = 0, cyp = 0;
const tint = ['#ffffff', '#e6ecff', '#fff0d0'];
let winRect: DOMRect | null = null;
let petGlance: (x: number) => void;
let curTopicProvider: () => any;

function gauss() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / .75;
}

export function initSky(canvasId: string, glanceCb: (x: number) => void, curTopicCb: () => any) {
  cv = document.querySelector(canvasId) as HTMLCanvasElement;
  g = cv.getContext('2d')!;
  root = document.documentElement;
  petGlance = glanceCb;
  curTopicProvider = curTopicCb;

  window.addEventListener('pointermove', e => {
    cxp = e.clientX;
    cyp = e.clientY;
    mx = e.clientX / w - .5;
    my = e.clientY / h - .5;
  });

  const feed = document.querySelector('#feed');
  if (feed) {
    feed.addEventListener('pointerdown', (e: Event) => {
      const targetEl = e.target as HTMLElement;
      if (targetEl === feed || targetEl.classList.contains('wrap') || targetEl.id === 'empty') {
        burst((e as PointerEvent).clientX, (e as PointerEvent).clientY);
      }
    });
  }

  window.addEventListener('resize', size);
  const winEl = document.querySelector('#win');
  if (window.ResizeObserver && winEl) {
    new ResizeObserver(measure).observe(winEl);
  }

  size();
  requestAnimationFrame(frame);
}

function size() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  cv.width = w * dpr;
  cv.height = h * dpr;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  const n = Math.min(240, Math.round((w * h) / 8000));
  stars = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: .25 + Math.random() * .75,
      r: .4 + Math.random() * 1,
      tw: .6 + Math.random() * 1.6,
      ph: Math.random() * 6.3,
      c: tint[i % 3]
    });
  }
  
  band = document.createElement('canvas');
  band.width = w;
  band.height = h;
  const b = band.getContext('2d')!;
  const ax = w * .05, ay = h * 1.02, bx = w * .95, by = -h * .02;
  const Ln = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / Ln, uy = (by - ay) / Ln;
  const sg = Math.min(w, h) * .1;
  
  for (let i = 0; i < Math.min(1500, (w * h) / 900); i++) {
    const tt = Math.random() * Ln;
    const o = gauss() * sg;
    const x = ax + ux * tt - uy * o;
    const y = ay + uy * tt + ux * o;
    b.globalAlpha = .05 + Math.random() * .28 * (1 - Math.min(1, Math.abs(o) / (sg * 1.6)));
    b.fillStyle = tint[i % 3];
    b.fillRect(x, y, Math.random() < .15 ? 1.6 : .9, Math.random() < .15 ? 1.6 : .9);
  }
  measure();
}

function measure() {
  const winEl = document.querySelector('#win');
  if (winEl) {
    const r = winEl.getBoundingClientRect();
    winRect = (r.width > 0 && r.height > 0) ? r : null;
  }
}

export function spawn(x: number, y: number, fast?: boolean, nat?: boolean) {
  const sp = (fast ? 16 : 9) + Math.random() * 7;
  const a = 2.45 + Math.random() * .25;
  shoot.push({
    x, y,
    vx: Math.cos(a) * sp,
    vy: Math.sin(a) * sp,
    l: 110 + Math.random() * 130,
    age: 0,
    c: Math.random() < .25 ? '107,155,255' : '255,244,222'
  });
  if (nat && petGlance) petGlance(x);
}

export function burst(x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    spawn(x + 170 + i * 45 + Math.random() * 30, y - 130 - i * 30, true);
  }
}

function drawConstel() {
  if (S.focus || !winRect || window.innerWidth <= 820 || winRect.width < 260 || winRect.height < 300) return;
  const tp = curTopicProvider();
  if(!tp) return;
  
  const k = kOf(tp);
  const sw = winRect.width * .44;
  const sh = Math.min(sw * .4, winRect.height * .1);
  const ox = winRect.left + (winRect.width - sw) / 2;
  const oy = winRect.top + winRect.height * .07;
  
  const P = k.pts.map((p: number[]) => [ox + p[0] * sw + px * 8, oy + p[1] * sh + py * 8]);
  const n = k.edges.length;
  
  g.lineWidth = 1;
  k.edges.forEach((e: number[], i: number) => {
    const f = clamp(lit * n - i, 0, 1);
    g.strokeStyle = 'rgba(232,227,214,' + (.14 + .04 * warp) + ')';
    g.beginPath();
    g.moveTo(P[e[0]][0], P[e[0]][1]);
    g.lineTo(P[e[1]][0], P[e[1]][1]);
    g.stroke();
    
    if (f > 0) {
      const a = P[e[0]], b = P[e[1]];
      g.strokeStyle = 'rgba(107,155,255,' + (.4 + .5 * f) + ')';
      g.beginPath();
      g.moveTo(a[0], a[1]);
      g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
      g.stroke();
    }
  });
  
  P.forEach((p: number[], i: number) => {
    const on = lit * n >= i - .5 && lit > 0;
    g.fillStyle = on ? '#6b9bff' : 'rgba(232,227,214,.5)';
    g.beginPath();
    g.arc(p[0], p[1], on ? 2.6 : 1.8, 0, 6.283);
    g.fill();
    if (on) {
      g.globalAlpha = .18;
      g.beginPath();
      g.arc(p[0], p[1], 8, 0, 6.283);
      g.fill();
      g.globalAlpha = 1;
    }
  });
}

function frame(tm2: number) {
  if (document.hidden) {
    requestAnimationFrame(frame);
    return;
  }
  
  if (target !== undefined) warp += (target - warp) * .04;
  if (litT !== undefined) lit += (litT - lit) * .05;
  root.style.setProperty('--w', warp.toFixed(3));
  px += (mx - px) * .05;
  py += (my - py) * .05;
  
  if (!S.sky) {
      // Just clear and request next to not drain if paused, but here we can just slow down or stop
      // Wait, reduced motion keeps the sky static but we might still need to draw background
      // Actually we just skip updating time
  }

  g.clearRect(0, 0, w, h);
  g.globalAlpha = .85;
  if (band) g.drawImage(band, px * 10, py * 10, w, h);
  g.globalAlpha = 1;
  
  for (const s of stars) {
    if (S.sky) {
      s.y += s.z * (.05 + warp * 2.4);
      s.x -= s.z * (.02 + warp * 1.2);
    }
    if (s.y > h + 30 || s.x < -30) {
      s.y = -10;
      s.x = Math.random() * (w + 200);
    }
    const x = s.x + px * s.z * 36;
    const y = s.y + py * s.z * 36;
    const a = (.35 + .65 * Math.abs(Math.sin(tm2 / 1000 * s.tw + s.ph))) * (.45 + s.z * .55);
    g.globalAlpha = a;
    g.fillStyle = s.c;
    g.strokeStyle = s.c;
    
    if (warp > .06) {
      g.globalAlpha = a * .7;
      g.lineWidth = s.r;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + s.z * warp * 20, y - s.z * warp * 40);
      g.stroke();
      g.globalAlpha = a;
    }
    g.beginPath();
    g.arc(x, y, s.r, 0, 6.283);
    g.fill();
  }
  g.globalAlpha = 1;
  drawConstel();
  
  const rate = .0035 + warp * .1;
  if (S.sky && Math.random() < rate) {
    if (warp > .4 && cxp && Math.random() < .4) {
      spawn(cxp + 120 + Math.random() * 160, cyp - 120 - Math.random() * 100, true);
    } else {
      spawn(w * (.3 + Math.random() * .8), -20, warp > .3, warp < .1);
    }
  }
  
  for (let i = shoot.length - 1; i >= 0; i--) {
    const s = shoot[i];
    if (S.sky) {
      s.x += s.vx;
      s.y += s.vy;
      s.age++;
    }
    if (s.y > h + 60 || s.x < -260 || s.age > 200) {
      shoot.splice(i, 1);
      continue;
    }
    const sp = Math.hypot(s.vx, s.vy);
    const tx = s.x - s.vx / sp * s.l;
    const ty = s.y - s.vy / sp * s.l;
    const gr = g.createLinearGradient(s.x, s.y, tx, ty);
    gr.addColorStop(0, 'rgba(' + s.c + ',1)');
    gr.addColorStop(1, 'rgba(' + s.c + ',0)');
    g.strokeStyle = gr;
    g.lineWidth = 1.6;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(s.x, s.y);
    g.lineTo(tx, ty);
    g.stroke();
    g.fillStyle = '#fff';
    g.beginPath();
    g.arc(s.x, s.y, 1.8, 0, 6.283);
    g.fill();
  }
  
  requestAnimationFrame(frame);
}

