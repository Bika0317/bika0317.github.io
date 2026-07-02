# 比卡 Bika 個人作品集網站 — 統整文件

## 專案基本資訊

| 項目 | 內容 |
|------|------|
| 專案路徑 | `C:\Users\Bika\Desktop\code\portfolio\` |
| GitHub 帳號 | [Bika0317](https://github.com/Bika0317) |
| 上線網址 | `https://bika0317.github.io` |
| 技術 | 純 HTML / CSS / JavaScript |

---

## 檔案結構

```
portfolio/
├── index.html                  # 主頁面
├── css/
│   └── style.css               # 全站樣式 + 深色/亮色主題變數
├── js/
│   ├── stars.js                # Canvas 背景動畫（星空 / 太陽系粒子 + 流星）
│   ├── games.js                # 遊戲區邏輯（猜單字 / 貪吃蛇 / 圈圈叉叉 / 知識王）
│   └── main.js                 # 主邏輯（主題切換、語言切換、Modal、小教室）
├── pages/
│   └── taiwanese.html          # 台語作品獨立頁（目前未連結，可刪除）
├── assets/
│   ├── Bika.png                # Hero 區主圖（去背）
│   ├── Draw.png                # 畫作卡片封面
│   ├── Sing.png                # 音樂卡片封面
│   ├── Code.png                # 程式卡片封面
│   ├── Text.png                # 備審卡片封面
│   ├── TaiYu.png               # 台語小教室卡片封面
│   ├── ZhiWen.png              # 日文小教室卡片封面（注意大小寫）
│   ├── English.png             # 英文小教室卡片封面
│   ├── paintings/              # 畫作圖片，依分類分資料夾
│   │   ├── 手繪/                # 18 張
│   │   ├── MC建築/              # 8 張
│   │   └── 電繪/                # 1 張
│   ├── music/                  # 本地音樂檔（MP3）
│   ├── note/                   # 程式作品「筆記內容」原始 .md + 轉換後 .json
│   ├── projects/                # 程式作品「進行中的程式專案」卡片用 icon 圖
│   ├── review/                 # 備審文件（PDF）
│   ├── games/                  # 遊戲區資料
│   │   └── quiz.json           # 知識王題庫（中英雙語，88 題）
│   └── words/                  # 小教室單字 JSON 檔
│       ├── english.json
│       ├── japanese.json
│       └── taiwanese.json
└── CLAUDE.md                   # 本文件
```

---

## 頁面結構

### 1. Nav 導覽列
- Logo：比卡 / Bika
- 連結：作品集 / 小教室 / 遊戲區 / 關於
- 語言切換：中文 ↔ 英文（偏好存 localStorage）
- 主題切換：星空深色 ↔ 太陽系粉色（偏好存 localStorage）
- 提示文字：中文介面顯示 `if you want to change language →`，英文介面顯示 `想切換語言 →`

### 2. Hero 區
- 主圖：`Bika.png`（黑底框，粉色介面改淡粉色底無陰影）
- 副標（中）：「隨手創作 · 好奇寶寶 · 努力學習中」
- 副標（英）：「Create when inspiration hits · Curious about everything · Always a work in progress」
- 描述：「用興趣、好奇去支撐筆、麥克風、以及所謂的未來」
- 按鈕：「探索作品」→ 滑到作品集區

### 3. 作品集（4 格 Grid）

| 卡片 | 封面 | Modal 類型 | 內容 |
|------|------|-----------|------|
| 畫作 | Draw.png | `gallery` | 真實頁籤：手繪 / MC建築 / 電繪，點圖放大 Lightbox |
| 音樂作品 | Sing.png | `audio` | 真實頁籤：立即聽（本地播放器）/ 其他平台（外部連結） |
| 程式作品 | Code.png | `code` | 真實頁籤：進行中的程式專案（卡片列表，連到實際網址）/ 筆記內容（章節式筆記） |
| 備審經歷 | Text.png | `documents` | PDF 文件列表 + 宣傳區塊 |

