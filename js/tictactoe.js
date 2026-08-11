/* ============================================================
   圈圈叉叉：一般模式／三子移動模式
   此檔載入於 games.js 之後，覆寫既有的圈圈叉叉畫面與互動函式。
   ============================================================ */

(function () {
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  function modeMenuHtml(lang) {
    const zh = lang === 'zh';
    return `
      <div class="ttt-mode-screen">
        <p class="ttt-mode-kicker">${zh ? '選擇玩法' : 'Choose a mode'}</p>
        <div class="ttt-mode-grid">
          <button class="ttt-mode-card" data-mode="classic">
            <span class="ttt-mode-icon">⭕❌</span>
            <strong>${zh ? '一般模式' : 'Classic'}</strong>
            <small>${zh ? '輪流落子，先連成一線者獲勝。' : 'Take turns placing marks. First to make a line wins.'}</small>
          </button>
          <button class="ttt-mode-card" data-mode="three">
            <span class="ttt-mode-icon">③↔</span>
            <strong>${zh ? '三子模式' : 'Three-piece'}</strong>
            <small>${zh ? '每方最多三枚；自己的第四回合起，移動其中一枚到任意空格。' : 'Three marks each; from your fourth turn, move one mark to any empty cell.'}</small>
          </button>
        </div>
      </div>
    `;
  }

  window.renderTicTacToe = function renderTicTacToeWithModes(lang) {
    return `<div class="game-wrap ttt-wrap" id="tttModeRoot">${modeMenuHtml(lang)}</div>`;
  };

  window.setupTicTacToe = function setupTicTacToeWithModes(lang) {
    const root = document.getElementById('tttModeRoot');
    if (!root) return;
    const zh = lang === 'zh';

    const T = {
      choose: zh ? '選擇玩法' : 'Choose a mode',
      back: zh ? '← 返回模式選擇' : '← Back to modes',
      you: zh ? '你' : 'You',
      ai: zh ? '比卡 AI' : 'Bika AI',
      drawLabel: zh ? '平手' : 'Draw',
      firstLabel: zh ? '先手：' : 'First:',
      youFirst: zh ? '我先' : 'Me',
      aiFirst: zh ? 'AI 先' : 'AI',
      restart: zh ? '重新開始' : 'Restart',
      classicTitle: zh ? '一般模式' : 'Classic',
      threeTitle: zh ? '三子模式' : 'Three-piece',
      classicHint: zh ? '你是 ⭕，請選一格落子。' : 'You are ⭕. Choose an empty cell.',
      aiOpened: zh ? '比卡 AI（❌）已先手，輪到你。' : 'Bika AI (❌) opened. Your turn.',
      youWin: zh ? '你贏了！🎉' : 'You win! 🎉',
      aiWin: zh ? '比卡 AI 贏了！再挑戰一次？' : 'Bika AI wins! Try again?',
      draw: zh ? '平手！勢均力敵～' : "It's a draw!",
      place: n => zh ? `請放置第 ${n}／3 枚 ⭕` : `Place mark ${n}/3`,
      select: zh ? '三枚已放完：請先選一枚自己的 ⭕。' : 'All three placed: select one of your ⭕ marks.',
      destination: zh ? '已選取棋子，請點空格移動；也可以改選另一枚。' : 'Mark selected. Choose an empty cell, or select another mark.',
      threeRule: zh ? '每方最多三枚；自己的第四回合起，先點己方棋子，再點任意空格移動。' : 'Three marks per side. From your fourth turn, select your mark, then any empty cell.',
    };

    function showModeMenu() {
      root.innerHTML = modeMenuHtml(lang);
      root.querySelectorAll('.ttt-mode-card').forEach(btn => {
        btn.addEventListener('click', () => startGame(btn.dataset.mode));
      });
    }

    function gameHtml(mode) {
      let cells = '';
      for (let i = 0; i < 9; i++) cells += `<button class="ttt-cell" data-idx="${i}" aria-label="${i + 1}"></button>`;
      return `
        <div class="ttt-game-head">
          <button class="ttt-back-btn" id="tttModeBack">${T.back}</button>
          <span class="ttt-current-mode">${mode === 'three' ? T.threeTitle : T.classicTitle}</span>
        </div>
        <div class="ttt-score-row">
          <span>${T.you}：<b id="tttYou">0</b></span>
          <span>${T.drawLabel}：<b id="tttDraw">0</b></span>
          <span>${T.ai}：<b id="tttAi">0</b></span>
        </div>
        <div class="ttt-first-row">
          <span class="ttt-first-label">${T.firstLabel}</span>
          <button class="ttt-first-btn active" data-first="you">${T.youFirst}</button>
          <button class="ttt-first-btn" data-first="ai">${T.aiFirst}</button>
        </div>
        ${mode === 'three' ? `<p class="ttt-rule">${T.threeRule}</p>` : ''}
        <p class="game-msg" id="gameMsg"></p>
        <div class="ttt-board">${cells}</div>
        <button class="card-btn game-restart" id="gameRestart">${T.restart}</button>
      `;
    }

    function startGame(mode) {
      root.innerHTML = gameHtml(mode);
      const msg = root.querySelector('#gameMsg');
      const cells = [...root.querySelectorAll('.ttt-cell')];
      const tally = { you: 0, ai: 0, draw: 0 };
      let board = Array(9).fill('');
      let firstMover = 'you';
      let selected = null;
      let over = false;
      let moveCount = 0;
      let positions = new Map();

      function winLine(sym, state = board) {
        return LINES.find(line => line.every(i => state[i] === sym)) || null;
      }

      function count(sym, state = board) {
        return state.filter(v => v === sym).length;
      }

      function legalMoves(sym, state = board) {
        const empty = state.map((v, i) => v === '' ? i : -1).filter(i => i >= 0);
        if (mode === 'three' && count(sym, state) >= 3) {
          const own = state.map((v, i) => v === sym ? i : -1).filter(i => i >= 0);
          return own.flatMap(from => empty.map(to => ({ from, to })));
        }
        return empty.map(to => ({ from: null, to }));
      }

      function simulate(state, move, sym) {
        const next = state.slice();
        if (move.from !== null) next[move.from] = '';
        next[move.to] = sym;
        return next;
      }

      function aiPick() {
        const choices = legalMoves('❌');
        if (!choices.length) return null;
        let bestScore = -Infinity;
        let best = [];

        choices.forEach(move => {
          const next = simulate(board, move, '❌');
          let score = 0;
          if (winLine('❌', next)) score += 10000;

          const replies = legalMoves('⭕', next);
          const winningReplies = replies.filter(reply => winLine('⭕', simulate(next, reply, '⭕'))).length;
          score -= winningReplies * 1200;

          const weights = [3, 2, 3, 2, 5, 2, 3, 2, 3];
          score += weights[move.to];
          if (move.from !== null) score -= weights[move.from] * 0.15;
          score += Math.random();

          if (score > bestScore) {
            bestScore = score;
            best = [move];
          } else if (score === bestScore) {
            best.push(move);
          }
        });
        return best[Math.floor(Math.random() * best.length)];
      }

      function paintBoard() {
        cells.forEach((cell, i) => {
          cell.textContent = board[i];
          cell.classList.toggle('selected', i === selected);
          cell.classList.toggle('movable', mode === 'three' && count('⭕') >= 3 && board[i] === '⭕' && !over);
        });
      }

      function finish(who, line = null) {
        over = true;
        selected = null;
        if (line) line.forEach(i => cells[i].classList.add('win'));
        tally[who]++;
        const id = who === 'you' ? 'tttYou' : who === 'ai' ? 'tttAi' : 'tttDraw';
        root.querySelector(`#${id}`).textContent = tally[who];
        msg.textContent = who === 'you' ? T.youWin : who === 'ai' ? T.aiWin : T.draw;
        paintBoard();
      }

      function checkAfterMove(sym, who) {
        const line = winLine(sym);
        if (line) {
          finish(who, line);
          return true;
        }
        if (mode === 'classic' && board.every(Boolean)) {
          finish('draw');
          return true;
        }
        return false;
      }

      function updateTurnHint() {
        if (over) return;
        if (mode === 'classic') {
          msg.textContent = T.classicHint;
        } else if (count('⭕') < 3) {
          msg.textContent = T.place(count('⭕') + 1);
        } else {
          msg.textContent = selected === null ? T.select : T.destination;
        }
      }

      function registerPosition() {
        if (mode !== 'three' || over) return;
        const key = board.join('|');
        const seen = (positions.get(key) || 0) + 1;
        positions.set(key, seen);
        if (seen >= 3 || moveCount >= 100) finish('draw');
      }

      function aiTurn() {
        if (over) return;
        const move = aiPick();
        if (!move) {
          finish('draw');
          return;
        }
        board = simulate(board, move, '❌');
        moveCount++;
        paintBoard();
        if (checkAfterMove('❌', 'ai')) return;
        // 移動自己的棋子可能讓原本被擋住的玩家連線重新成立。
        if (mode === 'three') {
          const exposedPlayerLine = winLine('⭕');
          if (exposedPlayerLine) {
            finish('you', exposedPlayerLine);
            return;
          }
        }
        registerPosition();
        updateTurnHint();
      }

      function completePlayerMove(from, to) {
        board = simulate(board, { from, to }, '⭕');
        selected = null;
        moveCount++;
        paintBoard();
        if (checkAfterMove('⭕', 'you')) return;
        // 玩家若移開阻擋棋，讓 AI 已有的三枚連線成立，立即判 AI 獲勝。
        if (mode === 'three') {
          const exposedAiLine = winLine('❌');
          if (exposedAiLine) {
            finish('ai', exposedAiLine);
            return;
          }
        }
        aiTurn();
      }

      function onCell(i) {
        if (over) return;

        if (mode === 'three' && count('⭕') >= 3) {
          if (board[i] === '⭕') {
            selected = i;
            paintBoard();
            updateTurnHint();
            return;
          }
          if (board[i] === '' && selected !== null) completePlayerMove(selected, i);
          return;
        }

        if (board[i] !== '') return;
        completePlayerMove(null, i);
      }

      function restart() {
        board = Array(9).fill('');
        selected = null;
        over = false;
        moveCount = 0;
        positions = new Map();
        cells.forEach(cell => cell.classList.remove('win', 'selected', 'movable'));
        paintBoard();
        if (firstMover === 'ai') {
          aiTurn();
          if (!over) msg.textContent = T.aiOpened;
        } else {
          updateTurnHint();
        }
      }

      cells.forEach((cell, i) => cell.addEventListener('click', () => onCell(i)));
      root.querySelector('#gameRestart').addEventListener('click', restart);
      root.querySelector('#tttModeBack').addEventListener('click', showModeMenu);
      root.querySelectorAll('.ttt-first-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          firstMover = btn.dataset.first;
          root.querySelectorAll('.ttt-first-btn').forEach(b => b.classList.toggle('active', b === btn));
          restart();
        });
      });

      restart();
    }

    showModeMenu();
    _gameCleanup = null;
  };
})();
