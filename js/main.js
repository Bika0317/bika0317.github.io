/* ============================================================
   Theme
   ============================================================ */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('bika-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bika-theme', next);
});

/* ============================================================
   Language
   ============================================================ */
const langToggle = document.getElementById('langToggle');
let currentLang  = localStorage.getItem('bika-lang') || 'zh-TW';

// 功能：語言切換函式。寫法：更新 html lang 屬性，querySelectorAll 選出所有雙語元素並替換成對應語言的文字。
function applyLang(lang) {
  html.setAttribute('lang', lang);
  document.querySelectorAll('[data-zh],[data-en]').forEach(el => {
    const val = lang === 'zh-TW' ? el.dataset.zh : el.dataset.en;
    if (val !== undefined) el.textContent = val;
  });
}

applyLang(currentLang);

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
  localStorage.setItem('bika-lang', currentLang);
  applyLang(currentLang);
});

/* ============================================================
   Day calculation
   ============================================================ */
const LAUNCH_DATE = new Date('2026-04-26');
// 功能：計算單字解鎖天數索引。寫法：用現在時間減啟動日除以一天的毫秒數，取整數並防呆不小於 0。
function getDayIndex() {
  const ms = Date.now() - LAUNCH_DATE.getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}
let currentModalKey = null;

/* ============================================================
   Word banks (loaded from JSON)
   ============================================================ */
const wordBanks = { english: [], japanese: [], taiwanese: [] };

// 功能：單字資料載入函式。寫法：用 Promise.all 平行 fetch 三個 JSON 檔，存進 wordBanks，外層 try/catch 防錯誤。
async function loadWordBanks() {
  try {
    const [en, ja, tw] = await Promise.all([
      fetch('assets/words/english.json').then(r => r.json()),
      fetch('assets/words/japanese.json').then(r => r.json()),
      fetch('assets/words/taiwanese.json').then(r => r.json()),
    ]);
    wordBanks.english = en;
    wordBanks.japanese = ja;
    wordBanks.taiwanese = tw;
  } catch (e) {
    console.error('Word banks failed to load:', e);
  }
}

loadWordBanks();

/* ============================================================
   Audio player
   ============================================================ */
const _audio = new Audio();
_audio.crossOrigin = 'anonymous';

let _audioCtx   = null;
let _analyser   = null;
let _vizRafId   = null;
let _activeSrc  = null;
let _perimCanvas = null;

// 功能：AudioContext 初始化函式。寫法：用 if return 確保只建立一次，建立 AnalyserNode 並串接 audio 來源到輸出。
function _ensureAudioCtx() {
  if (_audioCtx) return;
  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  _analyser = _audioCtx.createAnalyser();
  _analyser.fftSize = 128;
  const src = _audioCtx.createMediaElementSource(_audio);
  src.connect(_analyser);
  _analyser.connect(_audioCtx.destination);
}

// 功能：視覺化動畫停止函式。寫法：用 cancelAnimationFrame 取消排定的下一幀，並把 id 重設為 null。
function stopViz() {
  if (_vizRafId) { cancelAnimationFrame(_vizRafId); _vizRafId = null; }
}

