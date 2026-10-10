import { $ } from '../utils';
import { S } from '../state';
import { t, lang } from '../i18n';
import svgContent from './pet.svg?raw';

export const SKINS: Record<string, { n: string, free: boolean, v: Record<string, string> }> = {
  galaxy: { n: 'sk_galaxy', free: true, v: { '--sc1': '#2c3fb0', '--sc2': '#7a46c9', '--sc3': '#1d86c9', '--ir1': '#bfe8ff', '--ir2': '#6b7bff', '--ir3': '#2a2f8a', '--fur1': '#f7a24a', '--fur2': '#e8742a', '--stripe': '#b9481a' } },
  aurora: { n: 'sk_aurora', free: false, v: { '--sc1': '#0e8a73', '--sc2': '#2dbd9a', '--sc3': '#4aa7ff', '--ir1': '#c9ffe9', '--ir2': '#3ed6a4', '--ir3': '#0f6a58', '--fur1': '#f7a24a', '--fur2': '#e8742a', '--stripe': '#b9481a' } },
  supernova: { n: 'sk_supernova', free: false, v: { '--sc1': '#b3341d', '--sc2': '#f0a030', '--sc3': '#ffd36b', '--ir1': '#fff2c2', '--ir2': '#ffb347', '--ir3': '#a24b12', '--fur1': '#ffb866', '--fur2': '#f08a38', '--stripe': '#b9481a' } }
};

