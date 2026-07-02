/* ============================================================
   遊戲區 Games — 猜單字 / 貪吃蛇 / 圈圈叉叉 / 知識王
   由 main.js 的 openModal 呼叫 renderGameModal / setupGameModal，
   closeModal 時呼叫 stopActiveGame 清除計時器與鍵盤監聽。
   ============================================================ */

/* 目前運作中遊戲的清理函式（關閉 Modal 時執行） */
let _gameCleanup = null;

// 功能：停止目前運作中的遊戲。寫法：若有註冊清理函式就執行（移除監聽、清計時器），執行完重設為 null。
function stopActiveGame() {
  if (_gameCleanup) { _gameCleanup(); _gameCleanup = null; }
}

// 功能：陣列洗牌工具函式。寫法：Fisher–Yates 由後往前隨機交換，回傳打亂後的新陣列（不動原陣列）。
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============================================================
   猜單字（Wordle 風）
   ============================================================ */
const WORDLE_WORDS = [
  'APPLE', 'BEACH', 'BRAIN', 'BREAD', 'BRUSH', 'CHAIR', 'CLICK', 'CLOCK',
  'CLOUD', 'DANCE', 'DIARY', 'DRINK', 'EARTH', 'FLAME', 'FLOOR', 'FRUIT',
  'GHOST', 'GRAPE', 'GREEN', 'HAPPY', 'HEART', 'HONEY', 'HOUSE', 'JUICE',
  'LEMON', 'LIGHT', 'LUCKY', 'MAGIC', 'MONEY', 'MOUSE', 'MUSIC', 'NIGHT',
  'OCEAN', 'PAINT', 'PARTY', 'PEACE', 'PHONE', 'PIANO', 'PIZZA', 'PLANE',
  'PLANT', 'QUEEN', 'RADIO', 'RIVER', 'ROBOT', 'SMILE', 'SNAKE', 'SPACE',
  'STORM', 'STORY', 'SUGAR', 'SWEET', 'TIGER', 'TRAIN', 'WATER', 'WHITE',
  'WORLD', 'YOUTH',
];

// 功能：猜單字畫面渲染函式。寫法：組出訊息列、6x5 格子棋盤、QWERTY 螢幕鍵盤與重新開始按鈕的 HTML 字串。
function renderWordle(lang) {
  const hint    = lang === 'zh' ? '猜一個 5 個字母的英文單字' : 'Guess a 5-letter English word';
  const restart = lang === 'zh' ? '新的一局' : 'New Game';

  let board = '';
  for (let r = 0; r < 6; r++) {
    board += '<div class="wordle-row">';
    for (let c = 0; c < 5; c++) board += `<div class="wordle-cell" data-cell="${r}-${c}"></div>`;
    board += '</div>';
  }

  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  const kbHtml = rows.map((row, i) => {
    let keys = row.split('').map(k => `<button class="wordle-key" data-key="${k}">${k}</button>`).join('');
    if (i === 2) {
      keys = `<button class="wordle-key wordle-key-wide" data-key="ENTER">⏎</button>` + keys +
             `<button class="wordle-key wordle-key-wide" data-key="BACK">⌫</button>`;
    }
    return `<div class="wordle-kb-row">${keys}</div>`;
  }).join('');

  return `
    <div class="game-wrap wordle-wrap">
      <p class="game-msg" id="gameMsg">${hint}</p>
      <div class="wordle-board">${board}</div>
      <div class="wordle-kb">${kbHtml}</div>
      <button class="card-btn game-restart" id="gameRestart">${restart}</button>
    </div>
  `;
}

