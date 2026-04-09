import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { metricName, value, unit, normalRange, status, elderAge, relatedMetrics } = req.body;

  if (!metricName || value === undefined) {
    return res.status(400).json({ error: 'Missing metricName or value' });
  }

  const relatedContext = relatedMetrics?.length
    ? `\n\n其他相關指標：\n${relatedMetrics.map((m: any) => `- ${m.name}: ${m.value} ${m.unit} (${m.status === 'normal' ? '正常' : m.status === 'high' ? '偏高' : '偏低'})`).join('\n')}`
    : '';

  const prompt = `你是一位親切的健康教育專家，為台灣的長照 APP 使用者（家人/照服員）解釋健檢數值。

請用繁體中文，以溫暖、易懂的語氣解釋以下健檢指標：

指標名稱：${metricName}
數值：${value} ${unit}
正常範圍：${normalRange.min === 0 ? '<' : normalRange.min + ' —'} ${normalRange.max === 999 ? '>' + normalRange.min : normalRange.max} ${unit}
狀態：${status === 'normal' ? '正常' : status === 'high' ? '偏高' : '偏低'}
長輩年齡：${elderAge || 78} 歲${relatedContext}

請用以下格式回覆（純文字，不要 markdown）：

📖 這是什麼？
（用 2-3 句簡單的話解釋這個指標代表什麼，為什麼重要）

📊 數值解讀
（解釋這個數值在正常/偏高/偏低代表什麼意思，如果偏高或偏低要多說明可能的原因）

💡 日常建議
（給出 2-3 條實際可行的日常建議，適合長輩的飲食/運動/生活習慣建議）

注意：
- 語氣溫暖，像跟家人聊天一樣
- 不要使用太專業的醫學術語
- 如果有相關指標一起偏高/偏低，要整合說明
- 不要做診斷，只做健康知識說明`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return res.status(200).json({ explanation: text });
  } catch (error: any) {
    console.error('Explain metric error:', error?.message || error);
    return res.status(500).json({ error: 'Service temporarily unavailable' });
  }
}