export const LINES: Record<string, any> = {
  cheerful: { id: { greet: ['Halo! Aku {n}. Ayo mulai!', 'Yey, kamu datang! Mau ngerjain apa?'], think: ['Hmm, aku pikir dulu ya...', 'Sebentar, lagi mikir!'], search: ['Kuintip dulu pakai teleskop!', 'Cari-cari di luar angkasa web...'], doc: ['Aku tulis dulu, ya!', 'Nulis dokumen, nih!'], vision: ['Kulihat pakai kaca pembesar!'], image: ['Waktunya melukis bintang!'], done: ['Beres! Keren, kan?', 'Selesai! Yey!'], error: ['Aduh, ada yang salah...', 'Waduh! Coba lagi, yuk.'], poke: ['Eh! Geli!', 'Hihi, ada apa?'], pet: ['Purrr... enak banget!', 'Lagi, lagi!'], sleep: ['Zzz... bangunin aku kalau butuh.'], idle: ['Lihat, bintang jatuh!', 'Aku siap kapan pun.'] },
    en: { greet: ["Hi! I'm {n}. Let's go!", "Yay, you're here! What are we doing?"], think: ['Hmm, let me think...', 'One sec, thinking!'], search: ['Peeking through the telescope!', 'Searching the web galaxy...'], doc: ["I'll write it up!", 'Writing a document!'], vision: ['Looking with my magnifier!'], image: ['Time to paint some stars!'], done: ['Done! Pretty good, right?', 'All finished! Yay!'], error: ['Oh no, something went wrong...', 'Oops! Let us try again.'], poke: ['Eek! Tickles!', 'Hehe, what is it?'], pet: ['Purrr... so nice!', 'More, more!'], sleep: ['Zzz... wake me if you need me.'], idle: ['Look, a shooting star!', 'Ready whenever you are.'] } },
  calm: { id: { greet: ['Halo. Aku {n}. Kita mulai pelan-pelan.', 'Selamat datang. Apa yang ingin dikerjakan?'], think: ['Kupikirkan dulu sebentar.', 'Tenang, sedang kupikirkan.'], search: ['Kucari lewat teleskop.', 'Kulihat dulu apa yang ada di luar sana.'], doc: ['Kutuliskan dengan rapi.', 'Menyusun dokumen.'], vision: ['Kuperhatikan gambarnya baik-baik.'], image: ['Kulukis pelan-pelan.'], done: ['Sudah selesai.', 'Ini hasilnya.'], error: ['Ada yang tidak berjalan. Kita coba lagi.', 'Tidak apa-apa, kita ulangi.'], poke: ['Hm? Ada apa.', 'Aku di sini.'], pet: ['Hmm... nyaman.', 'Purr...'], sleep: ['Zzz... aku istirahat dulu.'], idle: ['Langit malam ini tenang.', 'Aku menemanimu.'] },
    en: { greet: ["Hello. I'm {n}. Let's start slowly.", 'Welcome. What would you like to do?'], think: ['Let me think for a moment.', 'Easy, I am thinking.'], search: ['Looking through the telescope.', 'Let me see what is out there.'], doc: ['I will write it neatly.', 'Drafting the document.'], vision: ['I will look at the image carefully.'], image: ['Painting it slowly.'], done: ['All finished.', 'Here is the result.'], error: ['Something did not work. Let us try again.', "It's fine, we will retry."], poke: ['Hm? What is it.', "I'm here."], pet: ['Hmm... cozy.', 'Purr...'], sleep: ['Zzz... resting for now.'], idle: ['The night sky is calm.', 'I am keeping you company.'] } },
  mischief: { id: { greet: ['Oh, akhirnya muncul. Aku {n}.', 'Kangen aku, kan? Ayo kerja.'], think: ['Hehe, tebak apa yang kupikirkan.', 'Mikir dulu... jangan ngintip.'], search: ['Kuintip dunia dulu, diem ya.', 'Nyari gosip, eh, data.'], doc: ['Kutulis, jangan protes dulu.', 'Nulis... jangan lihat, belum rapi.'], vision: ['Hmm, apa nih yang kamu sembunyikan?'], image: ['Awas, lukisan ini tak ternilai.'], done: ['Nah! Aku memang hebat.', 'Beres. Tolong sebut aku jenius.'], error: ['Ups. Bukan salahku. Mungkin.', 'Hehe, itu error. Salahkan bintang.'], poke: ['Hei! Kucakar, lho. Bercanda.', 'Colek lagi, kugigit. Eh, tidak.'], pet: ['Boleh. Cuma lima menit.', 'Jangan bilang siapa-siapa, aku suka.'], sleep: ['Zzz... jangan colek aku.'], idle: ['Ada bintang jatuh. Kamu ketinggalan.', 'Aku tidak melamun. Aku merencanakan.'] },
    en: { greet: ["Oh, there you are. I'm {n}.", 'Missed me, right? Let us work.'], think: ['Hehe, guess what I am thinking.', "Thinking... don't peek."], search: ["Peeking at the world, stay quiet.", 'Looking for gossip, I mean data.'], doc: ["Writing it, don't complain yet.", "Writing... don't look, it's messy."], vision: ['Hmm, what are you hiding here?'], image: ['Careful, this painting is priceless.'], done: ['Ha! I am simply great.', 'Done. Please call me a genius.'], error: ['Oops. Not my fault. Maybe.', 'Hehe, that is an error. Blame the stars.'], poke: ["Hey! I'll scratch. Kidding.", "Poke again and I bite. Not really."], pet: ['Fine. Only five minutes.', "Don't tell anyone, I like it."], sleep: ["Zzz... don't poke me."], idle: ['A shooting star. You missed it.', "I'm not daydreaming. I'm scheming."] } }
};

export function pick(a: any[]) { return a[Math.floor(Math.random() * a.length)]; }

export function getLine(ev: string) {
  const P = LINES[S.pet.persona] || LINES.cheerful;
  const set = (P[lang] && P[lang][ev]) || P[lang].think;
  return pick(set).replace('{n}', S.pet.name);
}

export function applySkin(id: string) {
  const sk = SKINS[id];
  if (!sk) return;
  S.skin = id;
  const petEl = $('#pet');
  if (petEl) {
    for (const k in sk.v) petEl.style.setProperty(k, sk.v[k]);
  }
}

export class PetController {
  st = 'sleep';
  back: any = null;
  capT: any = null;
  lastAct = Date.now();
  looks: Record<string, [number, number]> = { think: [-5, -6], search: [6, -6], image: [6, -5], vision: [-3, 5], doc: [0, 6], error: [0, 2] };

  constructor() {}