// 功能：猜單字互動綁定函式。寫法：閉包保存答案與輸入狀態，綁定螢幕鍵盤與實體鍵盤事件，猜完六次或猜中結束，清理時移除鍵盤監聽。
function setupWordle(lang) {
  let answer = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
  let row = 0, cur = '', done = false;

  const msg = document.getElementById('gameMsg');
  const T = {
    hint:    lang === 'zh' ? '猜一個 5 個字母的英文單字' : 'Guess a 5-letter English word',
    short:   lang === 'zh' ? '字母不夠喔！' : 'Not enough letters!',
    win:     lang === 'zh' ? '太厲害了，猜對啦！🎉' : 'Amazing, you got it! 🎉',
    lose:    lang === 'zh' ? '答案是' : 'The answer was',
  };

  // 功能：畫面單格更新函式。寫法：用 data-cell 屬性選出格子後寫入字母。
  function setCell(r, c, ch) {
    const cell = document.querySelector(`.wordle-cell[data-cell="${r}-${c}"]`);
    if (cell) cell.textContent = ch;
  }

  // 功能：目前輸入列重繪函式。寫法：依 cur 字串逐格寫入字母，不足的格子清空。
  function drawRow() {
    for (let c = 0; c < 5; c++) setCell(row, c, cur[c] || '');
  }

  // 功能：猜測比對函式。寫法：兩段式比對——先標記位置正確並扣掉字母數，再判斷字母存在但位置錯誤，回傳每格狀態陣列。
  function evaluate(guess) {
    const res   = Array(5).fill('bad');
    const count = {};
    for (const ch of answer) count[ch] = (count[ch] || 0) + 1;
    for (let i = 0; i < 5; i++) {
      if (guess[i] === answer[i]) { res[i] = 'good'; count[guess[i]]--; }
    }
    for (let i = 0; i < 5; i++) {
      if (res[i] !== 'good' && count[guess[i]] > 0) { res[i] = 'mid'; count[guess[i]]--; }
    }
    return res;
  }

  // 功能：螢幕鍵盤狀態上色函式。寫法：依比對結果幫按鍵加樣式，good 優先權最高不會被 mid/bad 蓋掉。
  function paintKeys(guess, res) {
    for (let i = 0; i < 5; i++) {
      const key = document.querySelector(`.wordle-key[data-key="${guess[i]}"]`);
      if (!key) continue;
      if (res[i] === 'good') {
        key.classList.remove('mid', 'bad');
        key.classList.add('good');
      } else if (!key.classList.contains('good')) {
        key.classList.add(res[i]);
      }
    }
  }

  // 功能：送出目前猜測函式。寫法：檢查長度後比對答案，幫格子與鍵盤上色，判斷勝負或推進到下一列。
  function submit() {
    if (cur.length < 5) { msg.textContent = T.short; return; }
    const res = evaluate(cur);
    for (let c = 0; c < 5; c++) {
      const cell = document.querySelector(`.wordle-cell[data-cell="${row}-${c}"]`);
      if (cell) cell.classList.add(res[c]);
    }
    paintKeys(cur, res);
    if (cur === answer) {
      msg.textContent = T.win; done = true;
    } else if (row === 5) {
      msg.textContent = `${T.lose} ${answer}`; done = true;
    } else {
      row++; cur = '';
    }
  }

  // 功能：按鍵輸入處理函式。寫法：依 ENTER / BACK / 字母分流處理，遊戲結束後不再反應。
  function press(k) {
    if (done) return;
    if (k === 'ENTER') { submit(); return; }
    if (k === 'BACK')  { cur = cur.slice(0, -1); drawRow(); return; }
    if (/^[A-Z]$/.test(k) && cur.length < 5) { cur += k; drawRow(); }
  }

  // 功能：重新開始一局函式。寫法：重設所有狀態，清空格子與鍵盤的樣式和文字。
  function restart() {
    answer = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
    row = 0; cur = ''; done = false;
    msg.textContent = T.hint;
    document.querySelectorAll('.wordle-cell').forEach(c => { c.textContent = ''; c.className = 'wordle-cell'; });
    document.querySelectorAll('.wordle-key').forEach(k => k.classList.remove('good', 'mid', 'bad'));
  }

  document.querySelectorAll('.wordle-key').forEach(btn => {
    btn.addEventListener('click', () => press(btn.dataset.key));
  });
  document.getElementById('gameRestart').addEventListener('click', restart);

  // 功能：實體鍵盤事件處理函式。寫法：把 keydown 轉成統一的按鍵代碼餵給 press，字母一律轉大寫；Enter 需 preventDefault 避免誤觸聚焦中的按鈕。
  function onKeydown(e) {
    if (e.key === 'Enter') { e.preventDefault(); press('ENTER'); }
    else if (e.key === 'Backspace') press('BACK');
    else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
  }
  document.addEventListener('keydown', onKeydown);

  _gameCleanup = () => document.removeEventListener('keydown', onKeydown);
}

/* ============================================================
   小精靈（Pac-Man）
   ============================================================ */