#### 畫作 — 分類頁籤
- 資料結構：`MODAL_DATA.paintings.categories`，每個分類是 `{ key, zh, en, images: [...] }`
- 圖片實際檔案依分類放在對應子資料夾：`assets/paintings/手繪/`、`assets/paintings/MC建築/`、`assets/paintings/電繪/`
- **新增畫作步驟**：把圖片放進對應分類的子資料夾，在該分類的 `images` 陣列加一行 `{ src: 'assets/paintings/分類資料夾/檔名.jpg', zh: '中文名', en: 'English Name' }`

#### 程式作品 — 進行中的程式專案
- 資料結構：`MODAL_DATA.code.projects` 是一個陣列，每筆 `{ zh, en, descZh, descEn, url, tags: [...], icon }`
- 顯示為卡片列表（`.project-card`），整張卡可點擊連到 `url`（開新分頁）；最後固定附一張虛線「更多專案，敬請期待」卡（`.project-card-more`），所以即使只有 1～2 個專案版面也不會太空
- icon 圖放在 `assets/projects/`，卡片用 `<img onerror>` 處理圖片缺失（找不到就隱藏圖示，不會破版）
- **新增專案步驟**：
  1. 把專案 icon 圖放進 `assets/projects/`
  2. 在 `js/main.js` 的 `MODAL_DATA.code.projects` 加一筆：`{ zh: '中文名', en: 'English Name', descZh: '一行中文簡介', descEn: 'One-line English description', url: 'https://...', tags: ['HTML', ...], icon: 'assets/projects/檔名.png' }`

#### 程式作品 — 筆記內容
- 筆記列表先顯示卡片（`.notes-card`），點進去才展開該筆記的章節手風琴；有「← 返回筆記列表」可以回去
- 筆記來源：`assets/note/*.md`（原始 Markdown，含「## 目錄」章節列表）
- 實際顯示用的是 `assets/note/*.json`（預先轉換好的章節陣列 `[{ title, html }]`），前端用 `fetch` 讀取，渲染成可展開/收合的章節手風琴（`.notes-chapter`）
- **新增筆記步驟**：
  1. 把新的 `.md` 筆記放進 `assets/note/`，開頭要有「## 目錄」清單（`- [章節標題](#anchor)`），章節標題會依目錄的項目切章節
  2. 用 Node + `marked`（轉 HTML）+ `highlight.js`（SQL 等程式碼語法高亮，透過自訂 `renderer.code`）把 `.md` 轉成同名 `.json`（陣列存 `{ title, html }`，html 是該章節轉換後的內容，不含章節自己的標題行）；這兩個套件只在轉換時用，不會被加進網站的執行環境
  3. 在 `js/main.js` 的 `MODAL_DATA.code.notes` 加一筆：`{ zh: '...', en: '...', source: 'assets/note/檔名.json' }`
- 目錄與正文標題不一定完全一致（可能有手誤/空格差異），轉換時**先比對完全相同的正規化文字，比對不到才退回子字串比對**（純子字串比對會讓像「CREATE」這種短標題誤配到後面「CREATE TABLE」之類的子章節，截斷章節內容）
- 程式碼區塊用 `white-space: pre-wrap` 讓過長的對齊註解自動換行，不會超出框外被裁掉
- 語法高亮顏色對應在 `css/style.css` 的 `.notes-chapter-body .hljs-*` 規則，沿用站內 `--accent` / `--accent-2` 等主題變數

### 4. 小教室（3 格 Grid）

| 教室 | 封面 | 單字數 | 說明 |
|------|------|--------|------|
| 台語小教室 | TaiYu.png | 60 | 含羅馬拼音（Tâi-lô）+ 使用情境 |
| 日文小教室 | ZhiWen.png | 60 | 漢字後附平假名 + 使用情境 |
| 英文小教室 | English.png | 60 | 音節式拼音（如 heh-LOH）+ 使用情境 |

- 啟動日期：`2026-04-26`（每天自動推進到下一個單字）
- 單字資料：存於 `assets/words/*.json`，前端用 `fetch` 讀取
- 漢堡按鈕 ☰：開啟單字本，顯示所有已解鎖單字，可點開查看
- 副標題：「每日一詞・跟著比卡學單字」（已從原本的「學台語」改為通用三語版）

