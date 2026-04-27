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
│   ├── paintings/              # 畫作圖片（26 張）
│   ├── review/                 # 備審文件（PDF）
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
- 連結：作品集 / 小教室 / 關於
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
| 畫作 | Draw.png | `gallery` | 26 張圖，點圖放大 Lightbox |
| 音樂作品 | Sing.png | `audio` | 曲目列表 + 平台連結 |
| 程式作品 | Code.png | 一般佔位 | 3 個佔位格（待新增） |
| 備審經歷 | Text.png | `documents` | PDF 文件列表 |

### 4. 小教室（3 格 Grid）

| 教室 | 封面 | 單字數 | 說明 |
|------|------|--------|------|
| 台語小教室 | TaiYu.png | 60 | 含羅馬拼音（Tâi-lô）+ 使用情境 |
| 日文小教室 | ZhiWen.png | 60 | 漢字後附平假名 + 使用情境 |
| 英文小教室 | English.png | 60 | 音節式拼音（如 heh-LOH）+ 使用情境 |

- 啟動日期：`2026-04-26`（每天自動推進到下一個單字）
- 單字資料：存於 `assets/words/*.json`，前端用 `fetch` 讀取
- 漢堡按鈕 ☰：開啟單字本，顯示所有已解鎖單字，可點開查看

### 5. 關於
- 5 段自我介紹（中英雙語）
- 連結：GitHub、Instagram（https://www.instagram.com/jia_yu_0317）

### 6. Footer
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

### 畫作（26 張）
Ina、Ina Paint、Gura、Anya、Anya 2、Asuna、和泉紗霧、Himeyuri、Kasli、Aphrodite、Tartaglia、Seki 簡筆、Mizuki 簡筆、Empress Cat、Nature's Guardians Elemental Pixies、皮卡丘、肥嘟嘟佐衛門、Nyanko Daisensou 1 / Miku / Snow Miku、玻璃瓶、格致中學、海軍基地、現代建築、金閣寺、隨畫 1

### 音樂作品（1 首）
- 蘇幕遮 — [YouTube](https://youtu.be/hrPMTFN7m30?si=Pw4TzNXZRtJxHhha)

### 備審文件（2 份）
- TKUIM 多元綜整心得.pdf
- TKUIM 學習歷程自述.pdf

---

## 待辦 / 可繼續的方向

- [x] 推上 GitHub Pages（`https://bika0317.github.io` 已上線）
- [ ] 程式作品填入實際專案內容
- [ ] 音樂作品繼續新增歌曲
- [ ] 畫作持續新增
- [ ] 小教室新增單字（手動更新 JSON 檔）
- [ ] 加入更多備審文件

---

## 常用維護指令

### 新增畫作
把圖片放入 `assets/paintings/`，在 `js/main.js` 的 `paintings.images` 加一行：
```js
{ src: 'assets/paintings/檔名.jpg', zh: '中文名', en: 'English Name' },
```

### 新增音樂
在 `js/main.js` 的 `audio.tracks` 加一行：
```js
{ zh: '歌名', en: 'Song Name', link: 'https://...', platform: 'YouTube' },
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
