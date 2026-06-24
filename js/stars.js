/* Animated background: starry night (dark) / drifting planets (light) */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let stars   = [];
let planets = [];

// 功能：視窗尺寸改變的處理。寫法：重設 canvas 寬高，再呼叫 init() 重新產生星星/星球。
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
}

// 功能：隨機數工具。寫法：Math.random() 配合線性映射，回傳 a~b 之間的隨機浮點數。
function randBetween(a, b) { return a + Math.random() * (b - a); }

// 功能：星星資料產生器。寫法：用 randBetween 隨機決定座標、大小、速度、相位、顏色。
function makeStar() {
  return {
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    size:  randBetween(0.3, 1.8),
    base:  randBetween(0.15, 0.9),
    speed: randBetween(0.004, 0.022),
    phase: Math.random() * Math.PI * 2,
    color: ['#ffffff','#c8d8ff','#d8c8ff','#ffd8ec'][Math.floor(Math.random() * 4)],
  };
}

// 功能：星球資料產生器。寫法：隨機座標、半徑、漂移速度 vx/vy、相位與粉色系顏色。
function makePlanet() {
  const palette = ['#ff9eb5','#ffb3c6','#ffd4e8','#ffc4aa','#ffddcc','#ffe4f0'];
  return {
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     randBetween(3, 10),
    base:  randBetween(0.08, 0.35),
    vx:    (Math.random() - 0.5) * 0.28,
    vy:    (Math.random() - 0.5) * 0.28,
    phase: Math.random() * Math.PI * 2,
    speed: randBetween(0.006, 0.018),
    color: palette[Math.floor(Math.random() * palette.length)],
  };
}

// 功能：初始化動畫資料。寫法：Array.from 批量呼叫 makeStar/makePlanet 重建陣列。
function init() {
  stars   = Array.from({ length: 220 }, makeStar);
  planets = Array.from({ length: 28  }, makePlanet);
}

/* ---- Meteors ---- */
let meteors = [];
let meteorTimer = 0;
const METEOR_INTERVAL = 3.5;

// 功能：流星資料產生器。寫法：從畫面上方隨機位置出發，給定速度、長度與淡出速率。
function makeMeteor() {
  return {
    x:     randBetween(canvas.width * 0.1, canvas.width * 0.85),
    y:     -20,
    vx:    randBetween(3, 6),
    vy:    randBetween(2, 4),
    len:   randBetween(80, 160),
    alpha: 1,
    fade:  randBetween(0.012, 0.022),
  };
}

// 功能：流星狀態更新邏輯。寫法：用計時器定期新增流星，filter 移除已淡出者，forEach 更新位置與透明度。
function updateMeteors(dt) {
  meteorTimer += dt;
  if (meteorTimer > METEOR_INTERVAL) {
    meteors.push(makeMeteor());
    meteorTimer = 0;
  }
  meteors = meteors.filter(m => m.alpha > 0);
  meteors.forEach(m => {
    m.x     += m.vx;
    m.y     += m.vy;
    m.alpha -= m.fade;
  });
}

