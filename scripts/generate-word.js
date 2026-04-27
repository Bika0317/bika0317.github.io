import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const client = new Anthropic();

const PROMPTS = {
  english: (existing) => `Generate ONE English vocabulary word for Taiwanese learners.
Return ONLY this JSON object (no markdown, no explanation):
{"hanzi":"Word","tailo":"stress-guide","meaning":"中文","usage":"中文使用情境（20-40字）"}

Rules:
- tailo = syllable-stressed pronunciation guide like "HEH-loh" or "THANK-yoo"
- meaning = short Chinese translation (2-6 characters)
- usage = one practical Chinese sentence or situation
- Pick common everyday words useful for beginners
- Do NOT use any of these already-used words: ${existing.map(w => w.hanzi).join(', ')}`,

  japanese: (existing) => `Generate ONE Japanese vocabulary word for Taiwanese learners.
Return ONLY this JSON object (no markdown, no explanation):
{"hanzi":"漢字/かな","tailo":"Romaji（ひらがな）","meaning":"中文","usage":"中文使用情境（20-40字）"}

Rules:
- hanzi = the Japanese word (kanji if applicable, otherwise kana)
- tailo format example: "Arigatou（ありがとう）"
- meaning = concise Chinese translation
- usage = one practical Chinese sentence or situation
- Pick common everyday Japanese words
- Do NOT use any of these already-used words: ${existing.map(w => w.hanzi).join(', ')}`,

  taiwanese: (existing) => `Generate ONE Taiwanese (台語/閩南語) vocabulary word.
Return ONLY this JSON object (no markdown, no explanation):
{"hanzi":"漢字","tailo":"Tâi-lô","meaning":"中文","usage":"中文使用情境（20-40字）"}

Rules:
- hanzi = Chinese character(s) for the Taiwanese word
- tailo = proper Tâi-lô romanization with correct tone marks
- meaning = concise Chinese translation
- usage = one practical Chinese sentence showing when to use it
- Pick common everyday words useful for connecting with elders
- Do NOT use any of these already-used words: ${existing.map(w => w.hanzi).join(', ')}`,
};

async function generateWord(lang, existing) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: PROMPTS[lang](existing) }],
      });
      const text = msg.content[0].text.trim();
      const match = text.match(/\{[\s\S]*?\}/);
      if (!match) throw new Error('No JSON found in response');
      return JSON.parse(match[0]);
    } catch (err) {
      if (attempt === 3) throw err;
      console.warn(`Attempt ${attempt} failed for ${lang}: ${err.message}, retrying...`);
    }
  }
}

const wordsDir = join(process.cwd(), 'assets', 'words');

for (const lang of ['english', 'japanese', 'taiwanese']) {
  const filePath = join(wordsDir, `${lang}.json`);
  const existing = JSON.parse(readFileSync(filePath, 'utf8'));

  try {
    const word = await generateWord(lang, existing);
    existing.push(word);
    writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf8');
    console.log(`✅ ${lang}: added "${word.hanzi}"`);
  } catch (err) {
    console.error(`❌ ${lang}: ${err.message}`);
    process.exit(1);
  }
}
