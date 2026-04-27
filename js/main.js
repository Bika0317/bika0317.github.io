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
function getDayIndex() {
  const ms = Date.now() - LAUNCH_DATE.getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}
let currentModalKey = null;

/* ============================================================
   Word banks (loaded from JSON)
   ============================================================ */
const wordBanks = { english: [], japanese: [], taiwanese: [] };

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
   Modal data
   ============================================================ */
const MODAL_DATA = {
  paintings: {
    zh: { title: '畫作',     subtitle: '小插畫、minecraft建築、仿畫' },
    en: { title: 'Paintings', subtitle: 'Illustrations · Minecraft Builds · Studies' },
    type: 'gallery',
    images: [
      /* 加圖片在這裡 ↓
         { src: 'assets/paintings/your-image.jpg', zh: '作品名稱', en: 'Title' }, */
      { src: 'assets/paintings/Ina.png',              zh: 'Ina',          en: 'Ina' },
      { src: 'assets/paintings/InaPaint.jpg',         zh: 'Ina Paint',    en: 'Ina Paint' },
      { src: 'assets/paintings/Gura.png',             zh: 'Gura',         en: 'Gura' },
      { src: 'assets/paintings/Anya.jpeg',            zh: 'Anya',         en: 'Anya' },
      { src: 'assets/paintings/Anya2.jpg',            zh: 'Anya 2',       en: 'Anya 2' },
      { src: 'assets/paintings/Asuna.png',            zh: 'Asuna',        en: 'Asuna' },
      { src: 'assets/paintings/和泉紗霧.jpeg',        zh: '和泉紗霧',     en: 'Izumi Sagiri' },
      { src: 'assets/paintings/狐姬百荷.jpg',         zh: '狐姬百荷',     en: 'Himeyuri' },
      { src: 'assets/paintings/凱莉絲.jpg',           zh: '凱莉絲',       en: 'Kasli' },
      { src: 'assets/paintings/美女神.jpg',           zh: '美女神',       en: 'Aphrodite' },
      { src: 'assets/paintings/公子.jpg',             zh: '公子',         en: 'Tartaglia' },
      { src: 'assets/paintings/Seki簡筆.jpg',         zh: 'Seki 簡筆',    en: 'Seki Sketch' },
      { src: 'assets/paintings/Mizuki簡筆.jpg',       zh: 'Mizuki 簡筆',  en: 'Mizuki Sketch' },
      { src: 'assets/paintings/貓咪女王.jpg',         zh: '貓咪女王',     en: 'Empress Cat' },
      { src: 'assets/paintings/小精靈.jpg',           zh: '小精靈',       en: "Nature's Guardians Elemental Pixies" },
      { src: 'assets/paintings/皮卡丘.jpeg',          zh: '皮卡丘',       en: 'Pikachu' },
      { src: 'assets/paintings/肥嘟嘟佐衛門.jpeg',   zh: '肥嘟嘟佐衛門', en: 'Chubby Doraemon' },
      { src: 'assets/paintings/貓咪大戰爭1.jpg',      zh: '貓咪大戰爭 1',      en: 'Nyanko Daisensou 1' },
      { src: 'assets/paintings/貓咪大戰爭初音.jpg',   zh: '貓咪大戰爭 初音',   en: 'Nyanko Daisensou Miku' },
      { src: 'assets/paintings/貓咪大戰爭雪初音.jpg', zh: '貓咪大戰爭 雪初音', en: 'Nyanko Daisensou Snow Miku' },
      { src: 'assets/paintings/玻璃瓶.png',           zh: '玻璃瓶',       en: 'Glass Bottle' },
      { src: 'assets/paintings/格致中學.jpeg',        zh: '格致中學',     en: 'Gezhi High School' },
      { src: 'assets/paintings/海軍基地.jpeg',        zh: '海軍基地',     en: 'Naval Base' },
      { src: 'assets/paintings/現代建築.jpeg',        zh: '現代建築',     en: 'Modern Architecture' },
      { src: 'assets/paintings/金閣寺.png',           zh: '金閣寺',       en: 'Kinkaku-ji' },
      { src: 'assets/paintings/隨畫1.jpg',            zh: '隨畫 1',       en: 'Sketch 1' },
    ],
  },
  audio: {
    zh: { title: '音樂作品', subtitle: 'Cover · 音樂平台連結' },
    en: { title: 'Audio Works', subtitle: 'Covers · Music Platform Links' },
    type: 'audio',
    tracks: [
      { zh: '蘇幕遮', en: 'Su Mu Zhe', image: '', link: 'https://youtu.be/hrPMTFN7m30?si=Pw4TzNXZRtJxHhha', platform: 'YouTube' },
    ],
  },
  code: {
    zh: { title: '程式作品',      subtitle: '進行中的程式專案' },
    en: { title: 'Code Projects', subtitle: 'Ongoing Development Projects' },
    icon: '💻', count: 3, zhItem: '專案', enItem: 'Project',
  },
  review: {
    zh: { title: '備審經歷',          subtitle: '學習歷程 · 作品集備審資料' },
    en: { title: 'Academic Portfolio', subtitle: 'Learning Journey · Academic Review' },
    type: 'documents',
    docs: [
      { src: 'assets/review/TKUIM多元綜整心得.pdf',   zh: 'TKUIM 多元綜整心得',   en: 'TKUIM Integrated Reflection' },
      { src: 'assets/review/TKUIM學習歷程自述.pdf',   zh: 'TKUIM 學習歷程自述',   en: 'TKUIM Learning Journey' },
    ],
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

function renderAudioModal(data, lang) {
  const comingSoon  = lang === 'zh' ? '即將上傳' : 'Coming soon';
  const listenLabel = lang === 'zh' ? '前往收聽' : 'Listen';

  return data.tracks.map(t => {
    const title    = lang === 'zh' ? t.zh : t.en;
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
}

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
    content = `<div class="doc-list">${items}</div>`;
  } else if (data.type === 'gallery') {
    const emptyMsg = lang === 'zh' ? '作品即將上傳，敬請期待！' : 'Works coming soon, stay tuned!';
    if (!data.images || data.images.length === 0) {
      content = `<p class="vocab-empty">${emptyMsg}</p>`;
    } else {
      const items = data.images.map(img => `
        <div class="gallery-item" onclick="openLightbox('${img.src}', '${lang === 'zh' ? img.zh : img.en}')">
          <img src="${img.src}" alt="${lang === 'zh' ? img.zh : img.en}" class="gallery-img" loading="lazy">
          <p class="gallery-caption">${lang === 'zh' ? img.zh : img.en}</p>
        </div>
      `).join('');
      content = `<div class="gallery-grid">${items}</div>`;
    }
  } else if (data.type === 'vocabulary') {
    const glossaryLabel = lang === 'zh' ? '單字本' : 'Word Bank';
    content = `
      <button class="modal-glossary-btn" id="modalGlossaryBtn" aria-label="${glossaryLabel}">☰</button>
      <div class="vocab-list">${renderVocabModal(data, lang, key)}</div>
    `;
  } else if (data.type === 'audio') {
    content = `<div class="audio-list">${renderAudioModal(data, lang)}</div>`;
  } else {
    const itemLabel  = lang === 'zh' ? data.zhItem : data.enItem;
    const comingSoon = lang === 'zh' ? '即將上傳' : 'Coming soon';
    const items = Array.from({ length: data.count }, (_, i) => `
      <div class="modal-item">
        <span class="modal-item-icon">${data.icon}</span>
        <p class="modal-item-name">${itemLabel} ${i + 1}</p>
        <p class="modal-item-note">${comingSoon}</p>
      </div>
    `).join('');
    content = `<div class="modal-grid">${items}</div>`;
  }

  modalBody.innerHTML = `
    <h2>${title}</h2>
    <p class="modal-subtitle">${subtitle}</p>
    ${content}
  `;

  currentModalKey = key;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

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