// 功能：小精靈畫面渲染函式。寫法：組出分數/生命列、迷宮 canvas、觸控方向鍵與開始按鈕的 HTML 字串。
function renderPacman(lang) {
  const scoreLabel = lang === 'zh' ? '分數' : 'Score';
  const livesLabel = lang === 'zh' ? '生命' : 'Lives';
  const start      = lang === 'zh' ? '開始遊戲' : 'Start';
  const hint       = lang === 'zh' ? '吃光豆子過關・方向鍵 / WASD / 滑動控制' : 'Eat all dots to win · Arrows / WASD / swipe';
  return `
    <div class="game-wrap pacman-wrap">
      <div class="pacman-score-row">
        <span>${scoreLabel}：<b id="pacScore">0</b></span>
        <span>${livesLabel}：<b id="pacLives">3</b></span>
      </div>
      <canvas id="pacmanCanvas" width="330" height="330"></canvas>
      <p class="game-msg pacman-hint">${hint}</p>
      <div class="pacman-dpad">
        <button class="pacman-dpad-btn" data-dir="up">▲</button>
        <div class="pacman-dpad-mid">
          <button class="pacman-dpad-btn" data-dir="left">◀</button>
          <button class="pacman-dpad-btn" data-dir="down">▼</button>
          <button class="pacman-dpad-btn" data-dir="right">▶</button>
        </div>
      </div>
      <button class="card-btn game-restart" id="gameRestart">${start}</button>
    </div>
  `;
}

