import { L } from './i18n';
import { S, IDX } from './state';

export const GEN_SIM = {
  steps: [{ k: { id: 'Membaca permintaan', en: 'Reading the request' }, p: 'think' }, { k: { id: 'Menyusun hasil', en: 'Drafting the result' }, p: 'doc' }],
  cmd: 'save result to ~/Nazaverse/topic/result.md',
  file: 'result.md',
  done: { id: 'Selesai. Hasil tersimpan.', en: 'Done. Result saved.' },
  out: { id: '# Hasil\n- Status: selesai', en: '# Result\n- Status: done' }
};

export const TOPICS: Record<string, any[]> = {
  chat: [
    { seed: 'general', name: { id: 'Umum', en: 'General' }, ins: { id: 'Tanya apa saja, ngobrol santai', en: 'Ask anything, chat casually' }, chips: { id: ['Jelaskan konsep ini dengan sederhana', 'Cari berita terbaru tentang AI', 'Buat dokumen ringkasan rapat'], en: ['Explain this concept simply', 'Search the latest news about AI', 'Create a meeting summary document'] }, history: [] },
    { seed: 'research', name: { id: 'Riset', en: 'Research' }, ins: { id: 'Cari dan rangkum dari web', en: 'Search the web and summarize' }, chips: { id: ['Cari perkembangan terbaru energi surya', 'Bandingkan dua laptop untuk kuliah', 'Cari ringkasan tentang lubang hitam'], en: ['Search the latest in solar energy', 'Compare two laptops for college', 'Search a summary about black holes'] }, history: [] },
    { seed: 'writing', name: { id: 'Menulis', en: 'Writing' }, ins: { id: 'Susun dokumen dan tulisan', en: 'Draft documents and text' }, chips: { id: ['Buat dokumen surat lamaran kerja', 'Buat dokumen proposal singkat', 'Perbaiki paragraf ini'], en: ['Create a job application letter document', 'Create a short proposal document', 'Fix this paragraph'] }, history: [] }
  ],
  hermes: [
    { seed: 'Fullstack', name: 'Fullstack', ins: { id: 'Bangun fitur dari database sampai tampilan', en: 'Build features from database to UI' }, chips: { id: ['Buat fitur login', 'Tambah halaman profil', 'Perbaiki bug di API'], en: ['Build a login feature', 'Add a profile page', 'Fix a bug in the API'] }, history: [],
      sim: { steps: [{ k: { id: 'Membaca struktur proyek', en: 'Reading the project structure' }, p: 'think' }, { k: { id: 'Menulis endpoint /api/tugas', en: 'Writing the /api/tasks endpoint' }, p: 'doc' }, { k: { id: 'Menyambungkan ke tampilan', en: 'Connecting it to the UI' }, p: 'doc' }], cmd: 'npm test', file: 'summary.md', done: { id: 'Selesai. Endpoint dan tampilannya sudah tersambung, 12 tes lulus.', en: 'Done. The endpoint and UI are connected, 12 tests pass.' }, out: { id: '# Ringkasan fitur\n- Endpoint: GET/POST /api/tugas\n- Tampilan: daftar tugas dan form\n- Tes: 12 lulus', en: '# Feature summary\n- Endpoint: GET/POST /api/tasks\n- UI: task list and form\n- Tests: 12 passing' } } },
    { seed: 'Planning', name: 'Planning', ins: { id: 'Pecah tujuan jadi rencana yang jelas', en: 'Break a goal into a clear plan' }, chips: { id: ['Rencanakan peluncuran app', 'Susun jadwal belajar AI', 'Pecah proyek besar'], en: ['Plan an app launch', 'Build an AI study schedule', 'Break down a big project'] }, history: [],
      sim: { steps: [{ k: { id: 'Memecah tujuan menjadi bagian', en: 'Splitting the goal into parts' }, p: 'think' }, { k: { id: 'Menyusun milestone', en: 'Drafting milestones' }, p: 'doc' }, { k: { id: 'Menghitung estimasi waktu', en: 'Estimating time' }, p: 'think' }], cmd: 'write plan to ~/Nazaverse/planning/plan.md', file: 'plan.md', done: { id: 'Rencana siap: 4 milestone dalam 3 minggu.', en: 'Plan ready: 4 milestones over 3 weeks.' }, out: { id: '# Rencana 3 minggu\n- Minggu 1: riset dan desain\n- Minggu 2: bangun inti\n- Minggu 3: uji dan rilis', en: '# 3-week plan\n- Week 1: research and design\n- Week 2: build the core\n- Week 3: test and release' } } }
  ]
};

export const PROV: Record<string, [string, string]> = { gemini: ['prov_gemini', 'prov_gemini_d'], openai: ['prov_openai', 'prov_openai_d'], router: ['prov_router', 'prov_router_d'] };
export const CMDS: Record<string, [string, string][]> = { chat: [['/doc', 'cmd_doc'], ['/search', 'cmd_search'], ['/persona', 'cmd_persona'], ['/clear', 'cmd_clear'], ['/stop', 'cmd_stop']], hermes: [['/stop', 'cmd_stop'], ['/voice', 'cmd_voice'], ['/whoami', 'cmd_whoami'], ['/help', 'cmd_help']] };

export const curTopic = () => TOPICS[S.station][IDX[S.station as 'chat'|'hermes']];
export const tName = (tp: any) => L(tp.name);