// 功能：流星繪製函式。寫法：依速度方向算出尾巴端點，用 createLinearGradient 畫出頭亮尾淡的線段。
function drawMeteors() {
  meteors.forEach(m => {
    const spd  = Math.hypot(m.vx, m.vy);
    const tailX = m.x - (m.vx / spd) * m.len;
    const tailY = m.y - (m.vy / spd) * m.len;
    const grad  = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
    grad.addColorStop(0,   `rgba(255, 255, 255, ${m.alpha})`);
    grad.addColorStop(0.3, `rgba(200, 170, 255, ${m.alpha * 0.55})`);
    grad.addColorStop(1,   'rgba(180, 140, 255, 0)');
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1.5;
    ctx.globalAlpha = m.alpha;
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

/* ---- Dark mode: twinkling star field ---- */
let lastT = 0;

// 功能：深色主題每幀繪製函式。寫法：clearRect 清畫面後疊星雲漸層，forEach 用 sin 算每顆星星的閃爍亮度並畫出，再接流星邏輯。
function drawStars(t) {
  const dt = t - lastT;
  lastT = t;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* deep purple nebula — top left */
  const g1 = ctx.createRadialGradient(
    canvas.width * 0.18, canvas.height * 0.22, 0,
    canvas.width * 0.18, canvas.height * 0.22, canvas.width * 0.52);
  g1.addColorStop(0,   'rgba(110, 60, 200, 0.18)');
  g1.addColorStop(0.5, 'rgba(80, 40, 160, 0.09)');
  g1.addColorStop(1,   'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* violet nebula — bottom right */
  const g2 = ctx.createRadialGradient(
    canvas.width * 0.85, canvas.height * 0.78, 0,
    canvas.width * 0.85, canvas.height * 0.78, canvas.width * 0.45);
  g2.addColorStop(0,   'rgba(140, 60, 220, 0.14)');
  g2.addColorStop(0.5, 'rgba(100, 40, 180, 0.07)');
  g2.addColorStop(1,   'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* blue-indigo — center right */
  const g3 = ctx.createRadialGradient(
    canvas.width * 0.72, canvas.height * 0.38, 0,
    canvas.width * 0.72, canvas.height * 0.38, canvas.width * 0.32);
  g3.addColorStop(0,   'rgba(60, 80, 210, 0.10)');
  g3.addColorStop(1,   'transparent');
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* magenta — bottom left */
  const g4 = ctx.createRadialGradient(
    canvas.width * 0.08, canvas.height * 0.88, 0,
    canvas.width * 0.08, canvas.height * 0.88, canvas.width * 0.35);
  g4.addColorStop(0,   'rgba(160, 40, 180, 0.10)');
  g4.addColorStop(1,   'transparent');
  ctx.fillStyle = g4;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* stars */
  stars.forEach(s => {
    const alpha = s.base + Math.sin(t * s.speed * 60 + s.phase) * (s.base * 0.5);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle   = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();

    if (s.size > 1.3) {
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
      glow.addColorStop(0, 'rgba(200, 180, 255, 0.18)');
      glow.addColorStop(1, 'rgba(200, 180, 255, 0)');
      ctx.globalAlpha = alpha * 0.45;
      ctx.fillStyle   = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;

  updateMeteors(dt);
  drawMeteors();
}

/* ---- Light mode: drifting planet bubbles ---- */
// 功能：亮色主題每幀繪製函式。寫法：clearRect 清畫面後疊背景光暈，forEach 更新星球位置（出界繞回）並用 sin 做脈動大小/透明度的漸層圓形。
function drawPlanets(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bg = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.35, 0,
    canvas.width * 0.5, canvas.height * 0.5,  canvas.width * 0.75);
  bg.addColorStop(0, 'rgba(255,200,225,0.12)');
  bg.addColorStop(1, 'transparent');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  planets.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -p.r * 2)                p.x = canvas.width  + p.r * 2;
    if (p.x > canvas.width  + p.r * 2) p.x = -p.r * 2;
    if (p.y < -p.r * 2)                p.y = canvas.height + p.r * 2;
    if (p.y > canvas.height + p.r * 2) p.y = -p.r * 2;

    const pulse = 1 + Math.sin(t * p.speed * 60 + p.phase) * 0.28;
    const r     = p.r * pulse;

    const grad = ctx.createRadialGradient(
      p.x - r * 0.3, p.y - r * 0.3, 0, p.x, p.y, r * 1.6);
    grad.addColorStop(0, p.color + 'cc');
    grad.addColorStop(0.55, p.color + '55');
    grad.addColorStop(1, p.color + '00');

    ctx.globalAlpha = p.base + Math.sin(t * p.speed * 40 + p.phase) * 0.06;
    ctx.fillStyle   = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

// 功能：動畫主迴圈。寫法：用 requestAnimationFrame 驅動，依目前主題呼叫 drawStars 或 drawPlanets，再遞迴排下一幀。
function loop(t) {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  if (theme === 'dark') drawStars(t * 0.001);
  else                  drawPlanets(t * 0.001);
  requestAnimationFrame(loop);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(loop);