// 功能：小精靈互動綁定函式。寫法：閉包保存迷宮/豆子/小精靈與鬼的狀態，setInterval 推進遊戲並在 canvas 畫迷宮，支援鍵盤/滑動/方向鍵控制，清理時清除計時器與監聽。
function setupPacman(lang) {
  const canvas  = document.getElementById('pacmanCanvas');
  const ctx     = canvas.getContext('2d');
  const scoreEl = document.getElementById('pacScore');
  const livesEl = document.getElementById('pacLives');
  const btn     = document.getElementById('gameRestart');

  const COLS = 15, ROWS = 15, CELL = canvas.width / COLS;
  const DIRS = {
    up:    { x: 0, y: -1 },
    down:  { x: 0, y: 1 },
    left:  { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  const PAC_START   = { r: 13, c: 7 };
  const GHOST_START = [
    { r: 7, c: 6, color: '#ff5b6e' },
    { r: 7, c: 7, color: '#ff9cd0' },
    { r: 7, c: 8, color: '#66d9ef' },
  ];
  const FRIGHT_TICKS = 45; // 吃大力丸後鬼可被反吃的持續回合數

  let pac, ghosts, dots, dotsLeft, score, lives, fright, tick, timer = null, running = false;

  const T = {
    again: lang === 'zh' ? '再玩一次' : 'Play Again',
    win:   lang === 'zh' ? '全部吃光，通關啦！🎉' : 'All cleared — you win! 🎉',
    over:  lang === 'zh' ? '被抓到了，遊戲結束！' : 'Caught! Game Over!',
  };

  // 功能：主題色讀取函式。寫法：用 getComputedStyle 讀取 CSS 變數，讓迷宮牆色跟著深淺主題走。
  function themeColor(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  // 功能：牆壁判定函式。寫法：外框與「行列皆為偶數」的內部格子為牆（柱狀迷宮），其餘為通道，保證所有通道相連。
  function isWall(r, c) {
    if (r <= 0 || c <= 0 || r >= ROWS - 1 || c >= COLS - 1) return true;
    return r % 2 === 0 && c % 2 === 0;
  }

  // 功能：豆子初始化函式。寫法：每個通道格放一般豆子，四個內側角落改放大力丸，清掉起點上的豆子並統計剩餘數量。
  function buildDots() {
    dots = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    dotsLeft = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!isWall(r, c)) { dots[r][c] = 1; dotsLeft++; }
      }
    }
    [[1, 1], [1, COLS - 2], [ROWS - 2, 1], [ROWS - 2, COLS - 2]].forEach(([r, c]) => {
      if (dots[r][c]) dots[r][c] = 2;
    });
    const clear = (r, c) => { if (dots[r][c]) { dots[r][c] = 0; dotsLeft--; } };
    clear(PAC_START.r, PAC_START.c);
    GHOST_START.forEach(g => clear(g.r, g.c));
  }

  // 功能：角色位置重設函式。寫法：把小精靈與所有鬼放回起點、清方向與驚嚇狀態（開局與換命共用，不動豆子）。
  function resetActors() {
    pac = { r: PAC_START.r, c: PAC_START.c, dir: DIRS.left, next: DIRS.left };
    ghosts = GHOST_START.map(g => ({ r: g.r, c: g.c, color: g.color, dir: DIRS.up }));
    fright = 0;
  }

  // 功能：距離平方計算函式。寫法：回傳兩點座標差的平方和，供鬼選路比較用（免開根號）。
  function dist2(r1, c1, r2, c2) {
    return (r1 - r2) ** 2 + (c1 - c2) ** 2;
  }

  // 功能：小精靈移動函式。寫法：能轉向就採用緩衝方向，前方是牆就停住；進入格子吃豆子/大力丸加分，吃光即通關。
  function movePac() {
    if (!isWall(pac.r + pac.next.y, pac.c + pac.next.x)) pac.dir = pac.next;
    if (!isWall(pac.r + pac.dir.y, pac.c + pac.dir.x)) { pac.r += pac.dir.y; pac.c += pac.dir.x; }
    const cell = dots[pac.r][pac.c];
    if (cell) {
      score += cell === 2 ? 50 : 10;
      if (cell === 2) fright = FRIGHT_TICKS;
      dots[pac.r][pac.c] = 0;
      dotsLeft--;
      scoreEl.textContent = score;
      if (dotsLeft === 0) win();
    }
  }

  // 功能：單隻鬼移動函式。寫法：列出不回頭的可走方向，驚嚇時挑離小精靈最遠、平時挑最近（加一點隨機），更新方向與位置。
  function moveGhost(g) {
    const opts = Object.values(DIRS).filter(d =>
      !isWall(g.r + d.y, g.c + d.x) && !(d.x === -g.dir.x && d.y === -g.dir.y));
    const choices = opts.length ? opts : Object.values(DIRS).filter(d => !isWall(g.r + d.y, g.c + d.x));
    let best;
    if (Math.random() < 0.2) {
      best = choices[Math.floor(Math.random() * choices.length)];
    } else {
      const scored = choices
        .map(d => ({ d, k: dist2(g.r + d.y, g.c + d.x, pac.r, pac.c) }))
        .sort((a, b) => a.k - b.k);
      best = (fright > 0 ? scored[scored.length - 1] : scored[0]).d;
    }
    g.dir = best;
    g.r += best.y; g.c += best.x;
  }

  // 功能：碰撞處理函式。寫法：檢查每隻鬼是否與小精靈同格；驚嚇中就反吃（鬼送回中央、加分），否則回傳致命碰撞。
  function handleCollisions() {
    for (const g of ghosts) {
      if (g.r === pac.r && g.c === pac.c) {
        if (fright > 0) {
          score += 200; scoreEl.textContent = score;
          g.r = GHOST_START[0].r; g.c = GHOST_START[0].c; g.dir = DIRS.up;
        } else {
          return true;
        }
      }
    }
    return false;
  }

  // 功能：每回合推進函式。寫法：移動小精靈→碰撞檢查→移動鬼→再檢查，處理驚嚇倒數與換命/結束，最後重繪。
  function step() {
    tick++;
    movePac();
    if (!running) return; // movePac 可能已觸發通關
    if (fright > 0) fright--;
    let hit = handleCollisions();
    if (!hit) { ghosts.forEach(moveGhost); hit = handleCollisions(); }
    if (hit) { loseLife(); return; }
    draw();
  }

  // 功能：扣命處理函式。寫法：生命減一並更新畫面，歸零則結束，否則角色回到起點續玩。
  function loseLife() {
    lives--;
    livesEl.textContent = lives;
    if (lives <= 0) { gameOver(); return; }
    resetActors();
    draw();
  }

  // 功能：迷宮與角色繪製函式。寫法：清畫面後畫牆、豆子與大力丸，再畫張嘴的小精靈與（驚嚇時變藍的）鬼。
  function draw() {
    const accent = themeColor('--accent', '#8b7cf8');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 牆
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.45;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!isWall(r, c)) continue;
        const x = c * CELL, y = r * CELL, pad = 1.5, rr = CELL * 0.25;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, rr);
        else ctx.rect(x + pad, y + pad, CELL - pad * 2, CELL - pad * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 豆子與大力丸
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!dots[r][c]) continue;
        ctx.fillStyle = dots[r][c] === 2 ? '#ffd54a' : 'rgba(255,255,255,0.75)';
        ctx.beginPath();
        ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, dots[r][c] === 2 ? CELL * 0.24 : CELL * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawPac();
    ghosts.forEach(drawGhost);
  }

  // 功能：小精靈繪製函式。寫法：依方向決定嘴巴朝向，用 tick 奇偶讓嘴巴開合，畫成黃色扇形缺口圓。
  function drawPac() {
    const x = pac.c * CELL + CELL / 2, y = pac.r * CELL + CELL / 2, rad = CELL * 0.42;
    const base = pac.dir === DIRS.right ? 0 : pac.dir === DIRS.down ? 0.5 : pac.dir === DIRS.left ? 1 : 1.5;
    const mouth = tick % 2 === 0 ? 0.22 : 0.03; // 開合比例（單位 π）
    ctx.fillStyle = '#ffd54a';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, rad, (base + mouth) * Math.PI, (base + 2 - mouth) * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  // 功能：鬼繪製函式。寫法：驚嚇時畫藍色否則用各自顏色，畫出半圓頭+方身的鬼形，眼珠依移動方向偏移。
  function drawGhost(g) {
    const x = g.c * CELL, y = g.r * CELL, pad = CELL * 0.14;
    const cx = x + CELL / 2, cy = y + CELL / 2, rad = (CELL - pad * 2) / 2;
    ctx.fillStyle = fright > 0 ? '#4a6cff' : g.color;
    ctx.beginPath();
    ctx.arc(cx, cy - rad * 0.1, rad, Math.PI, 0);
    ctx.lineTo(x + CELL - pad, y + CELL - pad);
    ctx.lineTo(x + pad, y + CELL - pad);
    ctx.closePath();
    ctx.fill();
    // 眼睛
    const eo = rad * 0.4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - eo, cy - rad * 0.1, rad * 0.28, 0, Math.PI * 2);
    ctx.arc(cx + eo, cy - rad * 0.1, rad * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fright > 0 ? '#fff' : '#2a2a3a';
    ctx.beginPath();
    ctx.arc(cx - eo + g.dir.x * rad * 0.1, cy - rad * 0.1 + g.dir.y * rad * 0.1, rad * 0.14, 0, Math.PI * 2);
    ctx.arc(cx + eo + g.dir.x * rad * 0.1, cy - rad * 0.1 + g.dir.y * rad * 0.1, rad * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }

  // 功能：中央訊息疊字函式。寫法：蓋半透明底並置中畫文字（通關/結束共用）。
  function overlay(text) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  // 功能：通關處理函式。寫法：停止主迴圈、標記結束並蓋上通關訊息與分數。
  function win() {
    running = false;
    clearInterval(timer); timer = null;
    draw();
    overlay(`${T.win}  ${score}`);
    btn.textContent = T.again;
  }

  // 功能：遊戲結束處理函式。寫法：停止主迴圈、標記結束並蓋上結束訊息與分數。
  function gameOver() {
    running = false;
    clearInterval(timer); timer = null;
    overlay(`${T.over}  ${score}`);
    btn.textContent = T.again;
  }

  // 功能：開始／重新開始函式。寫法：重建豆子、重設角色與分數生命，啟動 setInterval 主迴圈。
  function start() {
    buildDots();
    resetActors();
    score = 0; lives = 3; tick = 0; running = true;
    scoreEl.textContent = 0;
    livesEl.textContent = lives;
    draw();
    clearInterval(timer);
    timer = setInterval(step, 150);
    btn.textContent = T.again;
  }

  // 功能：轉向處理函式。寫法：把方向名稱存成緩衝方向，等 movePac 在可通行時採用（遊戲進行中才反應）。
  function turn(name) {
    if (!running) return;
    const d = DIRS[name];
    if (d) pac.next = d;
  }

  // 功能：鍵盤事件處理函式。寫法：把方向鍵與 WASD 對應成方向名稱轉向，遊戲中攔截預設捲動行為。
  function onKeydown(e) {
    const map = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
      W: 'up', S: 'down', A: 'left', D: 'right',
    };
    const name = map[e.key];
    if (!name) return;
    if (running) e.preventDefault();
    turn(name);
  }
  document.addEventListener('keydown', onKeydown);

  // 觸控滑動控制
  let touchX = 0, touchY = 0;

  // 功能：觸控起點記錄函式。寫法：存下第一指的座標供 touchend 計算滑動方向。
  function onTouchStart(e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }

  // 功能：觸控結束轉向函式。寫法：比較起訖點位移，取絕對值較大的軸決定上下或左右。
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 'right' : 'left');
    else turn(dy > 0 ? 'down' : 'up');
  }
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd, { passive: true });

  document.querySelectorAll('.pacman-dpad-btn').forEach(b => {
    b.addEventListener('click', () => turn(b.dataset.dir));
  });

  btn.addEventListener('click', start);

  // 初始畫面：先畫好靜態迷宮與豆子，等玩家按開始
  buildDots();
  resetActors();
  score = 0; lives = 3; tick = 0;
  draw();

  _gameCleanup = () => {
    clearInterval(timer); timer = null;
    document.removeEventListener('keydown', onKeydown);
  };
}