// 功能：頻率視覺化啟動函式。寫法：建立疊加在 Modal 上的透明 canvas，設定尺寸與頻率資料緩衝區，再呼叫內部 draw() 開始動畫。
function startPerimeterViz() {
  stopViz();
  const modal = document.getElementById('modal');
  if (!modal) return;

  if (!_perimCanvas) {
    _perimCanvas = document.createElement('canvas');
    Object.assign(_perimCanvas.style, {
      position: 'absolute', inset: '0',
      pointerEvents: 'none', zIndex: '10',
      borderRadius: 'inherit',
    });
  }
  if (!modal.contains(_perimCanvas)) modal.appendChild(_perimCanvas);
  _perimCanvas.width  = modal.offsetWidth;
  _perimCanvas.height = modal.offsetHeight;

  const ctx2 = _perimCanvas.getContext('2d');
  const buf  = _analyser ? new Uint8Array(_analyser.frequencyBinCount) : new Uint8Array(64);

  // 功能：視覺化每幀繪製函式。寫法：讀取頻率資料，算出邊框格子序列，用 pv() 取得每格深度/透明度畫光條，再疊霧化漸層。
  function draw(ts) {
    _vizRafId = requestAnimationFrame(draw);
    if (_analyser) _analyser.getByteFrequencyData(buf);

    const t = ts * 0.001;
    const W = _perimCanvas.width, H = _perimCanvas.height;
    ctx2.clearRect(0, 0, W, H);

    const SLOT  = 4;    // px per bar slot
    const BAR   = 3;    // bar thickness (px)
    const DEPTH = 42;   // max bar depth from edge (px)
    const SPEED = 0.65; // clockwise revolutions / second
    const WAVES = 2;    // wave peaks visible around the perimeter at once

    const hS    = Math.ceil(W / SLOT);
    const vS    = Math.ceil(H / SLOT);
    const total = 2 * (hS + vS);
    const hasAudio = buf.some(v => v > 8);

    // Average audio level (0–1) for breathing effects
    const avgLevel = hasAudio
      ? buf.reduce((s, v) => s + v, 0) / buf.length / 255
      : 0.18;

    // 功能：單格光條深度/透明度計算函式。寫法：用 sin 波算出跑動波形，混合頻率資料(或假波形)算出深度 d 與透明度 a。
    function pv(g) {
      const p    = g / total;
      const wave = (Math.sin(p * Math.PI * 2 * WAVES - t * SPEED * Math.PI * 2) + 1) * 0.5;
      const fIdx = Math.floor(p * buf.length * 0.85);
      const freq = hasAudio
        ? buf[fIdx] / 255
        : 0.22 + Math.sin(t * 0.45 + p * Math.PI * 8) * 0.12;
      const c = freq * (0.18 + wave * 0.82);
      return { d: Math.max(1, c * DEPTH), a: 0.05 + c * 0.72 };
    }

    // ── bars with smoke glow ──
    ctx2.fillStyle   = '#ffffff';
    ctx2.shadowColor = 'rgba(255,255,255,0.6)';
    ctx2.shadowBlur  = 10 + avgLevel * 14;

    let g = 0;
    // Top: left → right, bars grow downward
    for (let i = 0; i < hS; i++, g++) {
      const { d, a } = pv(g);
      ctx2.globalAlpha = a;
      ctx2.fillRect(i * SLOT, 0, BAR, d);
    }
    // Right: top → bottom, bars grow leftward
    for (let i = 0; i < vS; i++, g++) {
      const { d, a } = pv(g);
      ctx2.globalAlpha = a;
      ctx2.fillRect(W - d, i * SLOT, d, BAR);
    }
    // Bottom: right → left, bars grow upward
    for (let i = 0; i < hS; i++, g++) {
      const { d, a } = pv(g);
      ctx2.globalAlpha = a;
      ctx2.fillRect(W - (i + 1) * SLOT, H - d, BAR, d);
    }
    // Left: bottom → top, bars grow rightward
    for (let i = 0; i < vS; i++, g++) {
      const { d, a } = pv(g);
      ctx2.globalAlpha = a;
      ctx2.fillRect(0, H - (i + 1) * SLOT, d, BAR);
    }

    // ── fog overlay — gradient wash from each edge ──
    ctx2.shadowBlur  = 0;
    ctx2.globalAlpha = 1;

    const fogDepth = 58 + avgLevel * 28;
    const fogAlpha = 0.038 + avgLevel * 0.055;

    // 功能：邊緣霧化漸層繪製工具函式。寫法：用 createLinearGradient 從邊緣的白色漸層到透明，填色到指定矩形範圍，四邊各呼叫一次。
    function fog(x0, y0, x1, y1, rx, ry, rw, rh) {
      const gr = ctx2.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, `rgba(255,255,255,${fogAlpha})`);
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      ctx2.fillStyle = gr;
      ctx2.fillRect(rx, ry, rw, rh);
    }

    fog(0, 0,   0,         fogDepth,    0,           0,          W,        fogDepth); // top
    fog(W, 0,   W-fogDepth, 0,          W-fogDepth,  0,          fogDepth, H);        // right
    fog(0, H,   0,         H-fogDepth,  0,           H-fogDepth, W,        fogDepth); // bottom
    fog(0, 0,   fogDepth,  0,           0,           0,          fogDepth, H);        // left
  }
  draw(0);
}

