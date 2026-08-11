/* ============================================================
   《天命仙途》月回合修仙生涯
   以一個月為一回合，境界與年齡觸發 PDF 故事版中的關鍵事件。
   ============================================================ */
(function () {
  'use strict';

  const LIFE_KEY = 'bikaXianxiaLife';
  const RPG_SAVE_KEY_LIFE = 'bikaRpgSave';
  const RPG_ENDINGS_KEY_LIFE = 'bikaRpgEndings';

  const REALMS = [
    { zh: '凡人', en: 'Mortal', need: 24, life: 80 },
    { zh: '練氣', en: 'Qi Refining', need: 48, life: 100 },
    { zh: '築基', en: 'Foundation', need: 78, life: 150 },
    { zh: '金丹', en: 'Golden Core', need: 118, life: 300 },
    { zh: '元嬰', en: 'Nascent Soul', need: 168, life: 600 },
    { zh: '化神', en: 'Spirit Severing', need: 228, life: 1000 },
    { zh: '渡劫', en: 'Tribulation', need: null, life: 2000 },
  ];

  const ENDINGS = {
    '01': {
      zh: '結局・飛升成仙', en: 'Ending · Ascended Immortal',
      textZh: '你以混元靈根為橋，輪迴鏡、鎮岳印、焚天燈與斷劫劍同時照亮九霄。你沒有獻祭半界，而是讓眾生共同重鑄天道。飛升之門為所有生靈開啟，你成為守望諸界的新仙。',
      textEn: 'You use your Primordial Root as a bridge and join the power of the divine artifacts. Rather than sacrifice half the world, you let all beings rebuild Heaven together. The gate opens for every living soul, and you ascend as the guardian of a new age.',
    },
    '02': {
      zh: '結局・魔尊降世', en: 'Ending · Lord of Demons',
      textZh: '你接受心魔，也駕馭心魔。四大魔宗在斷劫劍前俯首，五大仙門的舊秩序被徹底擊碎。天下終於停止戰亂，卻從此只剩你的命令。你得到無人能奪走的一切，也失去了最初那顆想救人的心。',
      textEn: 'You embrace your inner demon and master it. The four demon sects bow before your blade, and the old order collapses. War ends, but the world now obeys one voice. You gain everything no one can take—and lose the heart that once wished to save others.',
    },
    '03': {
      zh: '結局・萬劍之祖', en: 'Ending · Sword Saint',
      textZh: '你棄神器、棄權勢，只留一柄斷劫。萬劍碑上刻下你一生劍意：「劍應先護人，再爭勝。」百年後，天下劍修皆沿著你開創的混元劍道前行。',
      textEn: 'You abandon artifacts and authority, keeping only your sword. Upon the Monument of Ten Thousand Blades you carve: “A sword protects before it conquers.” Every later sword cultivator follows the path you founded.',
    },
    '04': {
      zh: '結局・丹道至尊', en: 'Ending · Alchemy Master',
      textZh: '你先以丹救母，再以丹救世。五行同煉之術化腐朽為生機，天下病苦修士與凡人皆因你的丹方重獲新生。成仙之日，丹香飄滿十洲三島，連天門也為你而開。',
      textEn: 'You save your mother first, then the world. Your five-element alchemy restores life to mortals and cultivators alike. On the day of your ascension, the fragrance of medicine crosses every realm and the heavenly gate opens for you.',
    },
    '05': {
      zh: '結局・妖王契約者', en: 'Ending · Beast King',
      textZh: '你與夙璃締結平等血契，成為人族與妖族真正的橋梁。萬妖舊怨在你們手中平息，人妖共居之境自此建立。你行過山海時，白狐總在肩頭，群獸自願追隨身後。',
      textEn: 'You form an equal blood pact with Suli and become the first true bridge between humans and beastkind. Ancient hatred gives way to a shared realm. A white fox rests upon your shoulder while beasts freely follow your path.',
    },
    '06': {
      zh: '結局・輪迴守護者', en: 'Ending · Guardian of Samsara',
      textZh: '輪迴鏡完全認你為主。你留在生死之間，永世鎮守輪迴之門，不能飛升，也不能真正與故人重逢。從此再無邪修能竄改因果，每個亡魂都能平靜走向來生。',
      textEn: 'The Mirror of Samsara accepts you completely. You remain between life and death, unable to ascend or reunite with those you lost. No cultivator can twist causality again, and every soul may pass peacefully onward.',
    },
    '07': {
      zh: '結局・散修傳奇', en: 'Ending · Legendary Wanderer',
      textZh: '某個黎明，你只攜一劍、一壺酒離開所有宗門。哪裡有不平事，哪裡便出現一名青衣劍客。多年後，傳奇比你的姓名傳得更遠，而你早已消失在山海深處。',
      textEn: 'At dawn you leave every sect with one sword and one flask of wine. Wherever injustice rises, a wandering swordsman appears. In time your legend travels farther than your name, while you vanish beyond the mountains and seas.',
    },
    '08': {
      zh: '結局・一代宗主', en: 'Ending · Sect Leader',
      textZh: '你接掌太玄劍宗，打破門閥、開放山門，讓寒門弟子也能問鼎大道。太玄登頂五大仙門之首，不只因為劍強，更因為「仙門」二字終於重新配得上「護世」。',
      textEn: 'You take command of Taixuan, break the old clans, and open its gates to poor disciples. Taixuan rises above the Five Immortal Sects not merely through strength, but because the word “immortal” once again means “protector.”',
    },
    '09': {
      zh: '結局・天道失敗', en: 'Ending · Fallen Cultivator',
      textZh: '第九十九道天雷落下，你的靈根寸寸崩解，身軀化作劫灰。眾生為你立碑，夙璃守著那座碑走過許多年。你輸給了天，卻直到最後都沒有輸給自己。',
      textEn: 'The ninety-ninth bolt shatters your spirit root and turns your body to ash. The world raises a monument, and Suli keeps watch for many years. You lose to Heaven, but never to yourself.',
    },
    '10': {
      zh: '結局・凡人一生', en: 'Ending · Ordinary Life',
      textZh: '你放下仙途，回到青石村照料母親。後來你成了可靠的郎中、鄰人與父親，在院中燒一壺熱茶，看山色一年年變老。這一生不曾耀眼，卻完整而溫柔。',
      textEn: 'You leave cultivation and return to Qingshi Village to care for your mother. You become a trusted healer, neighbor, and parent, watching the mountains age over cups of warm tea. The life is never dazzling, but it is whole and gentle.',
    },
  };

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function newState() {
    return {
      version: 2,
      ageMonths: 16 * 12,
      lifespanYears: 80,
      realm: 0,
      cultivation: 0,
      hp: 100,
      maxHp: 100,
      daoHeart: 100,
      pills: 1,
      stones: 8,
      sword: 0,
      alchemy: 0,
      beast: 0,
      karma: 0,
      sect: 0,
      demon: 0,
      explore: 0,
      luck: 5,
      artifacts: 0,
      master: null,
      mother: 'ill',
      scene: 'foreword',
      resumeScene: 'intro',
      forewordSeen: false,
      turn: 0,
      flags: {
        foxMet: false,
        heartPassed: false,
        bloodMoon: false,
        sectWar: false,
        forbiddenLands: false,
        motherCrisis: false,
        wanderer: false,
        nightAlly: false,
      },
      last: {
        zh: '青石村的風第一次吹動命運。你仍是個照料病母、在黃昏仰望雲海的普通少年。',
        en: 'The wind of Qingshi Village stirs fate for the first time. You are still an ordinary youth caring for an ailing mother and watching the clouds at dusk.',
      },
    };
  }

  function normalizeState(raw) {
    const base = newState();
    const merged = {
      ...base,
      ...raw,
      flags: { ...base.flags, ...(raw.flags || {}) },
      last: raw.last || base.last,
    };
    if (!raw.forewordSeen && raw.scene !== 'foreword') {
      merged.resumeScene = raw.scene || 'intro';
      merged.scene = 'foreword';
    }
    return merged;
  }

  window.setupXianxiaLife = function setupXianxiaLife(lang, wrap, showMenu, useSave) {
    const pick = pair => (lang === 'zh' ? pair.zh : pair.en);
    const tx = (zh, en) => (lang === 'zh' ? zh : en);
    let state = useSave ? normalizeState(readJson(LIFE_KEY, newState())) : newState();

    function markRpgSave() {
      const all = readJson(RPG_SAVE_KEY_LIFE, {});
      all.xianxia = { life: true, node: state.scene };
      writeJson(RPG_SAVE_KEY_LIFE, all);
    }

    function save() {
      writeJson(LIFE_KEY, state);
      markRpgSave();
    }

    function clearSave() {
      try { localStorage.removeItem(LIFE_KEY); } catch (e) {}
      const all = readJson(RPG_SAVE_KEY_LIFE, {});
      delete all.xianxia;
      writeJson(RPG_SAVE_KEY_LIFE, all);
    }

    function unlockEnding(id) {
      const all = readJson(RPG_ENDINGS_KEY_LIFE, {});
      const list = all.xianxia || [];
      if (!list.includes(id)) list.push(id);
      all.xianxia = list;
      writeJson(RPG_ENDINGS_KEY_LIFE, all);
    }

    function yearMonth() {
      return {
        year: Math.floor(state.ageMonths / 12),
        month: state.ageMonths % 12 + 1,
      };
    }

    function clampStats() {
      state.hp = Math.max(0, Math.min(state.maxHp, state.hp));
      state.daoHeart = Math.max(0, Math.min(100, state.daoHeart));
      ['sword', 'alchemy', 'beast', 'karma', 'sect', 'demon', 'explore', 'luck'].forEach(k => {
        state[k] = Math.max(0, Math.min(999, state[k]));
      });
    }

    function renderForeword() {
      state.scene = 'foreword';
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      wrap.innerHTML = `
        <p class="xl-event-tag">${tx('遊戲前言', 'Before You Begin')}</p>
        <p class="rpg-ending-title">${tx('每一條仙路，都要付出代價', 'Every Immortal Road Has a Price')}</p>
        <p class="rpg-text">${tx(
          '《天命仙途》不是尋找唯一正確答案的故事，而是林澈從十六歲開始，一個月、一個月走完的人生。\n\n每個行動都有收穫，也一定有代價。閉關能增長修為，卻會消耗氣血與道心；煉丹能救人，卻需要靈石；休養能療傷，卻會讓修為與宗門聲望倒退。\n\n氣血歸零，你會道消身殞，進入「天道失敗」；道心歸零，你會被執念吞沒，走向「魔尊降世」；壽元耗盡而未能飛升，則會在歲月中坐化。\n\n你不必讓所有數值完美。你只需要決定：這一世願意得到什麼，又願意為此失去什麼。',
          'Path of Celestial Fate has no single correct answer. It is the life of Lin Che, lived one month at a time from the age of sixteen.\n\nEvery action brings a gain and a price. Seclusion raises cultivation but consumes health and resolve. Alchemy may save lives but costs spirit stones. Rest heals wounds but sacrifices progress and standing.\n\nIf health reaches zero, you fall upon the path. If resolve reaches zero, obsession consumes you and the Demon Lord fate begins. If your lifespan ends before ascension, you pass away with the years.\n\nYou do not need perfect statistics. Decide what this life will gain—and what it is willing to lose.'
        )}</p>
        <div class="rpg-choices">
          <button class="rpg-choice rpg-choice-key" id="xlForewordContinue">${tx('我明白了，翻開第一章', 'I understand — begin the first chapter')}</button>
          <button class="rpg-choice" id="xlForewordMenu">${tx('回到故事線選單', 'Back to storylines')}</button>
        </div>
      `;
      document.getElementById('xlForewordContinue').addEventListener('click', () => {
        state.forewordSeen = true;
        state.scene = state.resumeScene || 'intro';
        save();
        renderScene();
      });
      document.getElementById('xlForewordMenu').addEventListener('click', showMenu);
    }

    function renderIntro() {
      state.scene = 'intro';
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      wrap.innerHTML = `
        <p class="xl-event-tag">${tx('古風修仙生涯', 'A Cultivation Life')}</p>
        <p class="rpg-ending-title">《${tx('天命仙途', 'Path of Celestial Fate')}》</p>
        <p class="rpg-text">${tx(
          '青石村坐落在雲州邊陲。你叫林澈，自幼砍柴、挑水、照料病母，總把成仙的荒唐心願藏進袖口。\n\n這年初秋，太玄劍宗的仙舟破雲而來。母親握住你的手，輕聲說：「去吧，阿澈。去看看這天到底有多高。」\n\n本模式以一個月為一回合。修練、歷練與休養都會消耗時間；境界能延長壽元，傷勢與年齡也可能讓仙途提前結束。',
          'Qingshi Village lies at the edge of Yunzhou. You are Lin Che, a youth who chops wood, carries water, and cares for an ailing mother while hiding an impossible dream of immortality.\n\nOne autumn, the skyship of Taixuan arrives. Your mother takes your hand. “Go, Che. See how high the heavens truly are.”\n\nEach turn represents one month. Training, exploration, and rest all consume time. Higher realms extend your lifespan, while wounds and age may end the journey early.'
        )}</p>
        <div class="rpg-choices">
          <button class="rpg-choice rpg-choice-key" id="xlBegin">${tx('登上仙舟，參加測靈', 'Board the skyship and test your spirit root')}</button>
          <button class="rpg-choice" id="xlStay">${tx('留在青石村照顧母親', 'Remain in Qingshi Village with your mother')}</button>
          <button class="rpg-choice" id="xlIntroMenu">${tx('回到故事線選單', 'Back to storylines')}</button>
        </div>
      `;
      document.getElementById('xlBegin').addEventListener('click', () => {
        state.scene = 'master';
        state.last = {
          zh: '你的手按上測靈盤，金木水火土五色神芒直衝雲霄，青銅靈鐘自鳴九聲。先天混元靈根，千年不見。',
          en: 'At your touch, all five elements blaze into the sky and the bronze bell rings nine times. A Primordial Spirit Root—unseen for a thousand years.',
        };
        save();
        renderMasterChoice();
      });
      document.getElementById('xlStay').addEventListener('click', () => showEnding('10'));
      document.getElementById('xlIntroMenu').addEventListener('click', showMenu);
    }

    function renderChoices(tag, title, text, choices) {
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      wrap.innerHTML = `
        <p class="xl-event-tag">${tag}</p>
        <p class="rpg-ending-title">${title}</p>
        <p class="rpg-text">${text}</p>
        <div class="rpg-choices">
          ${choices.map((c, i) => `
            <button class="rpg-choice${c.key ? ' rpg-choice-key' : ''}" data-choice="${i}"${c.disabled ? ' disabled' : ''}>
              ${c.label}${c.note ? `<br><small>${c.note}</small>` : ''}
            </button>
          `).join('')}
        </div>
      `;
      wrap.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => choices[Number(btn.dataset.choice)].run());
      });
    }

    function renderMasterChoice() {
      state.scene = 'master';
      save();
      renderChoices(
        tx('宗門事件', 'Sect Event'),
        tx('三峰擇徒', 'Three Masters'),
        tx(
          `${state.last.zh}\n\n太玄大殿中，寒山真人、赤霞長老與神秘的玄微真人同時向你開口。每位師父都能帶你踏上不同的路。`,
          `${state.last.en}\n\nWithin Taixuan Hall, Sword Master Hanshan, Elder Chixia, and the mysterious Master Xuanwei each offer to teach you. Every master opens a different road.`
        ),
        [
          {
            label: tx('拜玄微真人為師', 'Choose Master Xuanwei'),
            note: tx('均衡修行，氣運與道心較高', 'Balanced growth, luck, and resolve'),
            key: true,
            run: () => chooseMaster('xuanwei'),
          },
          {
            label: tx('拜寒山真人為師', 'Choose Sword Master Hanshan'),
            note: tx('劍道起步更快', 'Faster sword development'),
            run: () => chooseMaster('sword'),
          },
          {
            label: tx('拜赤霞長老為師', 'Choose Elder Chixia'),
            note: tx('丹道起步更快，額外獲得回春丹', 'Faster alchemy and an extra healing pill'),
            run: () => chooseMaster('alchemy'),
          },
          {
            label: tx('婉拒峰主，從外門自行修行', 'Decline and cultivate independently'),
            note: tx('探索與散修路線較有利', 'Favors exploration and the wanderer path'),
            run: () => chooseMaster('wanderer'),
          },
        ]
      );
    }

    function chooseMaster(master) {
      state.master = master;
      state.scene = 'life';
      if (master === 'xuanwei') {
        state.luck += 10;
        state.karma += 8;
        state.last = {
          zh: '玄微真人不教驚世法術，只讓你劈柴、挑泉、觀息。他說：「第一要學的不是贏，是撐。」',
          en: 'Master Xuanwei teaches no spectacular art. He makes you chop wood, carry spring water, and observe your breath. “The first lesson is not victory. It is endurance.”',
        };
      } else if (master === 'sword') {
        state.sword += 18;
        state.last = {
          zh: '寒山真人將你帶上劍峰。九千柄殘劍在風中震鳴，你從拔出第一劍開始學習。',
          en: 'Hanshan leads you to Sword Peak, where nine thousand broken blades ring in the wind. Your path begins with drawing the first sword.',
        };
      } else if (master === 'alchemy') {
        state.alchemy += 18;
        state.pills += 1;
        state.last = {
          zh: '赤霞長老把你推進丹房。第一爐丹炸得屋瓦齊飛，他卻大笑著說你對火候有天分。',
          en: 'Elder Chixia pushes you into the alchemy room. Your first furnace blows tiles from the roof, yet he laughs and praises your feel for flame.',
        };
      } else {
        state.explore += 18;
        state.flags.wanderer = true;
        state.last = {
          zh: '你沒有選擇峰主，只領了一面外門木牌。仙路未必只有師門指好的那一條。',
          en: 'You choose no master and accept only an outer-disciple token. The immortal road need not follow a path chosen by others.',
        };
      }
      save();
      renderLife();
    }

    function actionList() {
      const canExplore = state.realm >= 1;
      const actions = [
        { id: 'train', icon: '🧘', zh: '吐納修練', en: 'Cultivate', dZh: '修為 +8～21／氣血 -4、道心 -2', dEn: 'Cultivation +8–21 / Health -4, Resolve -2' },
        { id: 'sword', icon: '⚔️', zh: '劍峰問劍', en: 'Sword Practice', dZh: '劍道 +6～13、修為 +3～6／氣血 -6', dEn: 'Sword +6–13, cultivation +3–6 / Health -6' },
        { id: 'alchemy', icon: '🧪', zh: '丹房煉丹', en: 'Practice Alchemy', dZh: '丹道 +6～13、可能得丹／靈石 -4', dEn: 'Alchemy +6–13, possible pill / Stones -4', disabled: state.stones < 4 },
        { id: 'beast', icon: '🦊', zh: '靈獸谷照料', en: 'Tend Spirit Beasts', dZh: '御獸 +6～10、道心 +3／靈石 -2', dEn: 'Beasts +6–10, resolve +3 / Stones -2', disabled: state.stones < 2 },
        { id: 'mission', icon: '📜', zh: state.master === 'wanderer' ? '接取坊市委託' : '執行宗門任務', en: state.master === 'wanderer' ? 'Take a Commission' : 'Sect Mission', dZh: '宗門與靈石增加／氣血 -5、道心 -2', dEn: 'Standing and stones increase / Health -5, Resolve -2' },
        { id: 'explore', icon: '🏯', zh: '外出歷練', en: 'Explore', dZh: canExplore ? '歷練與修為增加／氣血 -7、道心 -3' : '練氣後開放', dEn: canExplore ? 'Exploration and cultivation / Health -7, Resolve -3' : 'Unlocks at Qi Refining', disabled: !canExplore },
        { id: 'rest', icon: '🌙', zh: '休養調息', en: 'Rest', dZh: '氣血與道心恢復／修為 -3、宗門 -1', dEn: 'Restore health and resolve / Cultivation -3, Sect -1' },
        { id: 'home', icon: '🏡', zh: '返回青石村', en: 'Visit Home', dZh: '恢復道心、可能治母／靈石 -3、宗門 -2', dEn: 'Restore resolve, may cure mother / Stones -3, Sect -2' },
      ];
      if (state.realm >= 6) {
        actions.unshift({ id: 'heaven', icon: '⚡', zh: '再問天道', en: 'Challenge Heaven', dZh: '依照一生累積，選擇最終天命', dEn: 'Choose a final fate from your life achievements' });
      }
      return actions;
    }

    function renderLife() {
      state.scene = 'life';
      clampStats();
      save();
      const date = yearMonth();
      const realm = REALMS[state.realm];
      const need = realm.need;
      const progress = need ? Math.min(100, state.cultivation / need * 100) : 100;
      const motherText = state.mother === 'cured'
        ? tx('已康復', 'Cured')
        : state.mother === 'dead' ? tx('已故', 'Deceased') : tx('病中', 'Ill');

      wrap.className = 'game-wrap rpg-wrap xl-wrap';
      wrap.innerHTML = `
        <div class="xl-heading">
          <p class="xl-title">🐉 ${tx('天命仙途', 'Path of Celestial Fate')}</p>
          <p class="xl-calendar">${tx(`${date.year} 歲・${date.month} 月`, `Age ${date.year} · Month ${date.month}`)}</p>
        </div>
        <div class="xl-vitals">
          <div class="xl-vital"><span>${tx('境界', 'Realm')}</span><strong>${pick(realm)}</strong></div>
          <div class="xl-vital"><span>${tx('氣血', 'Health')}</span><strong>${state.hp}/${state.maxHp}</strong></div>
          <div class="xl-vital"><span>${tx('道心', 'Resolve')}</span><strong>${state.daoHeart}/100</strong></div>
          <div class="xl-vital"><span>${tx('壽元', 'Lifespan')}</span><strong>${state.lifespanYears}</strong></div>
          <div class="xl-vital"><span>${tx('靈石／丹藥', 'Stones / Pills')}</span><strong>${state.stones}／${state.pills}</strong></div>
        </div>
        <div class="xl-progress-card">
          <div class="xl-progress-head">
            <span>${tx('修為進度', 'Cultivation')}</span>
            <span>${need ? `${state.cultivation}/${need}` : tx('已至渡劫', 'Tribulation reached')}</span>
          </div>
          <div class="xl-progress-track"><div class="xl-progress-fill" style="width:${progress}%"></div></div>
        </div>
        <div class="xl-stats">
          <span class="xl-chip">⚔️ ${tx('劍道', 'Sword')} <strong>${state.sword}</strong></span>
          <span class="xl-chip">🧪 ${tx('丹道', 'Alchemy')} <strong>${state.alchemy}</strong></span>
          <span class="xl-chip">🦊 ${tx('御獸', 'Beasts')} <strong>${state.beast}</strong></span>
          <span class="xl-chip">☯️ ${tx('功德', 'Karma')} <strong>${state.karma}</strong></span>
          <span class="xl-chip">🏯 ${tx('宗門', 'Sect')} <strong>${state.sect}</strong></span>
          <span class="xl-chip">🌑 ${tx('魔念', 'Demon')} <strong>${state.demon}</strong></span>
          <span class="xl-chip">🗺️ ${tx('歷練', 'Explore')} <strong>${state.explore}</strong></span>
          <span class="xl-chip">🔮 ${tx('神器', 'Artifacts')} <strong>${state.artifacts}</strong></span>
        </div>
        <div class="xl-story"><span class="xl-story-title">${tx('本月紀事', 'This Month')}</span>${pick(state.last)}</div>
        <div class="xl-actions">
          ${actionList().map(a => `
            <button class="xl-action" data-action="${a.id}"${a.disabled ? ' disabled' : ''}>
              <span class="xl-action-icon">${a.icon}</span>
              <span><strong>${tx(a.zh, a.en)}</strong><small>${tx(a.dZh, a.dEn)}</small></span>
            </button>
          `).join('')}
        </div>
        <div class="xl-tools">
          <button class="xl-tool" id="xlUsePill"${state.pills < 1 || state.hp >= state.maxHp ? ' disabled' : ''}>🧪 ${tx('使用回春丹', 'Use Healing Pill')}</button>
          <button class="xl-tool" id="xlRetire">🍵 ${tx('考慮歸隱', 'Consider Retirement')}</button>
          <button class="xl-tool" id="xlMenu">↩ ${tx('回故事線選單', 'Back to Storylines')}</button>
        </div>
        <p class="xl-qualified">${tx(`母親：${motherText}・遊戲每個選擇推進一個月並自動存檔`, `Mother: ${motherText} · Every choice advances one month and saves automatically`)}</p>
      `;
      wrap.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => performAction(btn.dataset.action));
      });
      document.getElementById('xlUsePill').addEventListener('click', usePill);
      document.getElementById('xlRetire').addEventListener('click', renderRetire);
      document.getElementById('xlMenu').addEventListener('click', showMenu);
    }

    function rand(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }

    function advanceMonth() {
      state.ageMonths += 1;
      state.turn += 1;
      if (state.hp < 20) state.hp -= 2;
      if (checkCoreEnd()) return false;
      if (state.ageMonths >= state.lifespanYears * 12) {
        showDeath('age');
        return false;
      }
      const age = Math.floor(state.ageMonths / 12);
      if (age >= 20 && state.mother === 'ill' && !state.flags.motherCrisis) {
        state.flags.motherCrisis = true;
        state.scene = 'mother';
        save();
        renderMotherCrisis();
        return false;
      }
      return true;
    }

    function performAction(type) {
      if (type === 'heaven') {
        state.scene = 'heaven';
        save();
        renderHeaven();
        return;
      }

      const costs = {
        train: { hp: 4, heart: 2 },
        sword: { hp: 6 },
        alchemy: { stones: 4 },
        beast: { stones: 2 },
        mission: { hp: 5, heart: 2 },
        explore: { hp: 7, heart: 3 },
        rest: { cultivation: 3, sect: 1 },
        home: { stones: 3, sect: 2 },
      };
      const cost = costs[type] || {};
      state.hp -= cost.hp || 0;
      state.daoHeart -= cost.heart || 0;
      state.stones = Math.max(0, state.stones - (cost.stones || 0));
      state.cultivation = Math.max(0, state.cultivation - (cost.cultivation || 0));
      state.sect = Math.max(0, state.sect - (cost.sect || 0));

      if (type === 'train') {
        let gain = rand(8, 13) + (state.master === 'xuanwei' ? 2 : 0);
        if (Math.random() < 0.12) {
          gain += 8;
          state.luck += 2;
          state.last = { zh: `你在觀息中忽見五行相生，頓悟一夜。修為增加 ${gain}。`, en: `You glimpse the cycle of five elements and gain ${gain} cultivation in a night of insight.` };
        } else if (Math.random() < 0.08) {
          state.hp -= 10;
          state.demon += 3;
          state.last = { zh: `靈氣逆衝經脈，你勉強壓下走火之兆。修為增加 ${gain}，氣血受損。`, en: `Qi surges against your meridians. You suppress the deviation, gaining ${gain} cultivation but suffering injury.` };
        } else {
          state.last = { zh: `你引五行靈氣運轉周天，枯坐整月。修為增加 ${gain}。`, en: `You circulate five-element qi through your meridians for a full month, gaining ${gain} cultivation.` };
        }
        state.cultivation += gain;
      } else if (type === 'sword') {
        const gain = rand(6, 10) + (state.master === 'sword' ? 3 : 0);
        state.sword += gain;
        state.cultivation += rand(3, 6);
        if (Math.random() < 0.14) {
          state.hp -= 7;
          state.sword += 4;
          state.last = { zh: `你在劍坪越級挑戰內門弟子，雖負了傷，卻從敗招中悟出新的劍勢。劍道增加 ${gain + 4}。`, en: `You challenge a senior disciple and learn a new sword form through defeat. Sword skill rises by ${gain + 4}.` };
        } else {
          state.last = { zh: `鏽劍在手中逐漸褪去斑駁。你揮劍三萬次，劍道增加 ${gain}。`, en: `Rust slowly falls from your blade after thirty thousand strikes. Sword skill rises by ${gain}.` };
        }
      } else if (type === 'alchemy') {
        const gain = rand(6, 10) + (state.master === 'alchemy' ? 3 : 0);
        state.alchemy += gain;
        state.cultivation += rand(2, 5);
        if (Math.random() < 0.5) {
          state.pills += 1;
          state.last = { zh: `你以五行同煉之法穩住丹火，成功煉成一枚回春丹。丹道增加 ${gain}。`, en: `You balance the furnace with all five elements and refine a healing pill. Alchemy rises by ${gain}.` };
        } else if (Math.random() < 0.16) {
          state.hp -= 8;
          state.last = { zh: `丹爐炸得屋瓦齊飛。你灰頭土臉，卻記住了失控前的每一分火候。丹道增加 ${gain}。`, en: `The furnace explodes spectacularly. Soot-covered, you remember every change in the flame. Alchemy rises by ${gain}.` };
        } else {
          state.last = { zh: `這爐丹沒有成形，你仍從藥性變化中得到不少心得。丹道增加 ${gain}。`, en: `The batch fails to form, but its changing properties teach you much. Alchemy rises by ${gain}.` };
        }
      } else if (type === 'beast') {
        const gain = rand(6, 10);
        state.beast += gain;
        state.daoHeart += 3;
        state.cultivation += rand(2, 4);
        if (!state.flags.foxMet && state.realm >= 1) {
          state.flags.foxMet = true;
          state.beast += 14;
          state.karma += 5;
          state.last = {
            zh: '冬雪中，你救下一隻被雷劫餘波重傷的小白狐。她在傷癒後化名夙璃，明明說不欠人情，卻再也沒有真正離開。御獸大幅提升。',
            en: 'In winter snow, you rescue a white fox wounded by a tribulation. She takes the name Suli and insists she owes you nothing, yet never truly leaves. Beast affinity rises greatly.',
          };
        } else {
          state.last = { zh: `你沒有強迫靈獸認主，而是花了一個月學習牠們的習性。御獸增加 ${gain}。`, en: `Rather than force a bond, you spend a month learning the creatures' habits. Beast affinity rises by ${gain}.` };
        }
      } else if (type === 'mission') {
        const standing = rand(5, 9);
        const stones = rand(4, 8);
        state.sect += standing;
        state.stones += stones;
        state.cultivation += rand(2, 5);
        if (Math.random() < 0.2) {
          const injury = rand(5, 12);
          state.hp -= injury;
          state.karma += 3;
          state.last = { zh: `任務途中遭遇妖潮，你護住同行弟子後負傷 ${injury} 點，獲得 ${stones} 枚靈石。`, en: `A beast tide strikes during the mission. You protect your companions, suffer ${injury} damage, and earn ${stones} spirit stones.` };
        } else {
          state.karma += 2;
          state.last = { zh: `你完成山下除祟與護送任務，獲得 ${stones} 枚靈石，聲望漸增。`, en: `You complete an escort and spirit-cleansing mission, earn ${stones} stones, and gain recognition.` };
        }
      } else if (type === 'explore') {
        if (state.realm < 1) return;
        const exploreGain = rand(7, 12);
        state.explore += exploreGain;
        state.cultivation += rand(4, 8);
        if (Math.random() < 0.18) {
          state.artifacts += 1;
          state.luck += 4;
          state.last = { zh: `你在崩塌秘境中找到一段上古神器殘紋。歷練增加 ${exploreGain}，神器線索 +1。`, en: `Within a collapsing realm you discover markings from an ancient divine artifact. Exploration rises by ${exploreGain}; artifact clue +1.` };
        } else if (Math.random() < 0.25) {
          const injury = rand(6, 14);
          state.hp -= injury;
          state.last = { zh: `秘境禁制突然翻轉，你帶傷逃出，氣血損失 ${injury}，卻對陣法多了一層理解。`, en: `A secret-realm formation reverses without warning. You escape with ${injury} damage and a deeper understanding of ancient arrays.` };
        } else {
          state.last = { zh: `你走過荒城與古洞，帶回幾頁殘缺功法。歷練增加 ${exploreGain}。`, en: `You cross ruined cities and ancient caves, returning with fragments of lost scripture. Exploration rises by ${exploreGain}.` };
        }
      } else if (type === 'rest') {
        const heal = rand(16, 24);
        state.hp = Math.min(state.maxHp, state.hp + heal);
        state.daoHeart += 18;
        state.luck += 2;
        state.demon = Math.max(0, state.demon - 2);
        state.last = { zh: `你停下腳步休養，讀完母親寄來的家書。氣血恢復 ${heal}，心境稍定。`, en: `You pause to recover and read a letter from your mother. Health restores by ${heal}, and your heart grows calmer.` };
      } else if (type === 'home') {
        state.daoHeart += 12;
        if (state.mother === 'ill' && (state.alchemy >= 20 || state.pills >= 2)) {
          if (state.pills > 0) state.pills -= 1;
          state.mother = 'cured';
          state.karma += 15;
          state.alchemy += 5;
          state.last = {
            zh: '你帶著親手煉成的丹藥回到青石村。母親服藥後第一次不再整夜咳嗽。你曾在仙舟前許下的第一個願望，終於完成。',
            en: 'You return with medicine refined by your own hands. For the first time, your mother sleeps without coughing through the night. The first vow you made before boarding the skyship is fulfilled.',
          };
        } else if (state.mother === 'dead') {
          state.karma += 3;
          state.last = { zh: '你在母親墳前坐了一整月，把這些年沒來得及說的話慢慢說完。', en: 'You spend a month beside your mother’s grave, speaking every word that was left unsaid.' };
        } else if (state.mother === 'cured') {
          state.hp = Math.min(state.maxHp, state.hp + 12);
          state.karma += 4;
          state.last = { zh: '母親身體已好，仍把你當成需要多添一碗飯的孩子。你在熟悉的屋簷下住了一個月。', en: 'Though recovered, your mother still treats you as a child who needs another bowl of rice. You rest beneath the familiar roof.' };
        } else {
          state.hp = Math.min(state.maxHp, state.hp + 8);
          state.karma += 4;
          state.last = { zh: '你回村陪伴病母一個月。她的病仍未痊癒，卻笑著說只要看見你平安便好。', en: 'You spend a month with your ailing mother. She is not cured, but smiles and says your safe return is enough.' };
        }
      }

      clampStats();
      if (checkCoreEnd()) return;
      if (!advanceMonth()) return;
      if (checkBreakthrough()) return;
      save();
      renderLife();
    }

    function checkBreakthrough() {
      const realm = REALMS[state.realm];
      if (realm.need && state.cultivation >= realm.need) {
        state.scene = 'breakthrough';
        save();
        renderBreakthrough();
        return true;
      }
      return false;
    }

    function renderBreakthrough() {
      const current = REALMS[state.realm];
      const next = REALMS[state.realm + 1];
      renderChoices(
        tx('破境時刻', 'Breakthrough'),
        tx(`${pick(current)} → ${pick(next)}`, `${pick(current)} → ${pick(next)}`),
        tx(
          `積蓄已滿，五行靈氣在經脈中奔湧。破境能延長壽元，失敗則會損傷根基。\n\n目前氣血 ${state.hp}/${state.maxHp}，回春丹 ${state.pills} 枚。`,
          `Your accumulated qi surges through every meridian. A breakthrough extends your lifespan, while failure damages your foundation.\n\nHealth ${state.hp}/${state.maxHp}; healing pills ${state.pills}.`
        ),
        [
          {
            label: tx('穩住道心，順勢破境', 'Steady your heart and break through'),
            note: tx('氣血 35 以上穩定成功', 'Reliable above 35 health'),
            key: true,
            run: () => completeBreakthrough(false),
          },
          {
            label: tx('服回春丹護住經脈', 'Use a healing pill to protect your meridians'),
            note: tx('消耗 1 枚，必定成功並恢復氣血', 'Spend 1 pill for guaranteed success and healing'),
            disabled: state.pills < 1,
            run: () => completeBreakthrough(true),
          },
          {
            label: tx('暫緩突破，繼續打磨根基', 'Delay and continue refining your foundation'),
            run: () => {
              state.cultivation = Math.max(0, current.need - 1);
              state.scene = 'life';
              state.last = { zh: '你壓下躁動靈氣，決定再打磨一段時間。', en: 'You suppress the restless qi and choose to refine your foundation longer.' };
              save();
              renderLife();
            },
          },
        ]
      );
    }

    function completeBreakthrough(withPill) {
      const current = REALMS[state.realm];
      if (withPill) {
        state.pills -= 1;
        state.hp = Math.min(state.maxHp, state.hp + 25);
      } else if (state.hp < 35 && Math.random() > (0.35 + state.luck / 200)) {
        state.hp -= 15;
        state.cultivation = Math.max(0, current.need - 10);
        state.scene = 'life';
        state.last = {
          zh: '破境時氣血不繼，靈力沖散。你勉強保住經脈，需休養後再試。',
          en: 'Your strength fails during the breakthrough. You preserve your meridians, but must recover before trying again.',
        };
        clampStats();
        if (state.hp <= 0) showDeath('wounds');
        else { save(); renderLife(); }
        return;
      }

      state.cultivation -= current.need;
      state.realm += 1;
      state.lifespanYears = REALMS[state.realm].life;
      state.maxHp += 12;
      state.hp = Math.min(state.maxHp, state.hp + 22);
      state.scene = milestoneForRealm();
      state.last = {
        zh: `五行靈光沖開關竅，你成功踏入${REALMS[state.realm].zh}，壽元延長至 ${state.lifespanYears} 歲。`,
        en: `Five-element light opens your meridians. You enter ${REALMS[state.realm].en}, extending your lifespan to ${state.lifespanYears} years.`,
      };
      save();
      renderScene();
    }

    function milestoneForRealm() {
      if (state.realm === 2 && !state.flags.heartPassed) return 'heart';
      if (state.realm === 3 && !state.flags.bloodMoon) return 'bloodmoon';
      if (state.realm === 4 && !state.flags.sectWar) return 'sectwar';
      if (state.realm === 5 && !state.flags.forbiddenLands) return 'forbidden';
      if (state.realm === 6) return 'heaven';
      return 'life';
    }

    function renderHeart() {
      state.scene = 'heart';
      save();
      renderChoices(
        tx('築基心魔', 'Foundation Heart Demon'),
        tx('你修仙，究竟是為了什麼？', 'Why do you cultivate?'),
        tx(
          '黑夜裡，你看見母親病死、村落化為廢墟，也看見另一個自己立在屍山血海上。\n\n「你修仙，不就是怕失去嗎？既然害怕，不如先把所有能威脅你的人都殺了。」',
          'In the dark you see your mother dead, your village in ruins, and another version of yourself standing atop a mountain of corpses.\n\n“You cultivate because you fear loss. Why not kill everything that could ever threaten you?”'
        ),
        [
          {
            label: tx('「我可以怕，但不能先變成怪物。」', '“I may fear, but I will not become a monster first.”'),
            note: tx('功德 +16、劍道 +8、道心 +18', 'Karma +16, sword +8, resolve +18'),
            key: true,
            run: () => resolveHeart('resist'),
          },
          {
            label: tx('接受恐懼，學會與心魔共存', 'Accept the fear and live beside it'),
            note: tx('功德 +8、魔念 +8、氣運 +10', 'Karma +8, demon +8, luck +10'),
            run: () => resolveHeart('accept'),
          },
          {
            label: tx('「若力量能守住一切，入魔又何妨？」', '“If power protects everything, why fear becoming a demon?”'),
            note: tx('魔念 +28、劍道 +10／道心 -45', 'Demon +28, sword +10 / Resolve -45'),
            run: () => resolveHeart('demon'),
          },
        ]
      );
    }

    function resolveHeart(choice) {
      state.flags.heartPassed = true;
      if (choice === 'resist') {
        state.daoHeart += 18;
        state.karma += 16;
        state.sword += 8;
        state.last = { zh: '心魔崩散。玄微真人在門外點頭：「這一關，是你自己走出來的。」', en: 'The heart demon scatters. Master Xuanwei nods outside the door. “This trial was yours alone to overcome.”' };
      } else if (choice === 'accept') {
        state.karma += 8;
        state.demon += 8;
        state.luck += 10;
        state.last = { zh: '你沒有否認黑暗，也沒有讓它掌舵。心魔化成一道沉默的影子，提醒你力量的代價。', en: 'You neither deny the darkness nor let it steer. The demon becomes a quiet shadow, reminding you of power’s price.' };
      } else {
        state.daoHeart -= 45;
        state.demon += 28;
        state.sword += 10;
        state.last = { zh: '你握住心魔遞來的黑劍。力量暴漲，而往日熟悉的溫度開始變得遙遠。', en: 'You take the black sword offered by your inner demon. Power surges, while familiar warmth begins to feel distant.' };
      }
      if (checkCoreEnd()) return;
      state.scene = 'life';
      save();
      renderLife();
    }

    function renderBloodMoon() {
      state.scene = 'bloodmoon';
      save();
      renderChoices(
        tx('金丹大事件', 'Golden Core Event'),
        tx('血月遺城', 'The Blood-Moon Ruins'),
        tx(
          '十二秘境中最凶險的血月遺城提前現世。五大仙門、四大魔宗與妖族同時入城。青銅戰傀自地底甦醒，胸口藏著九大神器之一「輪迴鏡」的碎片。\n\n混亂中，你看見同門受困、夙璃被妖火反噬，而神器碎片近在眼前。',
          'The deadliest of the Twelve Secret Realms opens early. Immortal sects, demon factions, and beast clans enter together. A bronze guardian rises with a fragment of the Mirror of Samsara in its chest.\n\nYour companions are trapped, Suli burns under wild beastfire, and the artifact lies within reach.'
        ),
        [
          { label: tx('先救受困修士，再合力破傀', 'Save the trapped cultivators, then defeat the guardian'), note: tx('功德與宗門增加／神器較少', 'Karma and sect increase / Fewer artifacts'), key: true, run: () => resolveBloodMoon('save') },
          { label: tx('先救夙璃，與她聯手奪鏡', 'Save Suli and claim the mirror together'), note: tx('御獸大幅增加／宗門無增益', 'Major beast gain / No sect gain'), run: () => resolveBloodMoon('suli') },
          { label: tx('趁眾人混戰，獨自奪取神器', 'Seize the artifact while everyone fights'), note: tx('神器 +2、魔念增加／道心 -15', 'Artifacts +2 and demon gain / Resolve -15'), run: () => resolveBloodMoon('seize') },
        ]
      );
    }

    function resolveBloodMoon(choice) {
      state.flags.bloodMoon = true;
      if (choice === 'seize') state.daoHeart -= 15;
      state.artifacts += choice === 'seize' ? 2 : 1;
      state.explore += 12;
      if (choice === 'save') {
        state.karma += 12;
        state.sect += 14;
        state.last = { zh: '你聚集仙、魔、妖三方力量擊碎戰傀。輪迴鏡映出上古真相：天道或許早已病了。', en: 'You unite immortal, demon, and beast forces to destroy the guardian. The mirror reveals an ancient truth: Heaven itself may be sick.' };
      } else if (choice === 'suli') {
        state.flags.foxMet = true;
        state.beast += 24;
        state.karma += 6;
        state.last = { zh: '你替夙璃擋下魂火。她以王血助你擊破戰傀，輪迴鏡也記住了你們並肩的身影。', en: 'You shield Suli from soulfire. Her royal blood helps destroy the guardian, and the mirror remembers you standing together.' };
      } else {
        state.demon += 18;
        state.luck += 8;
        state.last = { zh: '你獨自奪走輪迴鏡碎片。所有人都活著離開，卻從此對你的野心多了一分戒備。', en: 'You seize the mirror alone. Everyone escapes alive, but they now watch your ambition with suspicion.' };
      }
      if (checkCoreEnd()) return;
      state.scene = 'life';
      save();
      renderLife();
    }

    function renderSectWar() {
      state.scene = 'sectwar';
      save();
      renderChoices(
        tx('元嬰大事件', 'Nascent Soul Event'),
        tx('宗門戰起，正邪同途', 'When Righteous and Demonic Paths Cross'),
        tx(
          '四大魔宗血洗三座宗門，五大仙門號召共討。魔宗少主夜無咎卻帶著證據闖入太玄：被滅宗門都在以凡人餵養天外祭陣。\n\n長老要你立刻殺他；輪迴鏡則顯示，真正的敵人藏在正邪旗幟之後。',
          'After three sects are destroyed, the Five Immortal Sects declare war. Demon heir Ye Wujiao breaks into Taixuan with evidence: those sects fed mortals to an outer-world formation.\n\nThe elders demand his death, while the mirror shows an enemy hidden behind both righteous and demonic banners.'
        ),
        [
          { label: tx('相信證據，促成正魔妖三方結盟', 'Trust the evidence and unite all three factions'), note: tx('功德與歷練增加／宗門成長較少', 'Karma and exploration / Less sect growth'), key: true, run: () => resolveSectWar('alliance') },
          { label: tx('守住正道立場，率宗門迎戰', 'Stand with the righteous sects and lead their defense'), note: tx('宗門 +30、劍道增加／失去夜無咎線索', 'Sect +30 and sword gain / Lose Ye’s lead'), run: () => resolveSectWar('sect') },
          { label: tx('與夜無咎離開，加入四大魔宗', 'Leave with Ye Wujiao and join the demon sects'), note: tx('魔念 +32、劍道增加／道心 -25、宗門下降', 'Demon +32 and sword / Resolve -25, sect loss'), run: () => resolveSectWar('demon') },
        ]
      );
    }

    function resolveSectWar(choice) {
      state.flags.sectWar = true;
      if (choice === 'demon') state.daoHeart -= 25;
      if (choice === 'alliance') {
        state.flags.nightAlly = true;
        state.karma += 16;
        state.sect += 12;
        state.explore += 12;
        state.last = { zh: '你第一次讓正道天驕、魔宗少主與妖族後裔坐在同一張桌前。真正的敵人，是延續萬年的獻祭謊言。', en: 'For the first time, righteous prodigies, a demon heir, and beast royalty share one table. The real enemy is a sacrificial lie ten thousand years old.' };
      } else if (choice === 'sect') {
        state.sect += 30;
        state.karma += 8;
        state.sword += 8;
        state.last = { zh: '你率太玄弟子守住山門，威望大增；但夜無咎帶著那份真相消失在戰火中。', en: 'You lead Taixuan in defending its gates and gain immense standing, while Ye Wujiao and his truth vanish into the war.' };
      } else {
        state.demon += 32;
        state.sword += 10;
        state.sect = Math.max(0, state.sect - 12);
        state.last = { zh: '你與夜無咎踏入魔域。四大魔宗尊重力量，而你的混元靈根足以讓所有人閉嘴。', en: 'You enter the demon lands with Ye Wujiao. The four sects respect power, and your Primordial Root silences every challenge.' };
      }
      if (checkCoreEnd()) return;
      state.scene = 'life';
      save();
      renderLife();
    }

    function renderForbidden() {
      state.scene = 'forbidden';
      save();
      renderChoices(
        tx('化神大事件', 'Spirit-Severing Event'),
        tx('三座禁地，九大神器', 'Three Forbidden Lands, Nine Divine Artifacts'),
        tx(
          '祭天大陣逐漸成形。要阻止天外存在，你必須踏入葬星海、無回淵與白骨天關，取回鎮岳印、焚天燈與真正的斷劫劍。\n\n玄微真人說，神器越多，背負的代價越重。',
          'The sacrificial formation nears completion. To stop the outer-world entity, you must cross the Star Burial Sea, the Abyss of No Return, and Bonegate to recover three divine artifacts.\n\nMaster Xuanwei warns that every artifact carries a heavier burden.'
        ),
        [
          { label: tx('與仙、魔、妖盟友共同遠征', 'Enter the forbidden lands with all your allies'), note: tx('神器 +3、功德增加／氣血 -10', 'Artifacts +3 and karma / Health -10'), key: true, run: () => resolveForbidden('allies') },
          { label: tx('不信任何勢力，獨自奪取神器', 'Trust no faction and seize the artifacts alone'), note: tx('神器 +3、魔念與氣運增加／氣血 -26、道心 -25', 'Artifacts +3, demon and luck / Health -26, resolve -25'), run: () => resolveForbidden('alone') },
          { label: tx('拒絕背負天下，離開所有大勢', 'Reject the burden and leave every faction behind'), note: tx('歷練 +32、開啟散修路／放棄三神器', 'Exploration +32 and wanderer path / Lose three artifacts'), run: () => resolveForbidden('leave') },
        ]
      );
    }

    function resolveForbidden(choice) {
      state.flags.forbiddenLands = true;
      if (choice === 'alone') state.daoHeart -= 25;
      if (choice === 'allies') {
        state.artifacts += 3;
        state.karma += 14;
        state.sword += 10;
        state.beast += state.flags.foxMet ? 10 : 0;
        state.hp -= 10;
        state.last = { zh: '夜無咎裂魂、夙璃燃血、玄微真人以身擋劫。你集齊三神器，也終於明白傳承是明知天地無情，仍願替眾生擋一步。', en: 'Ye Wujiao fractures his soul, Suli burns her blood, and Xuanwei gives his life. You claim three artifacts and learn that inheritance means shielding others despite a merciless Heaven.' };
      } else if (choice === 'alone') {
        state.artifacts += 3;
        state.demon += 22;
        state.luck += 10;
        state.hp -= 26;
        state.last = { zh: '你獨闖三座禁地，以重傷換回三神器。沒有人分享代價，也再沒有人能阻止你的決定。', en: 'You cross all three forbidden lands alone, trading grievous wounds for three artifacts. No one shares the cost—and no one can oppose your decisions.' };
      } else {
        state.flags.wanderer = true;
        state.explore += 32;
        state.karma += 4;
        state.last = { zh: '你在決戰前離開所有旗幟。天下說你逃避天命，你只想知道沒有宗門與神器的仙路，能否仍由自己走完。', en: 'You leave every banner before the final war. The world calls it cowardice; you seek a path that belongs to neither sect nor artifact.' };
      }
      clampStats();
      if (checkCoreEnd()) return;
      state.scene = 'life';
      save();
      renderLife();
    }

    function endingOptions() {
      const options = [
        {
          id: '01', ok: state.artifacts >= 3 && state.karma >= 20,
          reqZh: '需要神器 ≥ 3、功德 ≥ 20', reqEn: 'Requires artifacts ≥ 3 and karma ≥ 20',
        },
        {
          id: '02', ok: state.demon >= 35,
          reqZh: '需要魔念 ≥ 35', reqEn: 'Requires demon ≥ 35',
        },
        {
          id: '03', ok: state.sword >= 55,
          reqZh: '需要劍道 ≥ 55', reqEn: 'Requires sword ≥ 55',
        },
        {
          id: '04', ok: state.alchemy >= 55 && state.mother === 'cured',
          reqZh: '需要丹道 ≥ 55，且治好母親', reqEn: 'Requires alchemy ≥ 55 and mother cured',
        },
        {
          id: '05', ok: state.beast >= 50 && state.flags.foxMet,
          reqZh: '需要御獸 ≥ 50，且遇見夙璃', reqEn: 'Requires beasts ≥ 50 and meeting Suli',
        },
        {
          id: '06', ok: state.artifacts >= 4 && state.karma >= 35,
          reqZh: '需要神器 ≥ 4、功德 ≥ 35', reqEn: 'Requires artifacts ≥ 4 and karma ≥ 35',
        },
        {
          id: '07', ok: state.explore >= 55 || state.flags.wanderer,
          reqZh: '需要歷練 ≥ 55，或走上散修路', reqEn: 'Requires exploration ≥ 55 or the wanderer path',
        },
        {
          id: '08', ok: state.sect >= 55,
          reqZh: '需要宗門聲望 ≥ 55', reqEn: 'Requires sect standing ≥ 55',
        },
      ];
      return options;
    }

    function renderHeaven() {
      state.scene = 'heaven';
      save();
      const options = endingOptions();
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      wrap.innerHTML = `
        <p class="xl-event-tag">${tx('天道試煉', 'The Heavenly Trial')}</p>
        <p class="rpg-ending-title">${tx('你究竟想成為怎樣的人？', 'Who will you become?')}</p>
        <p class="rpg-text">${tx(
          '九天裂口睜開，天道要獻祭半界延續道統。輪迴鏡照見你走過的每一個月：修練、傷痕、母親、師父、夙璃、夜無咎，以及所有你選擇背負或放下的人。\n\n你一生累積的道路，決定此刻能回答天道的方式。',
          'A wound opens across the heavens, demanding half the world be sacrificed. The Mirror of Samsara reflects every month you lived: training, wounds, your mother, your master, Suli, Ye Wujiao, and everyone you chose to carry or abandon.\n\nThe life you built determines how you may answer Heaven.'
        )}</p>
        <div class="rpg-choices">
          ${options.map(o => {
            const end = ENDINGS[o.id];
            return `<button class="rpg-choice${o.ok ? ' rpg-choice-key' : ''}" data-ending="${o.id}"${o.ok ? '' : ' disabled'}>
              ${lang === 'zh' ? end.zh : end.en}<br><small>${o.ok ? tx('此生道路已具備', 'This fate is available') : tx(o.reqZh, o.reqEn)}</small>
            </button>`;
          }).join('')}
          <button class="rpg-choice" data-ending="09">${tx('強行渡劫，與天爭最後一步', 'Force the tribulation and challenge Heaven')}</button>
          <button class="rpg-choice" id="xlHeavenLater">${tx('暫不作答，返回人間繼續修行', 'Return to the world and continue cultivating')}</button>
        </div>
      `;
      wrap.querySelectorAll('[data-ending]').forEach(btn => {
        btn.addEventListener('click', () => showEnding(btn.dataset.ending));
      });
      document.getElementById('xlHeavenLater').addEventListener('click', () => {
        state.scene = 'life';
        state.last = { zh: '你暫時退出天道試煉。答案尚未成熟，人間仍有時間讓你繼續修行。', en: 'You withdraw from the trial. Your answer is not yet ready, and the mortal world still grants you time.' };
        save();
        renderLife();
      });
    }

    function renderMotherCrisis() {
      state.scene = 'mother';
      save();
      const canCure = state.alchemy >= 20 || state.pills >= 2;
      const canAsk = state.sect >= 15 || state.stones >= 30;
      renderChoices(
        tx('人生事件', 'Life Event'),
        tx('青石村的急信', 'An Urgent Letter from Qingshi'),
        tx(
          '你二十歲這年，村中來信：母親病勢突然惡化，普通藥石已無法壓制。她在信末仍寫著「修行要緊，不必掛念」，墨跡卻因咳嗽而顫抖。\n\n仙途很長，有些人卻未必等得到你成仙。',
          'In your twentieth year, a letter arrives: your mother’s illness has worsened beyond mortal medicine. She still writes, “Your cultivation matters. Do not worry,” though the ink trembles with every cough.\n\nThe immortal road is long. Some people may not live to see its end.'
        ),
        [
          {
            label: tx('趕回家，以丹術救治母親', 'Return and treat her with alchemy'),
            note: canCure ? tx('條件已具備', 'Available') : tx('需要丹道 ≥ 20 或回春丹 ≥ 2', 'Requires alchemy ≥ 20 or 2 pills'),
            key: canCure,
            disabled: !canCure,
            run: () => resolveMother('cure'),
          },
          {
            label: tx('向宗門求取續命靈藥', 'Ask the sect for life-saving medicine'),
            note: canAsk ? tx('條件已具備', 'Available') : tx('需要宗門 ≥ 15 或靈石 ≥ 30', 'Requires sect ≥ 15 or 30 stones'),
            disabled: !canAsk,
            run: () => resolveMother('ask'),
          },
          {
            label: tx('放下仙途，回家陪她走完餘生', 'Leave cultivation and spend her remaining years at home'),
            run: () => showEnding('10'),
          },
          {
            label: tx('忍痛留下修行，相信命數自有安排', 'Remain and entrust her fate to destiny'),
            run: () => resolveMother('leave'),
          },
        ]
      );
    }

    function resolveMother(choice) {
      if (choice === 'cure') {
        if (state.pills > 0) state.pills -= 1;
        state.mother = 'cured';
        state.alchemy += 8;
        state.karma += 18;
        state.last = { zh: '你趕回青石村守爐七日，終於煉成對症靈丹。母親醒來時，只責怪你瘦了。', en: 'You return and tend the furnace for seven days, finally refining the needed cure. When your mother wakes, she only scolds you for becoming too thin.' };
      } else if (choice === 'ask') {
        if (state.stones >= 30) state.stones -= 30;
        else state.sect = Math.max(0, state.sect - 15);
        state.mother = 'cured';
        state.karma += 10;
        state.last = { zh: '宗門送來續命靈藥。這份人情被記在你的名字下，也讓你第一次明白身在宗門的重量。', en: 'The sect sends life-saving medicine. The debt is recorded under your name, teaching you the true weight of belonging.' };
      } else {
        state.mother = 'dead';
        state.demon += 8;
        state.last = { zh: '你沒有回去。冬末，第二封信只剩短短一句：林母已逝。你在靜室坐了一夜，從此再沒提過那封信。', en: 'You do not return. At winter’s end, a second letter says only that your mother has passed. You sit alone through the night and never speak of the letter again.' };
      }
      state.scene = 'life';
      save();
      renderLife();
    }

    function renderRetire() {
      renderChoices(
        tx('人生抉擇', 'A Life Choice'),
        tx('放下仙途？', 'Leave the Immortal Road?'),
        tx(
          '你可以在任何時候離開爭鬥，回到青石村過完凡人的一生。已走過的修為、神器與聲名都將留在身後。',
          'You may leave the struggle at any time and return to Qingshi Village for a mortal life. Your cultivation, artifacts, and reputation will remain behind.'
        ),
        [
          { label: tx('確定歸隱，選擇凡人一生', 'Retire and choose an ordinary life'), run: () => showEnding('10') },
          { label: tx('我還沒有走到答案', 'My answer is still ahead'), key: true, run: renderLife },
        ]
      );
    }

    function usePill() {
      if (state.pills < 1 || state.hp >= state.maxHp) return;
      state.pills -= 1;
      state.hp = Math.min(state.maxHp, state.hp + 28);
      state.last = { zh: '你服下一枚回春丹，藥力化開，受損經脈逐漸復原。', en: 'You take a healing pill. Warm medicine spreads through your damaged meridians.' };
      save();
      renderLife();
    }

    function showEnding(id) {
      const ending = ENDINGS[id];
      unlockEnding(id);
      clearSave();
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      wrap.innerHTML = `
        <p class="rpg-ending-label">🏅 ${tx('達成天命', 'Fate Unlocked')}</p>
        <p class="rpg-ending-title">${lang === 'zh' ? ending.zh : ending.en}</p>
        <p class="rpg-text">${lang === 'zh' ? ending.textZh : ending.textEn}</p>
        <div class="rpg-choices">
          <button class="rpg-choice rpg-choice-key" id="xlAgain">${tx('再走一世', 'Live Another Life')}</button>
          <button class="rpg-choice" id="xlEndMenu">${tx('回到故事線選單', 'Back to Storylines')}</button>
        </div>
      `;
      document.getElementById('xlAgain').addEventListener('click', () => {
        state = newState();
        renderForeword();
      });
      document.getElementById('xlEndMenu').addEventListener('click', showMenu);
    }

    function checkCoreEnd() {
      clampStats();
      if (state.hp <= 0) {
        showCollapseEnding('health');
        return true;
      }
      if (state.daoHeart <= 0) {
        showCollapseEnding('heart');
        return true;
      }
      return false;
    }

    function showCollapseEnding(type) {
      const id = type === 'health' ? '09' : '02';
      const ending = ENDINGS[id];
      unlockEnding(id);
      clearSave();
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      wrap.innerHTML = `
        <p class="rpg-ending-label">💫 ${tx('數值歸零・命途改寫', 'A Depleted Fate')}</p>
        <p class="rpg-ending-title">${lang === 'zh' ? ending.zh : ending.en}</p>
        <p class="rpg-text">${type === 'health'
          ? tx('你的氣血在一次次透支中歸零。這不是天雷下的壯烈決戰，而是仙路對疏忽代價的冷酷回答。你未能走到最後，卻仍在後來者的故事裡留下名字。', 'Your health reaches zero after months of overexertion. This is no glorious final tribulation, only the immortal road collecting its price. Your name still remains in later stories.')
          : tx('你的道心終於被恐懼、執念與力量磨盡。九幽魔印回應空洞的心，四大魔宗在你面前跪下。從此林澈不再問什麼值得守護，只問誰敢違抗。', 'Fear, obsession, and power consume your resolve. The abyss answers the hollow left behind, and the four demon sects kneel. Lin Che no longer asks what deserves protection—only who dares disobey.')
        }</p>
        <div class="rpg-choices">
          <button class="rpg-choice rpg-choice-key" id="xlCollapseAgain">${tx('轉世重來', 'Begin Another Life')}</button>
          <button class="rpg-choice" id="xlCollapseMenu">${tx('回到故事線選單', 'Back to Storylines')}</button>
        </div>
      `;
      document.getElementById('xlCollapseAgain').addEventListener('click', () => {
        state = newState();
        renderForeword();
      });
      document.getElementById('xlCollapseMenu').addEventListener('click', showMenu);
    }

    function showDeath(reason) {
      clearSave();
      wrap.className = 'game-wrap rpg-wrap xl-wrap xl-event';
      const date = yearMonth();
      wrap.innerHTML = `
        <p class="rpg-ending-label">💫 ${tx('道途終止', 'Journey Ended')}</p>
        <p class="rpg-ending-title">${reason === 'age' ? tx('壽元已盡', 'Lifespan Exhausted') : tx('道消身殞', 'Fallen on the Path')}</p>
        <p class="rpg-text">${reason === 'age'
          ? tx(`你活到 ${date.year} 歲，仍未踏過最後一道天門。這一生的劍痕、丹方與傳聞留在人間，成為後來者路上的一盞微光。`, `You live to ${date.year}, never crossing the final gate. Your sword marks, formulas, and stories remain as a light for those who follow.`)
          : tx('傷勢耗盡最後一縷靈力。修仙之路本就步步凶險，這一世停在此處，下一世仍可重新選擇。', 'Your wounds consume the last of your spiritual power. The immortal road is perilous; this life ends here, but another may begin.')
        }</p>
        <div class="rpg-choices">
          <button class="rpg-choice rpg-choice-key" id="xlDeathAgain">${tx('轉世重來', 'Begin Another Life')}</button>
          <button class="rpg-choice" id="xlDeathMenu">${tx('回到故事線選單', 'Back to Storylines')}</button>
        </div>
      `;
      document.getElementById('xlDeathAgain').addEventListener('click', () => {
        state = newState();
        renderForeword();
      });
      document.getElementById('xlDeathMenu').addEventListener('click', showMenu);
    }

    function renderScene() {
      if (state.scene === 'foreword') renderForeword();
      else if (state.scene === 'intro') renderIntro();
      else if (state.scene === 'master') renderMasterChoice();
      else if (state.scene === 'breakthrough') renderBreakthrough();
      else if (state.scene === 'heart') renderHeart();
      else if (state.scene === 'bloodmoon') renderBloodMoon();
      else if (state.scene === 'sectwar') renderSectWar();
      else if (state.scene === 'forbidden') renderForbidden();
      else if (state.scene === 'mother') renderMotherCrisis();
      else if (state.scene === 'heaven') renderHeaven();
      else renderLife();
    }

    renderScene();
  };
})();