/* ============================================================
   圈圈叉叉
   ============================================================ */

// 功能：圈圈叉叉畫面渲染函式。寫法：組出比分列、3x3 按鈕棋盤與重新開始按鈕的 HTML 字串。
function renderTicTacToe(lang) {
  const you       = lang === 'zh' ? '你' : 'You';
  const ai        = lang === 'zh' ? '比卡 AI' : 'Bika AI';
  const drawL     = lang === 'zh' ? '平手' : 'Draw';
  const hint      = lang === 'zh' ? '你是 ⭕，先手！' : 'You are ⭕ — you go first!';
  const restart   = lang === 'zh' ? '重新開始' : 'Restart';
  const firstLabel = lang === 'zh' ? '先手：' : 'First:';
  const youFirst   = lang === 'zh' ? '我先' : 'Me';
  const aiFirst    = lang === 'zh' ? 'AI 先' : 'AI';
  let cells = '';
  for (let i = 0; i < 9; i++) cells += `<button class="ttt-cell" data-idx="${i}"></button>`;
  return `
    <div class="game-wrap ttt-wrap">
      <div class="ttt-score-row">
        <span>${you}：<b id="tttYou">0</b></span>
        <span>${drawL}：<b id="tttDraw">0</b></span>
        <span>${ai}：<b id="tttAi">0</b></span>
      </div>
      <div class="ttt-first-row">
        <span class="ttt-first-label">${firstLabel}</span>
        <button class="ttt-first-btn active" data-first="you">${youFirst}</button>
        <button class="ttt-first-btn" data-first="ai">${aiFirst}</button>
      </div>
      <p class="game-msg" id="gameMsg">${hint}</p>
      <div class="ttt-board">${cells}</div>
      <button class="card-btn game-restart" id="gameRestart">${restart}</button>
    </div>
  `;
}