// 功能：時間格式化函式。寫法：用 Math.floor 取分鐘與秒數，padStart 補零成 m:ss 字串。
function fmtTime(s) {
  if (!isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

_audio.addEventListener('timeupdate', () => {
  if (!_activeSrc) return;
  const el = document.querySelector(`.audio-track[data-audio="${_activeSrc}"]`);
  if (!el) return;
  const pct  = _audio.duration ? (_audio.currentTime / _audio.duration) * 100 : 0;
  const fill = el.querySelector('.audio-progress-fill');
  const time = el.querySelector('.audio-time');
  if (fill) fill.style.width = pct + '%';
  if (time) time.textContent = `${fmtTime(_audio.currentTime)} / ${fmtTime(_audio.duration)}`;
});

_audio.addEventListener('ended', () => {
  const el = _activeSrc && document.querySelector(`.audio-track[data-audio="${_activeSrc}"]`);
  if (el) {
    const btn  = el.querySelector('.audio-play-btn');
    const fill = el.querySelector('.audio-progress-fill');
    if (btn)  { btn.textContent = '▶'; btn.classList.remove('playing'); }
    if (fill) fill.style.width = '0%';
  }
  _activeSrc = null;
  // perimeter viz stays running in idle mode after track ends
});

/* ============================================================
   Modal data
   ============================================================ */
const MODAL_DATA = {
  paintings: {
    zh: { title: '畫作',     subtitle: '手繪 · MC建築 · 電繪' },
    en: { title: 'Paintings', subtitle: 'Hand-drawn · MC Builds · Digital Art' },
    type: 'gallery',
    categories: [
      {
        key: 'hand', zh: '手繪', en: 'Hand-drawn',
        images: [
          { src: 'assets/paintings/手繪/Anya.jpeg',            zh: 'Anya',         en: 'Anya' },
          { src: 'assets/paintings/手繪/Anya2.jpg',            zh: 'Anya 2',       en: 'Anya 2' },
          { src: 'assets/paintings/手繪/Asuna.png',            zh: 'Asuna',        en: 'Asuna' },
          { src: 'assets/paintings/手繪/InaPaint.jpg',         zh: 'Ina Paint',    en: 'Ina Paint' },
          { src: 'assets/paintings/手繪/Mizuki簡筆.jpg',       zh: 'Mizuki 簡筆',  en: 'Mizuki Sketch' },
          { src: 'assets/paintings/手繪/Seki簡筆.jpg',         zh: 'Seki 簡筆',    en: 'Seki Sketch' },
          { src: 'assets/paintings/手繪/公子.jpg',             zh: '公子',         en: 'Tartaglia' },
          { src: 'assets/paintings/手繪/凱莉絲.jpg',           zh: '凱莉絲',       en: 'Kasli' },
          { src: 'assets/paintings/手繪/和泉紗霧.jpeg',        zh: '和泉紗霧',     en: 'Izumi Sagiri' },
          { src: 'assets/paintings/手繪/小精靈.jpg',           zh: '小精靈',       en: "Nature's Guardians Elemental Pixies" },
          { src: 'assets/paintings/手繪/狐姬百荷.jpg',         zh: '狐姬百荷',     en: 'Himeyuri' },
          { src: 'assets/paintings/手繪/狐狸.png',             zh: '狐狸',         en: 'Fox' },
          { src: 'assets/paintings/手繪/美女神.jpg',           zh: '美女神',       en: 'Aphrodite' },
          { src: 'assets/paintings/手繪/貓咪大戰爭1.jpg',      zh: '貓咪大戰爭 1',      en: 'Nyanko Daisensou 1' },
          { src: 'assets/paintings/手繪/貓咪大戰爭初音.jpg',   zh: '貓咪大戰爭 初音',   en: 'Nyanko Daisensou Miku' },
          { src: 'assets/paintings/手繪/貓咪大戰爭雪初音.jpg', zh: '貓咪大戰爭 雪初音', en: 'Nyanko Daisensou Snow Miku' },
          { src: 'assets/paintings/手繪/貓咪女王.jpg',         zh: '貓咪女王',     en: 'Empress Cat' },
          { src: 'assets/paintings/手繪/隨畫1.jpg',            zh: '隨畫 1',       en: 'Sketch 1' },
        ],
      },
      {
        key: 'mc', zh: 'MC建築', en: 'MC Builds',
        images: [
          { src: 'assets/paintings/MC建築/Gura.png',           zh: 'Gura',         en: 'Gura' },
          { src: 'assets/paintings/MC建築/Ina.png',            zh: 'Ina',          en: 'Ina' },
          { src: 'assets/paintings/MC建築/海軍基地.png',       zh: '海軍基地',     en: 'Naval Base' },
          { src: 'assets/paintings/MC建築/玻璃瓶.png',         zh: '玻璃瓶',       en: 'Glass Bottle' },
          { src: 'assets/paintings/MC建築/現代建築.jpeg',      zh: '現代建築',     en: 'Modern Architecture' },
          { src: 'assets/paintings/MC建築/皮卡丘.jpeg',        zh: '皮卡丘',       en: 'Pikachu' },
          { src: 'assets/paintings/MC建築/肥嘟嘟佐衛門.jpeg', zh: '肥嘟嘟佐衛門', en: 'Chubby Doraemon' },
          { src: 'assets/paintings/MC建築/金閣寺.png',         zh: '金閣寺',       en: 'Kinkaku-ji' },
        ],
      },
      {
        key: 'digital', zh: '電繪', en: 'Digital Art',
        images: [
          { src: 'assets/paintings/電繪/龍貓.png', zh: '龍貓', en: 'Totoro' },
        ],
      },
    ],
  },
  audio: {
    zh: { title: '音樂作品', subtitle: 'Cover · 音樂平台連結' },
    en: { title: 'Audio Works', subtitle: 'Covers · Music Platform Links' },
    type: 'audio',
    tracks: [
      { zh: '紅塵客棧', en: 'Hong-Chen Inn', audio: 'assets/music/紅塵客棧.mp3', link: null, platform: null },
      { zh: '蘇幕遮',   en: 'Su Mu Zhe',    link: 'https://youtu.be/hrPMTFN7m30?si=Pw4TzNXZRtJxHhha', platform: 'YouTube' },
    ],
  },
  code: {
    zh: { title: '程式作品',      subtitle: '進行中的程式專案 · 筆記內容' },
    en: { title: 'Code Projects', subtitle: 'Ongoing Projects · Study Notes' },
    type: 'code',
    projects: [
      {
        zh: '自動化排班系統', en: 'Auto Scheduling System',
        descZh: '用網頁自動產生班表，減少手動排班的時間與失誤',
        descEn: 'A web tool that auto-generates work schedules to save time and reduce manual errors.',
        url: 'https://bika0317.github.io/Auto-Scheduling-System/',
        tags: ['HTML'],
        icon: 'assets/projects/auto-scheduling-system.png',
      },
    ],
    notes: [
      { zh: 'SQL 完整筆記', en: 'SQL Complete Notes', source: 'assets/note/sql-notes.json' },
    ],
  },
  review: {
    zh: { title: '備審經歷',          subtitle: '學習歷程 · 作品集備審資料' },
    en: { title: 'Academic Portfolio', subtitle: 'Learning Journey · Academic Review' },
    type: 'documents',
    docs: [
      { src: 'assets/review/TKUIM多元綜整心得.pdf',   zh: 'TKUIM 多元綜整心得',   en: 'TKUIM Integrated Reflection' },
      { src: 'assets/review/TKUIM學習歷程自述.pdf',   zh: 'TKUIM 學習歷程自述',   en: 'TKUIM Learning Journey' },
    ],
    promo: {
      zh: '若你在準備學習歷程或備審資料時需要協助，歡迎私訊 IG 或加入 Discord 交流！',
      en: 'Need help with your learning journey or academic portfolio? Feel free to DM on IG or join the Discord!',
      ig: 'https://www.instagram.com/jia_yu_0317',
      discord: 'https://discord.gg/37uRdVjXzU',
    },
  },
  english: {
    zh: { title: '英文小教室', subtitle: '每日一詞・跟著比卡學英文' },
    en: { title: 'English Classroom', subtitle: 'One word a day · Learn English with Bika' },
    type: 'vocabulary',
  },
  japanese: {
    zh: { title: '日文小教室', subtitle: '每日一詞・跟著比卡學日文' },
    en: { title: 'Japanese Classroom', subtitle: 'One word a day · Learn Japanese with Bika' },
    type: 'vocabulary',
  },
  taiwanese: {
    zh: { title: '台語小教室', subtitle: '每日一詞・跟著比卡學台語' },
    en: { title: 'Taiwanese Classroom', subtitle: 'One word a day · Learn Taiwanese with Bika' },
    type: 'vocabulary',
  },
};

/* ============================================================
   Modal open / close
   ============================================================ */
const overlay   = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const closeBtn  = document.getElementById('modalClose');

// 功能：單字 Modal 渲染函式。寫法：依 getDayIndex 取出當天單字，組成模板字串回傳 HTML。
function renderVocabModal(data, lang, key) {
  const bank = wordBanks[key] || [];
  if (!bank || bank.length === 0) {
    const msg = lang === 'zh' ? '教室即將開課，敬請期待！' : 'Classroom opening soon, stay tuned!';
    return `<p class="vocab-empty">${msg}</p>`;
  }
  const idx    = getDayIndex() % bank.length;
  const w      = bank[idx];
  const dayNum = getDayIndex() + 1;
  const dayLabel = lang === 'zh' ? `第 ${dayNum} 天` : `Day ${dayNum}`;
  return `
    <div class="vocab-card">
      <span class="vocab-day">${dayLabel}</span>
      <div class="vocab-main">
        <span class="vocab-hanzi">${w.hanzi}</span>
        <span class="vocab-tailo">${w.tailo}</span>
      </div>
      <p class="vocab-meaning">${w.meaning}</p>
      ${w.usage ? `<p class="vocab-usage">💬 ${w.usage}</p>` : ''}
    </div>
  `;
}

// 功能：音樂 Modal 渲染函式。寫法：用 filter/map 分別產生本地播放器清單與外部連結清單 HTML，依資料存在與否決定要不要包頁籤。
function renderAudioModal(data, lang) {
  const comingSoon  = lang === 'zh' ? '即將上傳' : 'Coming soon';
  const listenLabel = lang === 'zh' ? '前往收聽' : 'Listen';
  const volLabel    = lang === 'zh' ? '音量' : 'Volume';
  const localLabel  = lang === 'zh' ? '立即聽' : 'Listen Now';
  const extLabel    = lang === 'zh' ? '其他平台' : 'Streaming';

  const localTracks = data.tracks.filter(t => t.audio);
  const extTracks   = data.tracks.filter(t => !t.audio);

  const localHtml = localTracks.map(t => {
    const title = lang === 'zh' ? t.zh : t.en;
    return `
      <div class="audio-track" data-audio="${t.audio}">
        <button class="audio-play-btn" aria-label="Play / Pause">▶</button>
        <div class="audio-track-info">
          <p class="audio-track-title">${title}</p>
          <div class="audio-progress-wrap">
            <div class="audio-progress-bar"><div class="audio-progress-fill"></div></div>
            <span class="audio-time">0:00 / 0:00</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const extHtml = extTracks.map(t => {
    const title   = lang === 'zh' ? t.zh : t.en;
    const linkHtml = t.link
      ? `<a href="${t.link}" target="_blank" rel="noopener" class="audio-link">${listenLabel} · ${t.platform} ↗</a>`
      : `<span class="audio-link audio-link-soon">${comingSoon}</span>`;
    return `
      <div class="audio-track">
        <span class="audio-note">🎵</span>
        <div class="audio-track-info">
          <p class="audio-track-title">${title}</p>
          ${linkHtml}
        </div>
      </div>
    `;
  }).join('');

  const volumeHtml = `
    <div class="audio-volume-wrap">
      <span class="audio-vol-icon" id="audioVolIcon">🔊</span>
      <input type="range" class="audio-vol-slider" id="audioVolSlider"
             min="0" max="1" step="0.01" value="1" aria-label="${volLabel}">
    </div>
  `;

  // Only show real tabs when both local + external tracks exist; otherwise just render the one panel.
  if (localTracks.length && extTracks.length) {
    return `
      <div class="modal-tabs" role="tablist">
        <button class="modal-tab active" data-tab="local" role="tab" aria-selected="true">${localLabel}</button>
        <button class="modal-tab" data-tab="ext" role="tab" aria-selected="false">${extLabel}</button>
      </div>
      <div class="modal-tab-panel active" data-tab-panel="local">
        <div class="audio-list">${localHtml}</div>
        ${volumeHtml}
      </div>
      <div class="modal-tab-panel" data-tab-panel="ext">
        <div class="audio-list">${extHtml}</div>
      </div>
    `;
  }
  if (localTracks.length) return `<div class="modal-tab-panel active" data-tab-panel="local"><div class="audio-list">${localHtml}</div>${volumeHtml}</div>`;
  return `<div class="modal-tab-panel active" data-tab-panel="ext"><div class="audio-list">${extHtml}</div></div>`;
}

// 功能：畫作 Modal 渲染函式。寫法：用 map 把每個分類轉成頁籤按鈕與對應的圖片格線面板。
function renderGalleryModal(data, lang) {
  const emptyMsg = lang === 'zh' ? '作品即將上傳，敬請期待！' : 'Works coming soon, stay tuned!';

  const tabsHtml = data.categories.map((cat, i) => `
    <button class="modal-tab${i === 0 ? ' active' : ''}" data-tab="${cat.key}" role="tab" aria-selected="${i === 0}">${lang === 'zh' ? cat.zh : cat.en}</button>
  `).join('');

  const panelsHtml = data.categories.map((cat, i) => {
    const gridHtml = cat.images.length ? cat.images.map(img => `
      <div class="gallery-item" onclick="openLightbox('${img.src}', '${lang === 'zh' ? img.zh : img.en}')">
        <img src="${img.src}" alt="${lang === 'zh' ? img.zh : img.en}" class="gallery-img" loading="lazy">
        <p class="gallery-caption">${lang === 'zh' ? img.zh : img.en}</p>
      </div>
    `).join('') : '';
    const body = cat.images.length ? `<div class="gallery-grid">${gridHtml}</div>` : `<p class="vocab-empty">${emptyMsg}</p>`;
    return `<div class="modal-tab-panel${i === 0 ? ' active' : ''}" data-tab-panel="${cat.key}">${body}</div>`;
  }).join('');

  return `
    <div class="modal-tabs" role="tablist">${tabsHtml}</div>
    ${panelsHtml}
  `;
}

// 功能：程式作品 Modal 渲染函式。寫法：map 產生專案卡片（附固定的「敬請期待」佔位卡）與筆記卡片，組成含頁籤的 HTML。
function renderCodeModal(data, lang) {
  const projectsLabel = lang === 'zh' ? '進行中的程式專案' : 'Ongoing Projects';
  const notesLabel    = lang === 'zh' ? '筆記內容' : 'Notes';
  const viewLabel     = lang === 'zh' ? '查看專案' : 'View Project';
  const moreLabel     = lang === 'zh' ? '更多專案，敬請期待' : 'More projects coming soon';

  const projectsHtml = data.projects.map(p => `
    <a class="project-card" href="${p.url}" target="_blank" rel="noopener">
      <img class="project-card-icon" src="${p.icon}" alt="" onerror="this.style.display='none'">
      <p class="project-card-title">${lang === 'zh' ? p.zh : p.en}</p>
      <p class="project-card-desc">${lang === 'zh' ? p.descZh : p.descEn}</p>
      <div class="project-card-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
      <span class="project-card-arrow">${viewLabel} →</span>
    </a>
  `).join('') + `
    <div class="project-card project-card-more">
      <span class="project-card-more-text">${moreLabel}</span>
    </div>
  `;

  const noteCardsHtml = data.notes.map((note, i) => `
    <div class="notes-card" data-note-idx="${i}">
      <span class="notes-card-icon">📘</span>
      <p class="notes-card-title">${lang === 'zh' ? note.zh : note.en}</p>
      <span class="notes-card-arrow">→</span>
    </div>
  `).join('');

  return `
    <div class="modal-tabs" role="tablist">
      <button class="modal-tab active" data-tab="projects" role="tab" aria-selected="true">${projectsLabel}</button>
      <button class="modal-tab" data-tab="notes" role="tab" aria-selected="false">${notesLabel}</button>
    </div>
    <div class="modal-tab-panel active" data-tab-panel="projects">
      <div class="project-list">${projectsHtml}</div>
    </div>
    <div class="modal-tab-panel" data-tab-panel="notes">
      <div class="notes-list" id="notesList">${noteCardsHtml}</div>
      <div class="notes-detail" id="notesDetail"></div>
    </div>
  `;
}

const _noteCache = {};

// 功能：筆記章節載入函式。寫法：先查 _noteCache 快取，沒有才 fetch JSON 並存進快取後回傳。
async function loadNoteChapters(source) {
  if (_noteCache[source]) return _noteCache[source];
  const res = await fetch(source);
  const chapters = await res.json();
  _noteCache[source] = chapters;
  return chapters;
}

// 功能：程式作品 Modal 互動綁定函式。寫法：綁定筆記卡片點擊事件，非同步載入章節後渲染手風琴並綁定展開/返回按鈕。
function setupCodeModal(data, lang) {
  setupModalTabs();

  const notesList   = document.getElementById('notesList');
  const notesDetail = document.getElementById('notesDetail');
  if (!notesList || !notesDetail) return;

  const backLabel  = lang === 'zh' ? '← 返回筆記列表' : '← Back to notes';
  const loadingMsg = lang === 'zh' ? '載入中…' : 'Loading…';

  notesList.querySelectorAll('.notes-card').forEach(card => {
    card.addEventListener('click', async () => {
      const note  = data.notes[+card.dataset.noteIdx];
      const title = lang === 'zh' ? note.zh : note.en;

      notesDetail.innerHTML = `<p class="notes-loading">${loadingMsg}</p>`;
      notesList.classList.add('hidden');
      notesDetail.classList.add('active');

      const chapters = await loadNoteChapters(note.source);
      const chaptersHtml = chapters.map((ch, i) => `
        <div class="notes-chapter">
          <button class="notes-chapter-toggle" data-chapter-idx="${i}">
            <span class="notes-chapter-num">${String(i + 1).padStart(2, '0')}</span>
            <span class="notes-chapter-title">${ch.title}</span>
            <span class="notes-chapter-arrow">▾</span>
          </button>
          <div class="notes-chapter-body">${ch.html}</div>
        </div>
      `).join('');

      notesDetail.innerHTML = `
        <button class="notes-back-btn" id="notesBackBtn">${backLabel}</button>
        <p class="notes-set-title">${title}</p>
        <div class="notes-chapters">${chaptersHtml}</div>
      `;

      document.getElementById('notesBackBtn').addEventListener('click', () => {
        notesDetail.classList.remove('active');
        notesList.classList.remove('hidden');
      });

      notesDetail.querySelectorAll('.notes-chapter-toggle').forEach(btn => {
        btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
      });
    });
  });
}

// 功能：Modal 開啟函式。寫法：依 data.type 用 if/else 呼叫對應的 render 函式產生內容，寫入 DOM 並顯示。
function openModal(key) {
  const data = MODAL_DATA[key];
  if (!data) return;

  const lang = currentLang === 'zh-TW' ? 'zh' : 'en';
  const { title, subtitle } = data[lang];

  let content;
  if (data.type === 'documents') {
    const openLabel = lang === 'zh' ? '開啟文件' : 'Open';
    const items = data.docs.map(doc => `
      <div class="doc-card">
        <span class="doc-icon">📄</span>
        <div class="doc-info">
          <p class="doc-name">${lang === 'zh' ? doc.zh : doc.en}</p>
          <p class="doc-ext">PDF</p>
        </div>
        <a href="${doc.src}" target="_blank" rel="noopener" class="card-btn doc-btn">${openLabel} ↗</a>
      </div>
    `).join('');
    const promoHtml = data.promo ? `
      <div class="doc-promo">
        <p class="doc-promo-text">${lang === 'zh' ? data.promo.zh : data.promo.en}</p>
        <div class="doc-promo-links">
          <a href="${data.promo.ig}" target="_blank" rel="noopener" class="doc-promo-icon" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07C3.68 21.62 2.16 20.08 2.1 16.85 2.02 15.58 2 15.2 2 12c0-3.2.01-3.58.07-4.85C2.22 3.85 3.77 2.31 7 2.16c1.27-.06 1.65-.07 4.85-.07H12zm0-2.16c-3.26 0-3.67.01-4.95.07C2.7 2.27.27 4.7.07 9.05.01 10.33 0 10.74 0 12s.01 1.67.07 2.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 21.99 8.74 22 12 22s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-2.95s-.01-1.67-.07-2.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
            </svg>
          </a>
          <a href="${data.promo.discord}" target="_blank" rel="noopener" class="doc-promo-icon" aria-label="Discord">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c1.2702.9485 2.4994 1.5223 3.671 1.9223a.0772.0772 0 00.0842-.0276c.262-.3953.4982-.8126.7026-1.2548a.0775.0775 0 00-.0494-.1066 13.0986 13.0986 0 01-1.8722-.8909.0766.0766 0 01-.0076-.1269c.1258-.094.2517-.1916.3718-.2904a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.0992.246.1968.3718.2914a.0766.0766 0 01-.0066.1269c-.598.3493-1.2197.6438-1.8729.8919a.0772.0772 0 00-.0466.1052c.2058.4421.4419.8589.7012 1.2542a.0762.0762 0 00.0842.0276c1.1727-.4001 2.4019-.9738 3.6721-1.9223a.0789.0789 0 00.0312-.055c.5004-5.177-.8382-9.6739-3.5485-13.6604a.0628.0628 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9555-2.4189 2.1568-2.4189 1.2108 0 2.1764 1.0952 2.1567 2.419 0 1.3332-.9555 2.4189-2.1567 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1763 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>
        </div>
      </div>
    ` : '';
    content = `<div class="doc-list">${items}</div>${promoHtml}`;
  } else if (data.type === 'gallery') {
    content = renderGalleryModal(data, lang);
  } else if (data.type === 'vocabulary') {
    const glossaryLabel = lang === 'zh' ? '單字本' : 'Word Bank';
    content = `
      <button class="modal-glossary-btn" id="modalGlossaryBtn" aria-label="${glossaryLabel}">☰</button>
      <div class="vocab-list">${renderVocabModal(data, lang, key)}</div>
    `;
  } else if (data.type === 'audio') {
    content = renderAudioModal(data, lang);
  } else if (data.type === 'code') {
    content = renderCodeModal(data, lang);
  }

  modalBody.innerHTML = `
    <h2>${title}</h2>
    <p class="modal-subtitle">${subtitle}</p>
    ${content}
  `;

  if (data.type === 'audio') setupAudioModal();
  if (data.type === 'code') setupCodeModal(data, lang);
  if (data.type === 'gallery') setupModalTabs();
  currentModalKey = key;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

// 功能：Modal 關閉函式。寫法：移除 active 樣式、暫停音樂、停止視覺化並移除疊加 canvas。
function closeModal() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (!_audio.paused) _audio.pause();
  stopViz();
  if (_perimCanvas) { _perimCanvas.remove(); _perimCanvas = null; }
}

// 功能：音量圖示更新函式。寫法：用三元運算子依音量區間切換對應的圖示文字。
function updateVolIcon(vol) {
  const icon = document.getElementById('audioVolIcon');
  if (!icon) return;
  icon.textContent = vol === 0 ? '🔇' : vol < 0.35 ? '🔈' : vol < 0.7 ? '🔉' : '🔊';
}

// 功能：頁籤切換綁定函式。寫法：對每個 .modal-tab 綁 click，切換 active 樣式並顯示對應的面板。
function setupModalTabs() {
  document.querySelectorAll('.modal-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const target = tabBtn.dataset.tab;
      document.querySelectorAll('.modal-tab').forEach(b => {
        b.classList.toggle('active', b === tabBtn);
        b.setAttribute('aria-selected', b === tabBtn ? 'true' : 'false');
      });
      document.querySelectorAll('.modal-tab-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.tabPanel === target);
      });
    });
  });
}

// 功能：音樂 Modal 互動綁定函式。寫法：啟動視覺化與頁籤，綁定音量滑桿 input 事件與每個音軌的播放/進度條 click 事件。
function setupAudioModal() {
  startPerimeterViz(); // idle wave starts immediately when modal opens
  setupModalTabs();

  // ── volume slider ──
  const volSlider = document.getElementById('audioVolSlider');
  if (volSlider) {
    volSlider.value = _audio.volume;
    const pct = _audio.volume * 100;
    volSlider.style.background =
      `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
    updateVolIcon(_audio.volume);

    volSlider.addEventListener('input', () => {
      const v = parseFloat(volSlider.value);
      _audio.volume = v;
      updateVolIcon(v);
      volSlider.style.background =
        `linear-gradient(to right, var(--accent) ${v * 100}%, var(--border) ${v * 100}%)`;
    });
  }

  // ── track controls ──
  document.querySelectorAll('.audio-track[data-audio]').forEach(trackEl => {
    const src = trackEl.dataset.audio;
    const btn = trackEl.querySelector('.audio-play-btn');
    const bar = trackEl.querySelector('.audio-progress-bar');

    btn.addEventListener('click', () => {
      _ensureAudioCtx();
      _audioCtx.resume();
      if (_activeSrc !== src) {
        document.querySelectorAll('.audio-play-btn').forEach(b => { b.textContent = '▶'; b.classList.remove('playing'); });
        document.querySelectorAll('.audio-progress-fill').forEach(f => f.style.width = '0%');
        document.querySelectorAll('.audio-time').forEach(t => t.textContent = '0:00 / 0:00');
        _audio.src = src;
        _activeSrc = src;
        _audio.play();
        btn.textContent = '⏸';
        btn.classList.add('playing');
        startPerimeterViz(); // ensure viz is running when switching tracks
      } else if (_audio.paused) {
        _audio.play();
        btn.textContent = '⏸';
        btn.classList.add('playing');
        startPerimeterViz(); // resume viz
      } else {
        _audio.pause();
        btn.textContent = '▶';
        btn.classList.remove('playing');
        stopViz(); // freeze viz on pause
      }
    });

    bar.addEventListener('click', e => {
      if (_activeSrc !== src || !_audio.duration) return;
      const rect = bar.getBoundingClientRect();
      _audio.currentTime = ((e.clientX - rect.left) / rect.width) * _audio.duration;
    });
  });
}

document.querySelectorAll('.card-btn[data-modal]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openModal(btn.getAttribute('data-modal'));
  });
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ============================================================
   Glossary (單字本)
   ============================================================ */
// 功能：單字本 Modal 開啟函式。寫法：用 slice 取出已解鎖的單字，map 成可展開的 details 列表並寫入 Modal。
function openGlossary() {
  const lang   = currentLang === 'zh-TW' ? 'zh' : 'en';
  const title  = lang === 'zh' ? '單字本' : 'Word Bank';
  const sub    = lang === 'zh' ? '已解鎖的單字' : 'Unlocked words';
  const bank   = wordBanks[currentModalKey] || [];
  const dayIdx = getDayIndex();
  const unlocked = bank.slice(0, dayIdx + 1);

  let content;
  if (unlocked.length === 0) {
    const empty = lang === 'zh' ? '還沒有收錄任何單字' : 'No words yet';
    content = `<p class="vocab-empty">${empty}</p>`;
  } else {
    const items = [...unlocked].reverse().map((w, i) => {
      const dayNum   = unlocked.length - i;
      const dayLabel = lang === 'zh' ? `第 ${dayNum} 天` : `Day ${dayNum}`;
      return `
        <details class="glossary-item">
          <summary class="glossary-summary">
            <span class="glossary-day">${dayLabel}</span>
            <span class="glossary-hanzi-preview">${w.hanzi}</span>
            <span class="glossary-arrow">›</span>
          </summary>
          <div class="glossary-detail">
            <span class="vocab-hanzi">${w.hanzi}</span>
            <span class="vocab-tailo">${w.tailo}</span>
            <p class="vocab-meaning">${w.meaning}</p>
            ${w.usage ? `<p class="vocab-usage">💬 ${w.usage}</p>` : ''}
          </div>
        </details>
      `;
    }).join('');
    content = `<div class="glossary-list">${items}</div>`;
  }

  modalBody.innerHTML = `<h2>${title}</h2><p class="modal-subtitle">${sub}</p>${content}`;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

modalBody.addEventListener('click', e => {
  if (e.target.id === 'modalGlossaryBtn') openGlossary();
});

/* ============================================================
   Lightbox
   ============================================================ */
// 功能：圖片燈箱開啟函式。寫法：把圖片來源與說明文字寫入燈箱元素，加上 active 樣式顯示。
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// 功能：圖片燈箱關閉函式。寫法：移除燈箱的 active 樣式並還原 body 的捲動狀態。
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox' || e.target.id === 'lightboxClose') closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeModal(); }
});

/* ============================================================
   Scroll reveal
   ============================================================ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================================
   Nav scroll shadow
   ============================================================ */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10 ? '0 4px 30px rgba(0,0,0,0.3)' : 'none';
}, { passive: true });

/* ============================================================
   Visit counter (CountAPI)
   ============================================================ */
(async () => {
  const countEl = document.getElementById('visitCount');
  try {
    const res = await fetch('https://abacus.jasoncameron.dev/hit/bika0317-github-io/visits');
    const data = await res.json();
    countEl.textContent = data.value.toLocaleString();
  } catch {
    countEl.textContent = '?';
  }
})();
