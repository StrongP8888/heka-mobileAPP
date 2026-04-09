import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROMPTS: Record<string, string> = {
  medication: `You are a medication information extraction system for a Taiwanese healthcare app.

Analyze this image of a medication package/bag and extract the following information in JSON format.

Rules:
1. Extract ONLY information visible in the image. Do NOT guess or infer.
2. If a field is not visible, set it to null.
3. Drug names should include both Chinese and English names if visible.
4. Dosage should include the number and unit (e.g., "500mg", "5ml").
5. For Taiwanese drug bags (藥袋), look for: 藥品名稱, 劑量, 用法用量, 注意事項, 適應症, 副作用.
6. Return confidence level (high/medium/low) for each field.

Return ONLY valid JSON, no other text:
{
  "recognized": true,
  "scene": "medication",
  "type": "prescription" or "otc" or "unknown",
  "drugName": { "zh": "中文藥名", "en": "English name", "value": "中文藥名", "confidence": "high" },
  "dosage": { "value": "劑量", "confidence": "high" },
  "frequency": { "value": "用法用量", "confidence": "high" },
  "indication": { "value": "適應症", "confidence": "medium" },
  "sideEffects": { "value": "副作用/注意事項", "confidence": "low" },
  "overallConfidence": "high" or "medium" or "low"
}

If the image is NOT a medication package, return:
{ "recognized": false, "scene": "medication", "reason": "Not a medication package", "reason_zh": "這不像是藥品包裝。請拍攝藥袋或藥盒的正面標籤。" }`,

  supplement: `You are a supplement/health product information extraction system for a Taiwanese healthcare app.

Analyze this image of a supplement or health food product packaging and extract:

Rules:
1. Extract ONLY information visible in the image.
2. If a field is not visible, set it to null.
3. Look for: product name, brand, key ingredients, recommended dosage, health claims.
4. For Taiwanese products, look for: 品名, 品牌, 主要成分, 建議用量, 保健功效.
5. Return confidence level for each field.

Return ONLY valid JSON:
{
  "recognized": true,
  "scene": "supplement",
  "productName": { "zh": "中文品名", "en": "English name", "value": "中文品名", "confidence": "high" },
  "brand": { "value": "品牌", "confidence": "high" },
  "keyIngredients": [
    { "name": "成分名稱", "amount": "含量", "confidence": "medium" }
  ],
  "recommendedDosage": { "value": "建議用量", "confidence": "high" },
  "healthClaims": ["功效1", "功效2"],
  "overallConfidence": "high" or "medium" or "low"
}

If the image is NOT a supplement package, return:
{ "recognized": false, "scene": "supplement", "reason": "Not a supplement", "reason_zh": "這不像是保健食品包裝。請拍攝保健食品的正面或背面標籤。" }`,

  healthcheck: `You are a health check report data extraction system for a Taiwanese healthcare app.

Analyze this image of a health check / lab test report and extract all measurable health metrics.

Rules:
1. Extract ONLY values visible in the report.
2. Each metric must include: item name, value, unit, and reference range if shown.
3. Common items: 血糖(Glucose), 血壓(BP), 血脂(Lipids: 總膽固醇,HDL,LDL,三酸甘油酯), 腎功能(Creatinine,eGFR), 肝功能(GOT/AST,GPT/ALT), 血液(血紅素,白血球), HbA1c, 尿酸, BMI.
4. Normalize units (e.g., "mg/dl" → "mg/dL").
5. Determine status: "normal", "high", or "low" based on standard medical reference ranges.

Return ONLY valid JSON:
{
  "recognized": true,
  "scene": "healthcheck",
  "reportDate": "YYYY-MM-DD or null",
  "institution": "醫院名稱 or null",
  "metrics": [
    {
      "category": "血糖",
      "name": "空腹血糖",
      "value": 105,
      "unit": "mg/dL",
      "referenceRange": "70-100",
      "status": "high",
      "confidence": "high"
    }
  ],
  "overallConfidence": "high" or "medium" or "low"
}

If the image is NOT a health check report, return:
{ "recognized": false, "scene": "healthcheck", "reason": "Not a health report", "reason_zh": "這不像是健檢報告。請拍攝您的檢驗報告或健康檢查結果。" }`,
};

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mediaType, scene } = req.body;

  if (!imageBase64 || !scene || !PROMPTS[scene]) {
    return res.status(400).json({ error: 'Missing imageBase64, mediaType, or valid scene' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType || 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: PROMPTS[scene],
          },
        ],
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Recognition API error:', error?.message || error);
    return res.status(500).json({
      recognized: false,
      scene,
      reason: 'Recognition service error',
      reason_zh: '辨識服務暫時無法使用，請重試或手動輸入。',
    });
  }
}