  init() {
    const root = $('#pet');
    root.innerHTML = svgContent;
    applySkin(S.skin);
    
    root.addEventListener('click', e => {
      this.touch();
      if (!S.awake) { this.say(t('locked')); return; }
      if (this.st === 'sleep') { this.wake(); setTimeout(() => this.say(getLine('greet')), 1900); return; }
      if (S.busy) { 
        const all = $('#all');
        all.classList.remove('pk'); void all.getBoundingClientRect(); all.classList.add('pk'); return; 
      }
      if ((e.target as Element).closest('#head')) { this.set('pet', { ms: 2200, line: getLine('pet') }); }
      else { 
        const all = $('#all');
        all.classList.remove('pk'); void all.getBoundingClientRect(); all.classList.add('pk'); this.say(getLine('poke'), 2600); 
      }
    });

    root.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); root.click(); } });
    window.addEventListener('pointerdown', () => this.touch());
    window.addEventListener('keydown', () => this.touch());
    
    window.addEventListener('pointermove', e => {
      if (['idle', 'talk', 'done'].includes(this.st)) {
        const svg = $('#psvg');
        if (svg) {
          const r = svg.getBoundingClientRect();
          const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
          this.look(clamp((e.clientX - (r.left + r.width / 2)) / r.width * 14, -5, 5), clamp((e.clientY - (r.top + r.height * .43)) / r.height * 10, -4, 5));
        }
      }
    });

    const blink = () => {
      setTimeout(() => {
        if (!['sleep', 'done', 'pet'].includes(this.st)) {
          const svg = $('#psvg');
          if (svg) {
            svg.classList.add('bl');
            setTimeout(() => svg.classList.remove('bl'), 130);
          }
        }
        blink();
      }, 2400 + Math.random() * 3800);
    };
    blink();

    setInterval(() => {
      if (this.st === 'idle') {
        const r = Math.random();
        if (r < .35) {
          this.look(Math.round((Math.random() * 8 - 4) * 10) / 10, Math.round((Math.random() * 6 - 3) * 10) / 10);
          setTimeout(() => { if (this.st === 'idle') this.look(0, 0); }, 1400);
        } else if (r < .6) {
          const e = $('#earR');
          if (e) { e.classList.add('tw'); setTimeout(() => e.classList.remove('tw'), 420); }
        } else if (r < .68) {
          this.say(getLine('idle'), 3600);
        }
        if (S.awake && Date.now() - this.lastAct > 70000) { this.set('sleep', { line: getLine('sleep') }); }
      }
    }, 2600);
  }

  look(x: number, y: number) {
    const svg = $('#psvg');
    if (svg) {
      svg.style.setProperty('--lx', x.toString());
      svg.style.setProperty('--ly', y.toString());
    }
  }

  say(text: string, ms?: number) {
    const cap = $('#cap');
    if (cap) {
      cap.textContent = text;
      cap.classList.add('on');
      clearTimeout(this.capT);
      this.capT = setTimeout(() => cap.classList.remove('on'), ms || 4200);
    }
  }

  set(s: string, o?: any) {
    o = o || {};
    clearTimeout(this.back);
    this.st = s;
    const root = $('#pet');
    if (root) root.dataset.s = s;
    const lk = this.looks[s];
    if (lk) this.look(lk[0], lk[1]);
    else if (!['idle', 'talk', 'done'].includes(s)) this.look(0, 0);
    if (o.line) this.say(o.line, o.lineMs);
    if (o.ms) this.back = setTimeout(() => this.set(S.awake ? 'idle' : 'sleep'), o.ms);
    this.lastAct = Date.now();
  }

  wake() {
    S.awake = true;
    this.set('wake');
    this.back = setTimeout(() => this.set('idle'), 1900);
  }

  touch() {
    this.lastAct = Date.now();
  }

  glance(x: number) {
    if (this.st !== 'idle' || !S.awake) return;
    this.look(x < window.innerWidth / 2 ? -5 : 5, -5);
    setTimeout(() => { if (this.st === 'idle') this.look(0, 0); }, 1200);
  }

  get state() {
    return this.st;
  }
}

export const pet = new PetController();

