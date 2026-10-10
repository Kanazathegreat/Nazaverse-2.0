const T: Record<string, Record<string, string>> = {
id:{
 menu:'Buka menu',settings:'pengaturan',close:'tutup',add_topic:'tambah topik',topic_name:'Nama topik',topic_ins:'Untuk apa topik ini?',save_topic:'simpan topik',
 ph_input:'Tulis pesan, atau / untuk perintah',attach:'lampirkan',send:'kirim',web:'cari web',
 st_chat:'Chatbot',st_hermes:'Hermes Agent',idle:'siaga',working:'bekerja',ask_first:'tanya dulu',auto:'otonom',
 sky_on:'langit hidup',sky_off:'langit diam',v_stage:'panggung',v_focus:'fokus',you:'kamu',new_session:'sesi baru',
 empty_h:'Apa yang mau kita kerjakan malam ini?',topic_line:'topik {n} / {i}',
 perm:'izin diperlukan',allow:'izinkan',deny:'tolak',allowed:'diizinkan',denied:'ditolak',copy:'salin',copied:'tersalin',src:'sumber (contoh simulasi)',
 conn_hermes_ok:'hermes terhubung',conn_hermes_sub:'berjalan lokal di PC',conn_chat_ok:'{p} terhubung',conn_chat_sub:'key tersimpan di perangkat ini',
 conn_none:'belum terhubung',conn_none_sub:'ketuk untuk menghubungkan',
 plate_locked:'tertidur',locked:'Zzz... hubungkan dulu supaya aku bangun.',
 w_step:'langkah {a} dari {b}',w_next:'lanjut',w_back:'kembali',
 w_provider_h:'Pilih penyedia AI-mu',w_provider_p:'Nazaverse memakai API key milikmu sendiri, jadi kamu yang mengatur model dan biayanya.',
 prov_gemini:'Google Gemini',prov_gemini_d:'dari Google',prov_openai:'OpenAI',prov_openai_d:'model GPT',prov_router:'OpenRouter',prov_router_d:'satu key, banyak model',
 w_key_h:'Tempel API key-mu',w_key_ph:'tempel key di sini',w_show:'tampilkan',w_hide:'sembunyikan',
 w_key_note:'Key hanya disimpan di perangkat ini dan tidak dikirim ke server Nazaverse.',
 w_howto:'cara mendapatkan key',w_how1:'Buka situs penyedia dan masuk ke akunmu.',w_how2:'Cari menu "API keys" di dasbor.',w_how3:'Buat key baru, lalu salin.',w_how4:'Tempel di kolom di atas.',
 w_test:'tes koneksi',w_testing:'menguji',w_err:'Key tampak terlalu pendek. Periksa lagi salinannya.',w_herr:'Alamat atau kunci belum diisi.',w_ok:'Terhubung.',
 w_hermes_h:'Hubungkan Hermes Agent',w_hermes_p:'Jalankan Hermes di komputermu, lalu masukkan alamat dan kunci API server-nya.',w_addr:'alamat server',w_hkey:'kunci API server',
 w_wake_h:'Kucingmu bangun',w_wake_p:'Koneksi berhasil. Lihat ke jendela.',
 w_persona_h:'Kenalan dengan kucingmu',w_persona_p:'Beri nama dan pilih karakternya. Bisa diubah kapan saja di pengaturan.',w_name:'nama',w_custom:'atau tulis karakter sendiri (opsional)',
 w_custom_ph:'mis. sok tahu tapi baik hati, suka bicara soal bintang',w_start:'mulai',
 p_cheerful:'ceria',p_calm:'tenang',p_mischief:'usil',p_cheerful_d:'Bersemangat dan penuh energi.',p_calm_d:'Kalem dan menenangkan.',p_mischief_d:'Jahil dan suka menggoda.',
 s_lang:'bahasa',s_pet:'kucing dan karakter',s_prompt:'prompt karakter (pratinjau)',s_skin:'skin dan pet',s_unlock:'buka semua pet dan skin',
 s_unlock_p:'Sekali bayar Rp10.000 (sekitar $0,57). Ini simulasi, belum ada pembayaran.',s_unlocked:'terbuka',s_free:'gratis',s_locked:'terkunci',s_soon:'segera hadir',
 s_conn:'koneksi',s_disc:'putuskan',s_conn_btn:'hubungkan',s_display:'tampilan',s_lab:'uji animasi pet',
 s_lab_p:'Pratinjau tiap status. Di aplikasi nyata, status datang dari aktivitas AI.',s_next:'berikutnya',
 pet_fox:'Rubah bintang',pet_owl:'Burung hantu kosmik',pet_bot:'Robot kecil',
 sk_galaxy:'Galaksi',sk_aurora:'Aurora',sk_supernova:'Supernova',
 stt_sleep:'tidur',stt_wake:'bangun',stt_idle:'santai',stt_think:'berpikir',stt_talk:'bicara',stt_search:'cari web',stt_vision:'lihat gambar',stt_doc:'tulis dokumen',stt_image:'buat gambar',stt_done:'selesai',stt_error:'error',stt_pet:'dielus',
 prompt_tpl:'Kamu adalah {n}, kucing luar angkasa yang menemani pengguna di Nazaverse. Karakter: {p}. {c}Jawab ringkas dan jelas, dalam bahasa yang dipakai pengguna.',
 cmd_doc:'Buat dokumen',cmd_search:'Cari di web',cmd_persona:'Ubah karakter pet',cmd_clear:'Mulai sesi baru',cmd_stop:'Hentikan agent',cmd_voice:'Atur balasan suara',cmd_whoami:'Lihat akses perintahmu',cmd_help:'Daftar perintah',
 sim_think:'Memikirkan jawaban',sim_search:'Mencari di web: {q}',sim_read:'Membaca 3 sumber',sim_outline:'Menyusun kerangka',sim_write:'Menulis dokumen',sim_conn:'Menghubungi penyedia',
 sim_run:'Menjalankan: {c}',sim_cancel:'Aksi dibatalkan',sim_denied:'Oke, aksinya tidak dijalankan. Rencananya tetap saya simpan.',
 sim_plain:'Ini jawaban simulasi dari mode chatbot. Di aplikasi nyata, teks ini datang dari model yang kamu pilih lewat API key-mu dan muncul bertahap seperti ini.',
 sim_web:'Simulasi: saya membaca tiga sumber dan merangkumnya di sini. Hasil pencarian nyata akan datang dengan tautan yang bisa dibuka.',
 sim_docr:'Dokumennya sudah siap. Kamu bisa menyalinnya.',sim_fail:'Simulasi error: penyedia menolak permintaan (401). Periksa API key-mu di pengaturan.',
 doc_body:'# Draf dokumen\n\n- Tujuan: ringkas dan jelas\n- Isi utama: tiga poin pendukung\n- Langkah berikutnya: tinjau dan kirim',
 gen_t1:'Membaca permintaan',gen_t2:'Menyusun hasil',
 s_clear_data:'hapus semua data',s_clear_data_p:'Hapus riwayat sesi, key API, dan pengaturan'
},
en:{
 menu:'Open menu',settings:'settings',close:'close',add_topic:'add topic',topic_name:'Topic name',topic_ins:'What is this topic for?',save_topic:'save topic',
 ph_input:'Write a message, or / for commands',attach:'attach',send:'send',web:'web search',
 st_chat:'Chatbot',st_hermes:'Hermes Agent',idle:'standby',working:'working',ask_first:'ask first',auto:'autonomous',
 sky_on:'live sky',sky_off:'still sky',v_stage:'stage',v_focus:'focus',you:'you',new_session:'new session',
 empty_h:'What shall we work on tonight?',topic_line:'topic {n} / {i}',
 perm:'permission needed',allow:'allow',deny:'deny',allowed:'allowed',denied:'denied',copy:'copy',copied:'copied',src:'sources (simulated sample)',
 conn_hermes_ok:'hermes connected',conn_hermes_sub:'running locally on your PC',conn_chat_ok:'{p} connected',conn_chat_sub:'key stays on this device',
 conn_none:'not connected',conn_none_sub:'tap to connect',
 plate_locked:'asleep',locked:'Zzz... connect first so I can wake up.',
 w_step:'step {a} of {b}',w_next:'continue',w_back:'back',
 w_provider_h:'Choose your AI provider',w_provider_p:'Nazaverse uses your own API key, so you control the model and the cost.',
 prov_gemini:'Google Gemini',prov_gemini_d:'from Google',prov_openai:'OpenAI',prov_openai_d:'GPT models',prov_router:'OpenRouter',prov_router_d:'one key, many models',
 w_key_h:'Paste your API key',w_key_ph:'paste your key here',w_show:'show',w_hide:'hide',
 w_key_note:'The key is stored only on this device and never sent to a Nazaverse server.',
 w_howto:'how to get a key',w_how1:"Open the provider's website and sign in.",w_how2:'Find "API keys" in the dashboard.',w_how3:'Create a new key and copy it.',w_how4:'Paste it in the field above.',
 w_test:'test connection',w_testing:'testing',w_err:'That key looks too short. Check what you copied.',w_herr:'Address or key is missing.',w_ok:'Connected.',
 w_hermes_h:'Connect Hermes Agent',w_hermes_p:'Run Hermes on your computer, then enter its API server address and key.',w_addr:'server address',w_hkey:'server API key',
 w_wake_h:'Your cat is waking up',w_wake_p:'Connected. Look at the window.',
 w_persona_h:'Meet your cat',w_persona_p:'Give it a name and pick a personality. You can change it anytime in settings.',w_name:'name',w_custom:'or describe your own personality (optional)',
 w_custom_ph:'e.g. a know-it-all with a kind heart who loves talking about stars',w_start:'start',
 p_cheerful:'cheerful',p_calm:'calm',p_mischief:'mischievous',p_cheerful_d:'Upbeat and full of energy.',p_calm_d:'Gentle and soothing.',p_mischief_d:'Playful and teasing.',
 s_lang:'language',s_pet:'cat and personality',s_prompt:'personality prompt (preview)',s_skin:'skins and pets',s_unlock:'unlock all pets and skins',
 s_unlock_p:'One-time $0.57 (about Rp10,000). This is a simulation, nothing is charged.',s_unlocked:'unlocked',s_free:'free',s_locked:'locked',s_soon:'coming soon',
 s_conn:'connections',s_disc:'disconnect',s_conn_btn:'connect',s_display:'display',s_lab:'pet animation lab',
 s_lab_p:'Preview each state. In the real app, states come from AI activity.',s_next:'next',
 pet_fox:'Star fox',pet_owl:'Cosmic owl',pet_bot:'Little robot',
 sk_galaxy:'Galaxy',sk_aurora:'Aurora',sk_supernova:'Supernova',
 stt_sleep:'sleeping',stt_wake:'waking',stt_idle:'idle',stt_think:'thinking',stt_talk:'talking',stt_search:'web search',stt_vision:'see image',stt_doc:'write doc',stt_image:'make image',stt_done:'done',stt_error:'error',stt_pet:'petted',
 prompt_tpl:'You are {n}, a space cat who keeps the user company in Nazaverse. Personality: {p}. {c}Answer briefly and clearly, in the language the user writes in.',
 cmd_doc:'Create a document',cmd_search:'Search the web',cmd_persona:'Change pet personality',cmd_clear:'Start a new session',cmd_stop:'Stop the agent',cmd_voice:'Control voice replies',cmd_whoami:'Show your command access',cmd_help:'List commands',
 sim_think:'Thinking about the answer',sim_search:'Searching the web: {q}',sim_read:'Reading 3 sources',sim_outline:'Outlining',sim_write:'Writing the document',sim_conn:'Contacting the provider',
 sim_run:'Running: {c}',sim_cancel:'Action cancelled',sim_denied:'Okay, the action was not run. I kept the plan so you can ask again.',
 sim_plain:'This is a simulated reply from chatbot mode. In the real app this text comes from the model you chose through your own API key, and appears gradually like this.',
 sim_web:'Simulation: I read three sources and summarised them here. Real search results will come with links you can open.',
 sim_docr:'The document is ready. You can copy it.',sim_fail:'Simulated error: the provider rejected the request (401). Check your API key in settings.',
 doc_body:'# Document draft\n\n- Goal: short and clear\n- Main content: three supporting points\n- Next step: review and send',
 gen_t1:'Reading the request',gen_t2:'Drafting the result',
 s_clear_data:'clear all data',s_clear_data_p:'Clear session history, API keys, and settings'
}
};

export let lang = ((): string => {
  try {
    const v = localStorage.getItem('nz-lang');
    if (v === 'id' || v === 'en') return v;
  } catch (e) {}
  return (navigator.language || 'id').toLowerCase().startsWith('id') ? 'id' : 'en';
})();

export function setLang(newLang: string) {
  lang = newLang;
  try {
    localStorage.setItem('nz-lang', lang);
  } catch (er) {}
}

export const t = (k: string, v?: Record<string, string>): string => {
  let s = (T[lang] && T[lang][k]);
  if (s == null) s = T.en[k];
  if (s == null) s = k;
  if (v) {
    for (const a in v) {
      s = s.replace('{' + a + '}', v[a]);
    }
  }
  return s;
};

export const L = (o: any): string => typeof o === 'string' ? o : (o[lang] || o.en);