### 5. 遊戲區（4 格 Grid）

| 遊戲 | 卡片 key | 說明 |
|------|---------|------|
| 猜單字 | `wordle` | Wordle 風格，6 次機會猜 5 字母英文單字，螢幕鍵盤 + 實體鍵盤皆可輸入，單字庫寫在 `js/games.js` 的 `WORDLE_WORDS` |
| 小精靈 | `pacman` | Canvas 15x15 柱狀迷宮（牆=外框+行列皆偶數的格子，保證通道相連），吃光豆子過關、大力丸可反吃鬼（`FRIGHT_TICKS` 回合），3 條命，3 隻鬼會追逐/逃跑；方向鍵 / WASD / 滑動 / 觸控方向鍵控制 |
| 圈圈叉叉 | `tictactoe` | 玩家 ⭕ vs 比卡 AI ❌（啟發式：贏 > 擋 > 中間 > 角落 > 邊），可切換先手／後手（選 AI 先手開局它會先落子），比分只記當次瀏覽 |
| 知識王 | `quiz` | 從 `assets/games/quiz.json` 隨機抽 10 題，答完顯示分數與稱號（知識王 / 達人 / 好奇寶寶 / 再接再厲） |

- 遊戲邏輯集中在 `js/games.js`（在 `main.js` 之前載入），`main.js` 的 `openModal` 遇到 `type: 'game'` 會呼叫 `renderGameModal(key, lang)` 與 `setupGameModal(key, lang)`
- 關閉 Modal 時 `closeModal` 會呼叫 `stopActiveGame()` 清掉貪吃蛇計時器與猜單字的鍵盤監聽
- 卡片封面不用圖片，是 CSS 漸層底（`.wordle-bg` 等）+ 漂浮 emoji（`.game-emoji`）
- **新增知識王題目步驟**：在 `assets/games/quiz.json` 加一筆 `{ "q": { "zh", "en" }, "options": [4 個 { "zh", "en" }], "answer": 正解索引 }`（選項顯示時會自動洗牌，answer 填在原陣列的索引即可）

### 6. 關於
- 5 段自我介紹（中英雙語）

### 7. 浮動社群側欄
- 固定在畫面右側（手機版移至右下角，橫排）
- GitHub、Instagram（https://www.instagram.com/jia_yu_0317）SVG icon 按鈕
- 取代原本放在「關於」區段內的社群連結

### 8. Footer
- © 2025 比卡 Bika · 用星塵製作

---

## 主題設計

| 項目 | 深色（星空） | 亮色（太陽系粉） |
|------|------------|----------------|
| 背景色 | `#070714` | `#fdf0f5` |
| 主色調 | 紫色 `#8b7cf8` | 玫瑰粉 `#e05585` |
| Canvas 動畫 | 星星閃爍 + 流星 + 紫色星雲漸層 | 漂浮粉色粒子 |
| Hero 圖片框 | 黑底 + 紫色光暈陰影 | 淡粉底 `#fbe8ec` 無陰影 |
| 字體 | Dancing Script（標題）/ Ma Shan Zheng（中文）/ Caveat（UI） |

---

## 作品內容現況

### 畫作（27 張，分 3 頁籤）
- **手繪（18）**：Anya、Anya 2、Asuna、Ina Paint、Mizuki 簡筆、Seki 簡筆、Tartaglia、Kasli、Himeyuri、Nature's Guardians Elemental Pixies、狐姬百荷、Fox（狐狸）、Aphrodite、Nyanko Daisensou 1 / Miku / Snow Miku、Empress Cat、隨畫 1
- **MC建築（8）**：Gura、Ina、海軍基地、玻璃瓶、現代建築、皮卡丘、肥嘟嘟佐衛門、金閣寺
- **電繪（1）**：Totoro（龍貓）