// 功能：圈圈叉叉互動綁定函式。寫法：閉包保存棋盤狀態，玩家點格子下 ⭕ 後 AI 依「贏>擋>中間>角落>邊」啟發式下 ❌，判定勝負並累計比分。
function setupTicTacToe(lang) {
  const msg   = document.getElementById('gameMsg');
  const cells = [...document.querySelectorAll('.ttt-cell')];
  let board, over, firstMover = 'you';
  const tally = { you: 0, ai: 0, draw: 0 };

  const T = {
    hintYou: lang === 'zh' ? '你是 ⭕，先手！' : 'You are ⭕ — you go first!',
    hintAi:  lang === 'zh' ? '比卡 AI（❌）先手，換你囉' : 'Bika AI (❌) went first — your turn',
    you:   lang === 'zh' ? '你贏了！🎉' : 'You win! 🎉',
    ai:    lang === 'zh' ? '比卡 AI 贏了！再挑戰一次？' : 'Bika AI wins! Try again?',
    draw:  lang === 'zh' ? '平手！勢均力敵～' : "It's a draw!",
    turn:  lang === 'zh' ? '輪到你囉' : 'Your turn',
  };

  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  // 功能：勝利判定函式。寫法：掃描八條連線，三格同符號就回傳該連線，否則回傳 null。
  function winLine(sym) {
    return LINES.find(l => l.every(i => board[i] === sym)) || null;
  }

  // 功能：AI 落子選位函式。寫法：依序找「自己能贏的格」→「擋玩家要贏的格」→ 中間 → 隨機角落 → 隨機邊。
  function aiPick() {
    // 功能：找出某符號再一步就連線的格子。寫法：逐條連線檢查是否恰有兩格同符號且剩一空格。
    function oneAway(sym) {
      for (const l of LINES) {
        const marks = l.filter(i => board[i] === sym);
        const empty = l.filter(i => board[i] === '');
        if (marks.length === 2 && empty.length === 1) return empty[0];
      }
      return -1;
    }
    let p = oneAway('❌');
    if (p !== -1) return p;
    p = oneAway('⭕');
    if (p !== -1) return p;
    if (board[4] === '') return 4;
    const corners = [0, 2, 6, 8].filter(i => board[i] === '');
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    const sides = [1, 3, 5, 7].filter(i => board[i] === '');
    return sides[Math.floor(Math.random() * sides.length)];
  }

  // 功能：回合結束檢查函式。寫法：先查勝利連線標記亮格並記分，再查是否滿盤平手，回傳是否已結束。
  function checkEnd(sym, who) {
    const line = winLine(sym);
    if (line) {
      line.forEach(i => cells[i].classList.add('win'));
      over = true;
      tally[who]++;
      document.getElementById(who === 'you' ? 'tttYou' : 'tttAi').textContent = tally[who];
      msg.textContent = T[who];
      return true;
    }
    if (board.every(v => v !== '')) {
      over = true;
      tally.draw++;
      document.getElementById('tttDraw').textContent = tally.draw;
      msg.textContent = T.draw;
      return true;
    }
    return false;
  }

  // 功能：玩家點格處理函式。寫法：空格才落 ⭕，沒結束就讓 AI 隨即落 ❌，兩邊各做一次結束檢查。
  function onCell(i) {
    if (over || board[i] !== '') return;
    board[i] = '⭕';
    cells[i].textContent = '⭕';
    if (checkEnd('⭕', 'you')) return;
    const p = aiPick();
    board[p] = '❌';
    cells[p].textContent = '❌';
    if (!checkEnd('❌', 'ai')) msg.textContent = T.turn;
  }

  // 功能：重新開始函式。寫法：清空棋盤陣列與畫面樣式；若 AI 先手則讓 AI 先落一子，再依先手方顯示對應提示。
  function restart() {
    board = Array(9).fill('');
    over = false;
    cells.forEach(c => { c.textContent = ''; c.classList.remove('win'); });
    if (firstMover === 'ai') {
      const p = aiPick();
      board[p] = '❌';
      cells[p].textContent = '❌';
      msg.textContent = T.hintAi;
    } else {
      msg.textContent = T.hintYou;
    }
  }

  cells.forEach((c, i) => c.addEventListener('click', () => onCell(i)));
  document.getElementById('gameRestart').addEventListener('click', restart);

  // 先手選擇：切換 active 樣式並記錄先手方，立即重開一局套用
  document.querySelectorAll('.ttt-first-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      firstMover = btn.dataset.first;
      document.querySelectorAll('.ttt-first-btn').forEach(b => b.classList.toggle('active', b === btn));
      restart();
    });
  });

  restart();

  _gameCleanup = null;
}

