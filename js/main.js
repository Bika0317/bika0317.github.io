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
    wordBank: [
      { hanzi: 'Hello',      tailo: 'heh-LOH',      meaning: '你好',   usage: '見到任何人都可以說，是最萬用的打招呼方式' },
      { hanzi: 'Thank you',  tailo: 'THANK-yoo',    meaning: '謝謝',   usage: '別人幫你或給你東西時說，加上 so much 更有誠意' },
      { hanzi: 'Sorry',      tailo: 'SOH-ree',      meaning: '對不起', usage: '犯錯、打擾別人或遲到時說，很常用到' },
      { hanzi: 'Please',     tailo: 'PLEEZ',        meaning: '請',     usage: '請求別人幫忙時加在句尾，讓語氣更有禮貌' },
      { hanzi: 'Yes',        tailo: 'YES',          meaning: '是',     usage: '回答問題或表示同意時使用' },
      { hanzi: 'No',         tailo: 'NOH',          meaning: '不是',   usage: '禮貌地拒絕或否定時使用' },
      { hanzi: 'Water',      tailo: 'WAW-ter',      meaning: '水',     usage: '餐廳點水說「Water, please」，簡單又實用' },
      { hanzi: 'Food',       tailo: 'FOOD',         meaning: '食物',   usage: '討論吃什麼時用，例如「I love Thai food」' },
      { hanzi: 'Good',       tailo: 'GOOD',         meaning: '好的',   usage: '稱讚東西或回答「How are you?」時說「Good!」' },
      { hanzi: 'Bad',        tailo: 'BAD',          meaning: '壞的',   usage: '描述不好的狀況，例如「The weather is bad today」' },
      { hanzi: 'Happy',      tailo: 'HAP-ee',       meaning: '快樂的', usage: '分享心情說「I\'m happy」，生日說「Happy birthday!」' },
      { hanzi: 'Sad',        tailo: 'SAD',          meaning: '悲傷的', usage: '表達難過說「I\'m sad」，安慰人說「Don\'t be sad」' },
      { hanzi: 'Hot',        tailo: 'HOT',          meaning: '熱的',   usage: '天氣熱說「It\'s hot」，食物燙說「The soup is hot」' },
      { hanzi: 'Cold',       tailo: 'KOHLD',        meaning: '冷的',   usage: '天氣冷說「It\'s cold outside」，飲料冷說「cold drink」' },
      { hanzi: 'Big',        tailo: 'BIG',          meaning: '大的',   usage: '描述尺寸說「This bag is too big」' },
      { hanzi: 'Small',      tailo: 'SMAWL',        meaning: '小的',   usage: '試衣服說「This is too small for me」' },
      { hanzi: 'Eat',        tailo: 'EET',          meaning: '吃',     usage: '問朋友「Did you eat?」是很自然的關心方式' },
      { hanzi: 'Drink',      tailo: 'DRINK',        meaning: '喝',     usage: '點飲料說「I\'d like to drink something cold」' },
      { hanzi: 'Sleep',      tailo: 'SLEEP',        meaning: '睡覺',   usage: '道晚安說「Time to sleep!」，抱怨「I can\'t sleep」' },
      { hanzi: 'Walk',       tailo: 'WAWK',         meaning: '走路',   usage: '邀人散步說「Let\'s go for a walk」' },
      { hanzi: 'Run',        tailo: 'RUN',          meaning: '跑步',   usage: '趕時間說「I have to run!」，或說「I run every day」' },
      { hanzi: 'Go',         tailo: 'GOH',          meaning: '去',     usage: '出發時說「Let\'s go!」，是最常用的動詞之一' },
      { hanzi: 'Come',       tailo: 'KUM',          meaning: '來',     usage: '叫朋友過來說「Come here!」或「Come with me」' },
      { hanzi: 'See',        tailo: 'SEE',          meaning: '看見',   usage: '道別說「See you later!」或「See you tomorrow!」' },
      { hanzi: 'Hear',       tailo: 'HEER',         meaning: '聽見',   usage: '沒聽清楚說「I can\'t hear you」，請對方重說' },
      { hanzi: 'Talk',       tailo: 'TAWK',         meaning: '說話',   usage: '找人談話說「Can we talk?」，很實用的一句' },
      { hanzi: 'Love',       tailo: 'LUV',          meaning: '愛',     usage: '告白說「I love you」，也可以說「I love this song」' },
      { hanzi: 'Like',       tailo: 'LYK',          meaning: '喜歡',   usage: '表達喜好說「I like music」，比 love 語氣輕一點' },
      { hanzi: 'Work',       tailo: 'WURK',         meaning: '工作',   usage: '說「I\'m at work」告訴別人你在忙，或「It works!」表示成功' },
      { hanzi: 'School',     tailo: 'SKOOL',        meaning: '學校',   usage: '介紹自己說「I go to school」或「I\'m still in school」' },
      { hanzi: 'Home',       tailo: 'HOHM',         meaning: '家',     usage: '到家說「I\'m home!」，想回家說「I want to go home」' },
      { hanzi: 'Friend',     tailo: 'FREND',        meaning: '朋友',   usage: '介紹朋友說「This is my friend」' },
      { hanzi: 'Family',     tailo: 'FAM-ih-lee',   meaning: '家人',   usage: '關心說「How is your family?」，介紹「This is my family」' },
      { hanzi: 'Money',      tailo: 'MUN-ee',       meaning: '錢',     usage: '購物問「Do you have money?」或抱怨「I have no money」' },
      { hanzi: 'Time',       tailo: 'TYM',          meaning: '時間',   usage: '問時間說「What time is it?」，或說「I have no time」' },
      { hanzi: 'Today',      tailo: 'tuh-DAY',      meaning: '今天',   usage: '安排說「Let\'s meet today」，或問「What day is today?」' },
      { hanzi: 'Tomorrow',   tailo: 'tuh-MOR-oh',   meaning: '明天',   usage: '約人說「See you tomorrow!」，或「I\'ll do it tomorrow」' },
      { hanzi: 'Yesterday',  tailo: 'YES-ter-day',  meaning: '昨天',   usage: '聊天說「I was tired yesterday」，分享昨天發生的事' },
      { hanzi: 'Morning',    tailo: 'MOR-ning',     meaning: '早上',   usage: '早上打招呼說「Good morning!」，非常日常' },
      { hanzi: 'Night',      tailo: 'NYT',          meaning: '夜晚',   usage: '道晚安說「Good night!」，或說「I work at night」' },
      { hanzi: 'Sun',        tailo: 'SUN',          meaning: '太陽',   usage: '說「The sun is shining today」讚美好天氣' },
      { hanzi: 'Moon',       tailo: 'MOON',         meaning: '月亮',   usage: '賞月說「Look at the moon!」，或「The moon is beautiful」' },
      { hanzi: 'Star',       tailo: 'STAR',         meaning: '星星',   usage: '說「I can see the stars tonight」，也可指明星 star' },
      { hanzi: 'Rain',       tailo: 'RAYN',         meaning: '雨',     usage: '描述天氣說「It\'s raining」，帶傘說「It might rain」' },
      { hanzi: 'Wind',       tailo: 'WIND',         meaning: '風',     usage: '說「It\'s windy today」，或「The wind is strong」' },
      { hanzi: 'Book',       tailo: 'BOOK',         meaning: '書',     usage: '推薦書說「This is a good book」，也可當動詞「book a seat」訂位' },
      { hanzi: 'Music',      tailo: 'MYOO-zik',     meaning: '音樂',   usage: '問喜好說「Do you like music?」，是很好的開話題方式' },
      { hanzi: 'Cat',        tailo: 'KAT',          meaning: '貓',     usage: '介紹寵物說「I have a cat」，或說「I love cats」' },
      { hanzi: 'Dog',        tailo: 'DAWG',         meaning: '狗',     usage: '問別人「Is that your dog?」，很容易引起話題' },
      { hanzi: 'Bird',       tailo: 'BURD',         meaning: '鳥',     usage: '看到鳥說「Look at that bird!」，早起說「early bird」' },
      { hanzi: 'Tree',       tailo: 'TREE',         meaning: '樹',     usage: '描述環境說「There are many trees here」' },
      { hanzi: 'Flower',     tailo: 'FLOW-er',      meaning: '花',     usage: '送花說「These flowers are for you」，稱讚說「beautiful flowers」' },
      { hanzi: 'Road',       tailo: 'ROHD',         meaning: '路',     usage: '問路說「Which road do I take?」，或「This road is long」' },
      { hanzi: 'Car',        tailo: 'KAR',          meaning: '車',     usage: '說「I came by car」告知交通方式，或「Can you drive a car?」' },
      { hanzi: 'Phone',      tailo: 'FOHN',         meaning: '電話',   usage: '留聯絡方式說「Call me on my phone」，或「My phone is dead」' },
      { hanzi: 'Smile',      tailo: 'SMYL',         meaning: '微笑',   usage: '拍照說「Smile!」，稱讚說「You have a beautiful smile」' },
      { hanzi: 'Laugh',      tailo: 'LAF',          meaning: '笑',     usage: '說「That makes me laugh」，或「Don\'t laugh at me」' },
      { hanzi: 'Cry',        tailo: 'KRY',          meaning: '哭',     usage: '安慰人說「Don\'t cry」，或「I cried watching that movie」' },
      { hanzi: 'Dream',      tailo: 'DREEM',        meaning: '夢',     usage: '分享說「I had a strange dream」，也指夢想「Follow your dream」' },
      { hanzi: 'Heart',      tailo: 'HART',         meaning: '心',     usage: '表達感動說「My heart is full」，或「You broke my heart」' },
      { hanzi: 'Sing',       tailo: 'SING',         meaning: '唱歌',   usage: '說「I love to sing」，邀請說「Sing a song for me!」' },
    ],
  },
  japanese: {
    zh: { title: '日文小教室', subtitle: '每日一詞・跟著比卡學日文' },
    en: { title: 'Japanese Classroom', subtitle: 'One word a day · Learn Japanese with Bika' },
    type: 'vocabulary',
    wordBank: [
      { hanzi: 'ありがとう', tailo: 'Arigatou',                  meaning: '謝謝',   usage: '收到幫助或東西時馬上說，加「ございます」更正式' },
      { hanzi: 'こんにちは', tailo: 'Konnichiwa',                meaning: '你好',   usage: '上午10點到傍晚5點的打招呼，最通用的問候語' },
      { hanzi: 'さようなら', tailo: 'Sayounara',                 meaning: '再見',   usage: '比較正式、長時間不見時的道別，短暫分別說「またね」更自然' },
      { hanzi: 'すみません', tailo: 'Sumimasen',                 meaning: '不好意思', usage: '叫服務生、問路、打擾別人都可以用，是超萬用的一句' },
      { hanzi: 'はい',       tailo: 'Hai',                       meaning: '是',     usage: '回答問題或表示「我在聽、我懂了」，日常對話很常用' },
      { hanzi: 'いいえ',     tailo: 'Iie',                       meaning: '不是',   usage: '禮貌否定時使用，口語上也常說「いや」或「違います」' },
      { hanzi: '水',         tailo: 'Mizu（みず）',              meaning: '水',     usage: '餐廳點水說「お水をください」，非常實用' },
      { hanzi: '食べる',     tailo: 'Taberu（たべる）',          meaning: '吃',     usage: '問朋友「もう食べた？」（你吃了嗎？）是很日常的關心' },
      { hanzi: '飲む',       tailo: 'Nomu（のむ）',              meaning: '喝',     usage: '問人「何か飲む？」（要喝點什麼嗎？）招待客人時很常用' },
      { hanzi: '寝る',       tailo: 'Neru（ねる）',              meaning: '睡覺',   usage: '道晚安說「もう寝る」（我要去睡了），或「早く寝て」（早點睡）' },
      { hanzi: '見る',       tailo: 'Miru（みる）',              meaning: '看',     usage: '邀朋友說「映画を見る？」（要看電影嗎？）' },
      { hanzi: '聞く',       tailo: 'Kiku（きく）',              meaning: '聽',     usage: '說「音楽を聞く」（聽音樂），也有「詢問」的意思' },
      { hanzi: '話す',       tailo: 'Hanasu（はなす）',          meaning: '說話',   usage: '說「後で話す」（待會再說），或「日本語を話す」（說日文）' },
      { hanzi: '行く',       tailo: 'Iku（いく）',               meaning: '去',     usage: '說「コンビニに行く」（去便利商店），旅行時超好用' },
      { hanzi: '来る',       tailo: 'Kuru（くる）',              meaning: '來',     usage: '邀請說「うちに来て！」（來我家！）或「今来る」（我馬上來）' },
      { hanzi: '帰る',       tailo: 'Kaeru（かえる）',           meaning: '回去',   usage: '下班或離開說「家に帰る」（回家了），很日常的一個詞' },
      { hanzi: '好き',       tailo: 'Suki（すき）',              meaning: '喜歡',   usage: '告白說「あなたが好き」，或說「音楽が好き」表達喜好' },
      { hanzi: '嫌い',       tailo: 'Kirai（きらい）',           meaning: '討厭',   usage: '說「これは嫌い」表示不喜歡，但語氣較強，小心使用' },
      { hanzi: '大きい',     tailo: 'Ookii（おおきい）',         meaning: '大的',   usage: '說「このかばんは大きい」（這個包包很大），形容尺寸' },
      { hanzi: '小さい',     tailo: 'Chiisai（ちいさい）',       meaning: '小的',   usage: '試衣服說「この服は小さい」（這件衣服太小了）' },
      { hanzi: '新しい',     tailo: 'Atarashii（あたらしい）',   meaning: '新的',   usage: '分享說「新しいスマホ買った！」（買了新手機！）' },
      { hanzi: '古い',       tailo: 'Furui（ふるい）',           meaning: '舊的',   usage: '說「この車は古い」（這台車很舊），也可指老舊的建築' },
      { hanzi: '高い',       tailo: 'Takai（たかい）',           meaning: '高的',   usage: '抱怨物價說「これは高い！」（這個好貴！），也指高度' },
      { hanzi: '安い',       tailo: 'Yasui（やすい）',           meaning: '便宜的', usage: '讚美說「これは安い！」（這個好便宜！），逛街超常用' },
      { hanzi: '美しい',     tailo: 'Utsukushii（うつくしい）',  meaning: '美麗的', usage: '稱讚風景或人說「美しい！」，比 きれい 更有詩意' },
      { hanzi: 'かわいい',   tailo: 'Kawaii',                    meaning: '可愛的', usage: '看到可愛的東西或人就說「かわいい！」，日本人超愛用' },
      { hanzi: '太陽',       tailo: 'Taiyou（たいよう）',        meaning: '太陽',   usage: '說「太陽が眩しい」（太陽好刺眼），或「太陽が出てる」（出太陽了）' },
      { hanzi: '月',         tailo: 'Tsuki（つき）',             meaning: '月亮',   usage: '賞月說「月がきれい」（月亮好漂亮），中秋節聊天很好用' },
      { hanzi: '星',         tailo: 'Hoshi（ほし）',             meaning: '星星',   usage: '說「星がきれい」（星星好漂亮），也可稱呼偶像為「星」' },
      { hanzi: '空',         tailo: 'Sora（そら）',              meaning: '天空',   usage: '說「空が青い」（天空好藍），也是日本人很喜歡的名字' },
      { hanzi: '海',         tailo: 'Umi（うみ）',               meaning: '海',     usage: '約人說「海に行きたい」（我想去海邊），夏天超常聽到' },
      { hanzi: '山',         tailo: 'Yama（やま）',              meaning: '山',     usage: '說「山に登りたい」（我想爬山），日本有很多登山文化' },
      { hanzi: '花',         tailo: 'Hana（はな）',              meaning: '花',     usage: '賞櫻說「花見をしよう」（去賞花吧），是日本重要文化' },
      { hanzi: '木',         tailo: 'Ki（き）',                  meaning: '樹木',   usage: '說「木の下で休む」（在樹下休息），或形容木製品' },
      { hanzi: '猫',         tailo: 'Neko（ねこ）',              meaning: '貓',     usage: '介紹寵物說「うちの猫」（我的貓），日本超多貓咖啡廳' },
      { hanzi: '犬',         tailo: 'Inu（いぬ）',               meaning: '狗',     usage: '說「犬が好き」（我喜歡狗），或問「犬を飼ってる？」（你養狗嗎？）' },
      { hanzi: '鳥',         tailo: 'Tori（とり）',              meaning: '鳥',     usage: '說「鳥の声が聞こえる」（聽到鳥叫聲），早晨散步時很應景' },
      { hanzi: '魚',         tailo: 'Sakana（さかな）',          meaning: '魚',     usage: '點餐說「魚が食べたい」（我想吃魚），日本料理常用' },
      { hanzi: 'ご飯',       tailo: 'Gohan（ごはん）',           meaning: '飯',     usage: '問「ご飯食べた？」是日本最日常的打招呼，相當於「吃飽了嗎？」' },
      { hanzi: 'お茶',       tailo: 'Ocha（おちゃ）',            meaning: '茶',     usage: '招待客人說「お茶はいかがですか？」（要喝茶嗎？），很有禮貌' },
      { hanzi: '友達',       tailo: 'Tomodachi（ともだち）',     meaning: '朋友',   usage: '介紹說「友達を紹介する」，或「友達と遊ぶ」（和朋友玩）' },
      { hanzi: '家族',       tailo: 'Kazoku（かぞく）',          meaning: '家人',   usage: '說「家族と旅行する」（和家人旅行），或問「家族は元気？」' },
      { hanzi: '学校',       tailo: 'Gakkou（がっこう）',        meaning: '學校',   usage: '說「学校が楽しい」（學校很有趣），或「学校に行く」（去上學）' },
      { hanzi: '仕事',       tailo: 'Shigoto（しごと）',         meaning: '工作',   usage: '問「仕事はどう？」（工作怎麼樣？），很常見的話題' },
      { hanzi: '夢',         tailo: 'Yume（ゆめ）',              meaning: '夢想',   usage: '說「夢があります」（我有夢想），或「夢を叶える」（實現夢想）' },
      { hanzi: '心',         tailo: 'Kokoro（こころ）',          meaning: '心',     usage: '說「心が温かい」（心裡很溫暖），日本歌詞裡超常出現' },
      { hanzi: '愛',         tailo: 'Ai（あい）',                meaning: '愛',     usage: '說「愛してる」（我愛你），語氣很重，日本人平常較少用' },
      { hanzi: '笑顔',       tailo: 'Egao（えがお）',            meaning: '笑臉',   usage: '稱讚說「笑顔がいい」（你的笑容很好看），讓人心情變好' },
      { hanzi: '音楽',       tailo: 'Ongaku（おんがく）',        meaning: '音樂',   usage: '問「音楽を聞く？」（要聽音樂嗎？），很好的話題開場' },
      { hanzi: '絵',         tailo: 'E（え）',                   meaning: '畫',     usage: '稱讚說「この絵は素敵」（這幅畫很棒），參觀美術館時用得到' },
      { hanzi: '旅行',       tailo: 'Ryokou（りょこう）',        meaning: '旅行',   usage: '說「旅行が好き」（我喜歡旅行），或「旅行に行きたい」（想去旅行）' },
      { hanzi: '料理',       tailo: 'Ryouri（りょうり）',        meaning: '料理',   usage: '稱讚說「料理が上手ですね」（你廚藝真好），在日本很加分' },
      { hanzi: '写真',       tailo: 'Shashin（しゃしん）',       meaning: '照片',   usage: '說「写真を撮ろう！」（來拍照吧！），旅遊時超常用' },
      { hanzi: '本',         tailo: 'Hon（ほん）',               meaning: '書',     usage: '推薦說「この本を読んで」（你讀這本書吧），或「本が好き」' },
      { hanzi: '映画',       tailo: 'Eiga（えいが）',            meaning: '電影',   usage: '約人說「映画を見に行こう」（去看電影吧），很好的約會提案' },
      { hanzi: '歌',         tailo: 'Uta（うた）',               meaning: '歌曲',   usage: '說「歌が好き」（我喜歡唱歌），或「この歌いいね」（這首歌很好聽）' },
      { hanzi: '踊る',       tailo: 'Odoru（おどる）',           meaning: '跳舞',   usage: '說「一緒に踊ろう！」（一起跳舞吧！），派對或舞台上常用' },
      { hanzi: '走る',       tailo: 'Hashiru（はしる）',         meaning: '跑步',   usage: '說「毎日走る」（每天跑步），或「急いで走る」（趕快跑）' },
      { hanzi: '笑う',       tailo: 'Warau（わらう）',           meaning: '笑',     usage: '說「笑ってください」（請笑一個），照相前最常聽到' },
      { hanzi: '泣く',       tailo: 'Naku（なく）',              meaning: '哭',     usage: '安慰說「泣かないで」（不要哭），或「映画で泣いた」（看電影哭了）' },
      { hanzi: '空気',       tailo: 'Kuuki（くうき）',           meaning: '空氣',   usage: '說「空気がいい」（空氣很好），或「空気を読む」（看氣氛）是慣用語' },
    ],
  },
  taiwanese: {
    zh: { title: '台語小教室', subtitle: '每日一詞・跟著比卡學台語' },
    en: { title: 'Taiwanese Classroom', subtitle: 'One word a day · Learn Taiwanese with Bika' },
    type: 'vocabulary',
    wordBank: [
      { hanzi: '你好',   tailo: 'Lí hó',        meaning: '你好',   usage: '見到人時打招呼，長輩晚輩都適用，是最基本的問候' },
      { hanzi: '謝謝',   tailo: 'Siā-siā',      meaning: '謝謝',   usage: '收到幫助或好意時說，長輩聽到台語謝謝會特別開心' },
      { hanzi: '日頭',   tailo: 'Ji̍t-thâu',    meaning: '太陽',   usage: '天氣熱說「日頭真大」，跟長輩聊天氣時很好用' },
      { hanzi: '月娘',   tailo: 'Ge̍h-niû',     meaning: '月亮',   usage: '中秋節說「月娘圓圓」，娘字體現台語對月亮的親切感' },
      { hanzi: '雨',     tailo: 'Hōo',          meaning: '雨',     usage: '說「落雨矣」（下雨了），提醒家人帶傘時很自然' },
      { hanzi: '風',     tailo: 'Hong',         meaning: '風',     usage: '說「風真大」描述天氣，或唱台語歌時很常出現' },
      { hanzi: '花',     tailo: 'Hue',          meaning: '花',     usage: '說「花真媠」（花好漂亮），稱讚庭院或市場賣的花' },
      { hanzi: '樹',     tailo: 'Tshiū',        meaning: '樹',     usage: '說「樹仔底下」（樹下），跟阿嬤聊乘涼時很應景' },
      { hanzi: '山',     tailo: 'Suann',        meaning: '山',     usage: '說「爬山」或「山頂」，台灣山多，這個詞很實用' },
      { hanzi: '海',     tailo: 'Hái',          meaning: '海',     usage: '說「去海邊」，夏天跟家人計畫出遊時很常用' },
      { hanzi: '魚',     tailo: 'Hî',           meaning: '魚',     usage: '說「食魚」（吃魚），或傳統市場問阿嬤今天買什麼菜' },
      { hanzi: '鳥',     tailo: 'Tsiáu',        meaning: '鳥',     usage: '說「鳥仔叫」（鳥在叫），早晨聽到鳥叫聲時很貼切' },
      { hanzi: '貓',     tailo: 'Niau',         meaning: '貓',     usage: '說「貓仔」（小貓），台語「Niau」跟日語「Neko」有點像' },
      { hanzi: '狗',     tailo: 'Káu',          meaning: '狗',     usage: '說「狗仔」（小狗），碰到鄰居的狗時很自然就說出來' },
      { hanzi: '飯',     tailo: 'Png',          meaning: '飯',     usage: '說「食飯矣」（吃飯了），是台灣人最日常的一句話' },
      { hanzi: '水',     tailo: 'Tsuí',         meaning: '水',     usage: '說「渴，我要喝水」，或「水真清」（水很清澈）' },
      { hanzi: '火',     tailo: 'Hué',          meaning: '火',     usage: '說「火大」（很生氣），這是台語慣用語，形容憤怒' },
      { hanzi: '天',     tailo: 'Thinn',        meaning: '天空',   usage: '說「天色暗矣」（天色暗了），提醒要回家時很常用' },
      { hanzi: '人',     tailo: 'Lâng',         meaning: '人',     usage: '說「好人」或「壞人」，台語歌詞裡超常出現' },
      { hanzi: '心',     tailo: 'Sim',          meaning: '心',     usage: '說「心肝」（心肝寶貝），是長輩疼愛晚輩的暱稱' },
      { hanzi: '手',     tailo: 'Tshiú',        meaning: '手',     usage: '說「牽手」（牽手、也指配偶），是很溫暖的台語詞' },
      { hanzi: '腳',     tailo: 'Kha',          meaning: '腳',     usage: '說「腳踏實地」（踏實做事），也用在方向「腳手」（快點）' },
      { hanzi: '眼睛',   tailo: 'Ba̍k-tsiu',   meaning: '眼睛',   usage: '說「眼睛金金」（睜大眼睛），提醒要小心注意時用' },
      { hanzi: '耳',     tailo: 'Hīnn',         meaning: '耳朵',   usage: '說「聽無」（聽不懂），或「耳仔好」（耳朵靈敏）' },
      { hanzi: '嘴',     tailo: 'Tshuì',        meaning: '嘴巴',   usage: '說「嘴甜」（嘴甜、很會說好話），稱讚一個人善言' },
      { hanzi: '頭',     tailo: 'Thâu',         meaning: '頭',     usage: '說「頭殼」（腦袋），或「頭家」（老闆），很台味' },
      { hanzi: '好',     tailo: 'Hó',           meaning: '好',     usage: '說「好啊」（好啊）表示同意，或「好勢」（很好、不錯）' },
      { hanzi: '大',     tailo: 'Tuā',          meaning: '大',     usage: '說「大漢」（長大了），長輩看到小孩成長時愛說' },
      { hanzi: '小',     tailo: 'Sè',           meaning: '小',     usage: '說「細漢」（小時候），聊童年回憶時很常用' },
      { hanzi: '新',     tailo: 'Sin',          meaning: '新',     usage: '說「新年快樂」用台語說，節慶時很應景' },
      { hanzi: '紅',     tailo: 'Âng',          meaning: '紅色',   usage: '說「紅包」（紅包），過年發紅包時一定用到' },
      { hanzi: '白',     tailo: 'Pe̍h',         meaning: '白色',   usage: '說「白飯」（白米飯），或描述天色「天白矣」（天亮了）' },
      { hanzi: '黑',     tailo: 'O͘',           meaning: '黑色',   usage: '說「天黑矣」（天黑了），提醒晚回家要注意安全' },
      { hanzi: '青',     tailo: 'Tshenn',       meaning: '綠色',   usage: '說「青菜」（蔬菜），傳統市場買菜時阿嬤都這樣說' },
      { hanzi: '吃',     tailo: 'Tsia̍h',       meaning: '吃',     usage: '說「食飽未？」（吃飽了嗎？），是台灣最溫暖的關心方式' },
      { hanzi: '喝',     tailo: 'Lim',          meaning: '喝',     usage: '說「Lim tê」（喝茶），招待客人時很自然地說出來' },
      { hanzi: '睡',     tailo: 'Khùn',         meaning: '睡覺',   usage: '說「去睏」（去睡覺），長輩叫小孩睡覺時超常說' },
      { hanzi: '走',     tailo: 'Kiânn',        meaning: '走路',   usage: '說「行路」（走路），或「行去」（走去某個地方）' },
      { hanzi: '跑',     tailo: 'Tsáu',         meaning: '跑步',   usage: '說「走啊！」（跑啊！），急著要出發時很常用' },
      { hanzi: '看',     tailo: 'Khuànn',       meaning: '看',     usage: '說「看覓」（看一下），或「看電視」，日常生活超常用' },
      { hanzi: '聽',     tailo: 'Thiann',       meaning: '聽',     usage: '說「聽無」（聽不懂），或「聽講」（聽說），聊八卦時用' },
      { hanzi: '說',     tailo: 'Kóng',         meaning: '說',     usage: '說「講台語」（說台語），鼓勵自己開口說的好方法' },
      { hanzi: '唱',     tailo: 'Tshiùnn',      meaning: '唱歌',   usage: '說「唱歌」，唱台語歌時跟長輩最有共鳴' },
      { hanzi: '笑',     tailo: 'Tshiò',        meaning: '笑',     usage: '說「笑咪咪」（笑嘻嘻），形容人很開朗有笑容' },
      { hanzi: '哭',     tailo: 'Khàu',         meaning: '哭',     usage: '說「哭天喊地」（大哭大鬧），形容非常傷心或誇張' },
      { hanzi: '愛',     tailo: 'Ài',           meaning: '愛',     usage: '說「我愛你」用台語說更有感情，也說「疼」表示疼愛' },
      { hanzi: '朋友',   tailo: 'Pîng-iú',      meaning: '朋友',   usage: '說「好朋友」，或「朋友仔」，比較親密的說法' },
      { hanzi: '家',     tailo: 'Ke',           meaning: '家',     usage: '說「轉來去」（回家了），道別時台灣人很常這樣說' },
      { hanzi: '學校',   tailo: 'Ha̍k-hāu',    meaning: '學校',   usage: '說「去學校」，跟長輩說今天學校發生什麼事' },
      { hanzi: '錢',     tailo: 'Tsînn',        meaning: '錢',     usage: '說「賺錢」（賺錢），或老一輩說「錢有去有來」' },
      { hanzi: '書',     tailo: 'Tsheh',        meaning: '書',     usage: '說「讀冊」（讀書），長輩叮嚀小孩唸書時的說法' },
      { hanzi: '路',     tailo: 'Lōo',          meaning: '路',     usage: '說「行路」（走路），或「路頭」（路口），問路很用得到' },
      { hanzi: '門',     tailo: 'Mn̂g',         meaning: '門',     usage: '說「關門」（關門），或「門口」（門口），家裡很常用' },
      { hanzi: '床',     tailo: 'Tshng',        meaning: '床',     usage: '說「頂眠床」（上床睡覺），叫小孩去睡覺時說' },
      { hanzi: '桌',     tailo: 'Toh',          meaning: '桌子',   usage: '說「桌頂」（桌上），或「飯桌」（餐桌），吃飯時用' },
      { hanzi: '椅',     tailo: 'Í',            meaning: '椅子',   usage: '說「坐椅仔」（坐椅子），招待客人進門時說' },
      { hanzi: '明天',   tailo: 'Bîn-á-tsài',  meaning: '明天',   usage: '說「明仔載見」（明天見），道別時很溫暖的一句話' },
      { hanzi: '今天',   tailo: 'Kin-á-ji̍t',  meaning: '今天',   usage: '說「今仔日」（今天），問今天有什麼行程時用' },
      { hanzi: '昨天',   tailo: 'Tang-á-ji̍t', meaning: '昨天',   usage: '說「昨天發生什麼事」，跟家人聊天時很自然' },
      { hanzi: '星期',   tailo: 'Lé-pài',      meaning: '星期',   usage: '說「禮拜幾」（星期幾），約定時間時很常用' },
      { hanzi: '音樂',   tailo: 'Im-ga̍k',     meaning: '音樂',   usage: '說「聽音樂」，跟長輩分享你喜歡什麼台語歌' },
    ],
  },
};

/* ============================================================
   Modal open / close
   ============================================================ */
const overlay   = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const closeBtn  = document.getElementById('modalClose');

function renderVocabModal(data, lang) {
  const bank = data.wordBank;
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
      <div class="vocab-list">${renderVocabModal(data, lang)}</div>
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
  const data   = MODAL_DATA[currentModalKey];
  const lang   = currentLang === 'zh-TW' ? 'zh' : 'en';
  const title  = lang === 'zh' ? '單字本' : 'Word Bank';
  const sub    = lang === 'zh' ? '已解鎖的單字' : 'Unlocked words';
  const bank   = data.wordBank || [];
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