### 音樂作品（2 首）
- 紅塵客棧 — 本地 MP3（`assets/music/紅塵客棧.mp3`），支援即時頻率視覺化
- 蘇幕遮 — [YouTube](https://youtu.be/hrPMTFN7m30?si=Pw4TzNXZRtJxHhha)

#### 音樂 Modal 功能
- **本地 MP3**：內建播放器（播放 / 暫停、進度條可拖拉跳轉、音量滑桿）
- **Web Audio API**：`AudioContext` + `AnalyserNode` 讀取即時頻率資料
- **Perimeter 視覺化**：頻率波紋沿 Modal 四邊順時針行進，播放時放大，暫停時凍結，關閉自動清除
- **煙霧效果**：每根波紋條帶 `shadowBlur` 光暈 + 四邊漸層霧疊加，隨音量呼吸
- **音量滑桿**：🔇 / 🔈 / 🔉 / 🔊 圖示跟著音量自動切換

### 備審文件（2 份）
- TKUIM 多元綜整心得.pdf
- TKUIM 學習歷程自述.pdf

#### 備審經歷宣傳區塊
- 文件列表下方附宣傳區塊（`doc-promo`），文案邀請需要協助的人私訊 IG 或加入 Discord
- 連結設定在 `js/main.js` 的 `MODAL_DATA.review.promo`：`ig`（Instagram 連結）、`discord`（伺服器邀請連結 `https://discord.gg/37uRdVjXzU`）
- 中英文案分別存在 `promo.zh` / `promo.en`

---

## 待辦 / 可繼續的方向

- [x] 推上 GitHub Pages（`https://bika0317.github.io` 已上線）
- [x] 程式作品「進行中的程式專案」填入實際專案內容（自動化排班系統，卡片列表 + 敬請期待佔位卡）
- [x] 程式作品「筆記內容」加入 SQL 完整筆記（章節式手風琴）
- [ ] 筆記內容繼續新增其他科目筆記
- [ ] 音樂作品繼續新增歌曲
- [ ] 畫作持續新增
- [ ] 小教室新增單字（手動更新 JSON 檔）
- [ ] 加入更多備審文件

---

## 常用維護指令

### 新增畫作
把圖片放入對應分類子資料夾（`assets/paintings/手繪/` / `MC建築/` / `電繪/`），在 `js/main.js` 的 `MODAL_DATA.paintings.categories` 裡找到該分類的 `images` 陣列加一行：
```js
{ src: 'assets/paintings/手繪/檔名.jpg', zh: '中文名', en: 'English Name' },
```

### 新增音樂

**本地 MP3（有播放器 + 頻率視覺化）：**
把 MP3 放入 `assets/music/`，在 `js/main.js` 的 `audio.tracks` 加：
```js
{ zh: '歌名', en: 'Song Name', audio: 'assets/music/檔名.mp3', link: null, platform: null },
```

**外部連結（YouTube 等）：**
```js
{ zh: '歌名', en: 'Song Name', link: 'https://...', platform: 'YouTube' },
```

> 兩種格式可混用。有 `audio` 欄位的優先顯示本地播放器；無 `audio` 的顯示外部連結按鈕。

### 新增程式專案
把專案 icon 圖放入 `assets/projects/`，在 `js/main.js` 的 `MODAL_DATA.code.projects` 加一筆：
```js
{ zh: '中文名', en: 'English Name', descZh: '一行中文簡介', descEn: 'One-line English description', url: 'https://...', tags: ['HTML'], icon: 'assets/projects/檔名.png' },
```

### 新增備審文件
把 PDF 放入 `assets/review/`，在 `js/main.js` 的 `review.docs` 加一行：
```js
{ src: 'assets/review/檔名.pdf', zh: '中文標題', en: 'English Title' },
```

### 新增小教室單字
在 `assets/words/` 對應語言的 JSON 檔末尾加一筆：
```json
{ "hanzi": "字", "tailo": "拼音", "meaning": "意思", "usage": "使用情境" }
```

### 注意事項
- 圖片檔名大小寫要與 `index.html` / `main.js` 完全一致（GitHub Pages 跑 Linux，大小寫敏感）
- 更新後記得 `git add . && git commit -m "..." && git push`