/* ============================================================
   知識王
   ============================================================ */
let _quizCache = null;

// 功能：知識王題庫載入函式。寫法：先查模組快取，沒有才 fetch JSON 並存快取後回傳。
async function loadQuizBank() {
  if (_quizCache) return _quizCache;
  const res = await fetch('assets/games/quiz.json');
  _quizCache = await res.json();
  return _quizCache;
}

// 功能：知識王畫面渲染函式。寫法：回傳含載入訊息的容器，實際題目由 setupQuiz 非同步載入後渲染。
function renderQuiz(lang) {
  const loading = lang === 'zh' ? '題目準備中…' : 'Loading questions…';
  return `<div class="game-wrap quiz-wrap" id="quizWrap"><p class="game-msg">${loading}</p></div>`;
}

// 功能：知識王互動綁定函式。寫法：載入題庫後隨機抽 10 題，逐題渲染選項並判斷對錯上色，答完顯示分數與稱號，可重新挑戰。
async function setupQuiz(lang) {
  const wrap = document.getElementById('quizWrap');
  let bank;
  try {
    bank = await loadQuizBank();
  } catch (e) {
    wrap.innerHTML = `<p class="game-msg">${lang === 'zh' ? '題庫載入失敗 QQ' : 'Failed to load questions.'}</p>`;
    return;
  }

  const T = {
    q:      n => lang === 'zh' ? `第 ${n} / 10 題` : `Question ${n} / 10`,
    next:   lang === 'zh' ? '下一題 →' : 'Next →',
    result: lang === 'zh' ? '你的成績' : 'Your score',
    again:  lang === 'zh' ? '再挑戰一次' : 'Play Again',
    right:  lang === 'zh' ? '答對了！' : 'Correct!',
    wrong:  lang === 'zh' ? '答錯了 QQ' : 'Wrong!',
  };

  // 功能：成績稱號函式。寫法：依答對題數分四級回傳對應稱號文字。
  function rank(score) {
    if (score === 10) return lang === 'zh' ? '👑 真正的知識王！' : '👑 True Quiz Master!';
    if (score >= 7)  return lang === 'zh' ? '🌟 知識達人！' : '🌟 Trivia Expert!';
    if (score >= 4)  return lang === 'zh' ? '🌱 好奇寶寶，繼續加油！' : '🌱 Curious mind — keep going!';
    return lang === 'zh' ? '💪 再接再厲，下次一定行！' : '💪 Better luck next time!';
  }

  let questions, idx, score;

  // 功能：單題渲染函式。寫法：組出進度、題目與四個選項按鈕，選項順序每題重新洗牌，綁定作答事件。
  function showQuestion() {
    const q = questions[idx];
    const opts = shuffleArray(q.options.map((o, i) => ({ ...o, correct: i === q.answer })));
    wrap.innerHTML = `
      <p class="quiz-progress">${T.q(idx + 1)}　<span class="quiz-live-score">⭐ ${score}</span></p>
      <p class="quiz-question">${lang === 'zh' ? q.q.zh : q.q.en}</p>
      <div class="quiz-options">
        ${opts.map((o, i) => `<button class="quiz-option" data-i="${i}">${lang === 'zh' ? o.zh : o.en}</button>`).join('')}
      </div>
      <p class="game-msg" id="quizMsg"></p>
    `;
    const btns = [...wrap.querySelectorAll('.quiz-option')];
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.disabled = true);
        const correct = opts[i].correct;
        if (correct) { score++; btn.classList.add('right'); }
        else {
          btn.classList.add('wrong');
          btns[opts.findIndex(o => o.correct)].classList.add('right');
        }
        document.getElementById('quizMsg').textContent = correct ? T.right : T.wrong;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'card-btn game-restart';
        nextBtn.textContent = T.next;
        nextBtn.addEventListener('click', () => {
          idx++;
          if (idx < questions.length) showQuestion();
          else showResult();
        });
        wrap.appendChild(nextBtn);
      });
    });
  }

  // 功能：成績頁渲染函式。寫法：顯示得分與稱號，綁定再挑戰按鈕重新抽題開局。
  function showResult() {
    wrap.innerHTML = `
      <div class="quiz-result">
        <p class="quiz-result-label">${T.result}</p>
        <p class="quiz-result-score">${score} / 10</p>
        <p class="quiz-result-rank">${rank(score)}</p>
        <button class="card-btn game-restart" id="quizAgain">${T.again}</button>
      </div>
    `;
    document.getElementById('quizAgain').addEventListener('click', startRound);
  }

  // 功能：開局函式。寫法：洗牌題庫抽前 10 題，重設進度與分數後渲染第一題。
  function startRound() {
    questions = shuffleArray(bank).slice(0, 10);
    idx = 0; score = 0;
    showQuestion();
  }

  startRound();
  _gameCleanup = null;
}

/* ============================================================
   對外介面（給 main.js 呼叫）
   ============================================================ */

// 功能：遊戲 Modal 內容渲染分派函式。寫法：依遊戲 key 呼叫對應的 render 函式回傳 HTML 字串。
function renderGameModal(key, lang) {
  if (key === 'wordle')    return renderWordle(lang);
  if (key === 'pacman')    return renderPacman(lang);
  if (key === 'tictactoe') return renderTicTacToe(lang);
  if (key === 'quiz')      return renderQuiz(lang);
  return '';
}

// 功能：遊戲 Modal 互動綁定分派函式。寫法：先停掉上一個遊戲，再依遊戲 key 呼叫對應的 setup 函式。
function setupGameModal(key, lang) {
  stopActiveGame();
  if (key === 'wordle')    setupWordle(lang);
  if (key === 'pacman')    setupPacman(lang);
  if (key === 'tictactoe') setupTicTacToe(lang);
  if (key === 'quiz')      setupQuiz(lang);
}
