# HEKA AI Recognition System — Technical Specification & Implementation Guide

## Purpose of This Document

This document serves TWO purposes:
1. **For Claude Code** — Implementation instructions for building the recognition features
2. **For the dev team** — Long-term reference for maintaining, optimizing, and debugging the AI recognition pipeline

Keep this file in the project repo at `docs/AI_RECOGNITION_SPEC.md`. Update it whenever prompts, models, or validation logic changes.

---

## System Overview

HEKA's Health tab requires three types of AI image recognition:

| Scene | Input | Output | Validation Source |
|-------|-------|--------|------------------|
| Medication | Photo of drug bag/box | Drug name, dosage, usage, warnings | Taiwan FDA Open Data API |
| Supplement | Photo of supplement packaging | Product name, brand, ingredients, effects | SuppleMate knowledge base + LLM |
| Health Check | Photo of lab report | Metric names + numeric values | Built-in normal range table |

All three use the **same technical pipeline**: Camera/Album → Image → Claude Vision API → Structured JSON → Validation → User Confirmation → Save.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐     ┌──────────────┐
│ Camera/Album │ ──→ │ Image Preprocessing│ ──→ │ Claude Vision │ ──→ │ Post-process │
│              │     │ (resize, compress)│     │ API Call      │     │ + Validation │
└─────────────┘     └──────────────────┘     └───────────────┘     └──────────────┘
                                                                          │
                                                                          ▼
                                                                   ┌──────────────┐
                                                                   │ User Confirm │
                                                                   │ Screen       │
                                                                   └──────────────┘
                                                                          │
                                                                          ▼
                                                                   ┌──────────────┐
                                                                   │ Save to DB   │
                                                                   └──────────────┘
```

### Model Selection

| Model | Use Case | Why |
|-------|----------|-----|
| **Claude Sonnet 4** (`claude-sonnet-4-20250514`) | All three recognition scenes | Best cost/performance ratio for OCR tasks. Vision capable. ~$3/1M input tokens, ~$15/1M output tokens. Sufficient accuracy for printed text on packaging and reports. |
| Claude Opus 4 | Fallback for complex/ambiguous cases | Higher accuracy but 5x cost. Use only when Sonnet confidence is low. |

**Why Claude Vision instead of specialized OCR?**
- Our inputs are **printed packaging and medical reports** (clean text), not handwritten prescriptions or pill imprints
- Claude Vision handles Traditional Chinese + English mixed text natively
- Single API handles all three recognition types — no need to maintain 3 separate ML pipelines
- Structured JSON output via prompt engineering — no post-processing parser needed

**Why NOT specialized pill recognition models (YOLOv5/v8, CNN)?**
- Those are designed for **identifying loose pills by appearance** (shape, color, imprint)
- Our use case is **reading text on packaging** — fundamentally an OCR problem
- Training/maintaining a custom CV model requires labeled data, GPU infra, and ML expertise
- If we need pill-by-appearance recognition in the future, reconsider then

---

## Scene 1: Medication Recognition (藥物辨識)

### Prompt Template

```
PROMPT_MEDICATION_V1 = """
You are a medication information extraction system for a Taiwanese healthcare app.

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
  "type": "prescription" | "otc" | "unknown",
  "drugName": { "zh": "中文藥名", "en": "English name", "confidence": "high" },
  "genericName": { "value": "學名", "confidence": "medium" },
  "dosage": { "value": "劑量", "confidence": "high" },
  "frequency": { "value": "用法用量", "confidence": "high" },
  "indication": { "value": "適應症", "confidence": "medium" },
  "sideEffects": { "value": "副作用/注意事項", "confidence": "low" },
  "manufacturer": { "value": "製造商", "confidence": "medium" },
  "permitNumber": { "value": "許可證字號", "confidence": "high" },
  "overallConfidence": "high" | "medium" | "low",
  "rawTextExtracted": "完整 OCR 原始文字"
}

If the image is NOT a medication package (e.g., a selfie, food, random object), return:
{
  "recognized": false,
  "reason": "This does not appear to be a medication package. Please photograph the front label of the drug bag or box.",
  "reason_zh": "這不像是藥品包裝。請拍攝藥袋或藥盒的正面標籤。"
}
"""
```

### Post-Processing: Taiwan FDA Validation

After Claude returns the drug name, validate against Taiwan FDA Open Data:

```
API Endpoint: https://data.fda.gov.tw/opendata/exportDataList.do?method=openDataApi&InfoId=36
Format: JSON (large file, ~50MB, cache locally)
Fields: 許可證字號, 中文品名, 英文品名, 成分, 劑型, 劑量, 適應症, 製造商
```

**Validation logic:**
1. Search FDA database by drug name (fuzzy match, handle partial names)
2. If found → enrich with official data (適應症, 成分, etc.)
3. If permit number (許可證字號) is visible in image → exact match lookup
4. If NOT found in FDA database → flag as "unverified" but still allow user to add

### Prompt Version History

| Version | Date | Change | Reason | Result |
|---------|------|--------|--------|--------|
| V1 | 2026-04-09 | Initial prompt | — | Baseline |
| V2 | 2026-04-09 | Add translation rule for Japanese/English/non-Chinese products | Users scan Japanese supplements — results need to display in Traditional Chinese | Pending validation |

*Update this table every time you modify the prompt. This is how you track what works.*

---

## Scene 2: Supplement Recognition (保健食品辨識)

### Prompt Template

```
PROMPT_SUPPLEMENT_V1 = """
You are a supplement/health product information extraction system for a Taiwanese healthcare app.

Analyze this image of a supplement or health food product packaging and extract:

Rules:
1. Extract ONLY information visible in the image.
2. If a field is not visible, set it to null.
3. Look for: product name, brand, key ingredients, recommended dosage, health claims.
4. For Taiwanese products, look for: 品名, 品牌, 主要成分, 建議用量, 保健功效, 注意事項, 食品業者登錄字號.
5. Return confidence level for each field.

Return ONLY valid JSON:
{
  "recognized": true,
  "type": "supplement" | "health_food" | "vitamin" | "unknown",
  "productName": { "zh": "中文品名", "en": "English name", "confidence": "high" },
  "brand": { "value": "品牌", "confidence": "high" },
  "keyIngredients": [
    { "name": "成分名稱", "amount": "含量", "confidence": "medium" }
  ],
  "recommendedDosage": { "value": "建議用量", "confidence": "high" },
  "healthClaims": ["功效1", "功效2"],
  "warnings": { "value": "注意事項", "confidence": "medium" },
  "registrationNumber": { "value": "食品業者登錄字號", "confidence": "high" },
  "overallConfidence": "high" | "medium" | "low",
  "rawTextExtracted": "完整 OCR 原始文字"
}

If the image is NOT a supplement package, return:
{
  "recognized": false,
  "reason": "This does not appear to be a supplement product. Please photograph the front or back label of the supplement packaging.",
  "reason_zh": "這不像是保健食品包裝。請拍攝保健食品的正面或背面標籤。"
}
"""
```

### Post-Processing: Knowledge Base Matching

1. Match extracted product name / ingredients against SuppleMate knowledge base
2. If found → enrich with known effects, interactions, dosage guidelines
3. If NOT found → use Claude to generate effects summary based on ingredients (with disclaimer)
4. Run drug interaction check against user's current medication list

### Prompt Version History

| Version | Date | Change | Reason | Result |
|---------|------|--------|--------|--------|
| V1 | 2026-04-09 | Initial prompt | — | Baseline |
| V2 | 2026-04-09 | Add translation rule for Japanese/English/non-Chinese products | Users scan Japanese supplements — results need to display in Traditional Chinese | Pending validation |

---

## Scene 3: Health Check Report Recognition (健檢報告辨識)

### Prompt Template

```
PROMPT_HEALTHCHECK_V1 = """
You are a health check report data extraction system for a Taiwanese healthcare app.

Analyze this image of a health check / lab test report and extract all measurable health metrics.

Rules:
1. Extract ONLY values visible in the report.
2. Each metric must include: item name, value, unit, and reference range if shown.
3. Common items to look for (but not limited to):
   - 血糖 (Glucose): 空腹血糖, 飯後血糖
   - 血壓 (BP): 收縮壓, 舒張壓
   - 血脂 (Lipids): 總膽固醇, HDL, LDL, 三酸甘油酯 (TG)
   - 腎功能: 肌酐酸 (Creatinine), eGFR, BUN
   - 肝功能: GOT (AST), GPT (ALT), r-GT
   - 血液: 血紅素 (Hb), 白血球 (WBC), 血小板 (PLT)
   - 糖尿病: HbA1c (糖化血色素)
   - 尿酸 (Uric Acid)
   - 身體: 體重, 身高, BMI, 腰圍
4. Normalize unit names (e.g., "mg/dl" → "mg/dL")
5. If the report contains a date, extract it.

Return ONLY valid JSON:
{
  "recognized": true,
  "reportDate": "2026-04-09",
  "institution": "醫院/檢驗所名稱",
  "metrics": [
    {
      "category": "血糖",
      "name": "空腹血糖",
      "nameEn": "Fasting Glucose",
      "value": 105,
      "unit": "mg/dL",
      "referenceRange": "70-100",
      "status": "high",
      "confidence": "high"
    }
  ],
  "overallConfidence": "high" | "medium" | "low",
  "rawTextExtracted": "完整 OCR 原始文字"
}

If the image is NOT a health check report, return:
{
  "recognized": false,
  "reason": "This does not appear to be a health check report. Please photograph your lab test results or health examination report.",
  "reason_zh": "這不像是健檢報告。請拍攝您的檢驗報告或健康檢查結果。"
}
"""
```

### Post-Processing: Normal Range Validation

Built-in reference ranges (do NOT rely on Claude for this — hardcode):

```typescript
const NORMAL_RANGES: Record<string, { min: number; max: number; unit: string }> = {
  'fasting_glucose':   { min: 70,   max: 100,  unit: 'mg/dL' },
  'postmeal_glucose':  { min: 0,    max: 140,  unit: 'mg/dL' },
  'systolic_bp':       { min: 90,   max: 120,  unit: 'mmHg' },
  'diastolic_bp':      { min: 60,   max: 80,   unit: 'mmHg' },
  'pulse':             { min: 60,   max: 100,  unit: 'bpm' },
  'total_cholesterol': { min: 0,    max: 200,  unit: 'mg/dL' },
  'hdl':               { min: 40,   max: 999,  unit: 'mg/dL' },  // higher is better
  'ldl':               { min: 0,    max: 130,  unit: 'mg/dL' },
  'triglycerides':     { min: 0,    max: 150,  unit: 'mg/dL' },
  'creatinine':        { min: 0.7,  max: 1.3,  unit: 'mg/dL' },
  'egfr':              { min: 60,   max: 999,  unit: 'mL/min' }, // higher is better
  'got_ast':           { min: 0,    max: 40,   unit: 'U/L' },
  'gpt_alt':           { min: 0,    max: 40,   unit: 'U/L' },
  'hemoglobin':        { min: 12,   max: 16,   unit: 'g/dL' },
  'wbc':               { min: 4,    max: 10,   unit: '10³/μL' },
  'hba1c':             { min: 0,    max: 5.7,  unit: '%' },
  'uric_acid':         { min: 2.5,  max: 7.0,  unit: 'mg/dL' },
  'bmi':               { min: 18.5, max: 24,   unit: 'kg/m²' },
};
```

### Prompt Version History

| Version | Date | Change | Reason | Result |
|---------|------|--------|--------|--------|
| V1 | 2026-04-09 | Initial prompt | — | Baseline |

---

## Implementation for Claude Code

### API Call Pattern (shared across all 3 scenes)

```typescript
// src/services/recognitionService.ts

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

interface RecognitionResult {
  recognized: boolean;
  data?: any;
  reason?: string;
  reason_zh?: string;
}

async function recognizeImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png',
  scene: 'medication' | 'supplement' | 'healthcheck'
): Promise<RecognitionResult> {

  const prompts = {
    medication: PROMPT_MEDICATION_V1,
    supplement: PROMPT_SUPPLEMENT_V1,
    healthcheck: PROMPT_HEALTHCHECK_V1,
  };

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
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: prompts[scene],
          },
        ],
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

    return {
      recognized: parsed.recognized,
      data: parsed.recognized ? parsed : undefined,
      reason: parsed.reason,
      reason_zh: parsed.reason_zh,
    };

  } catch (error) {
    console.error('Recognition API error:', error);
    return {
      recognized: false,
      reason: 'Recognition service temporarily unavailable. Please try again or enter manually.',
      reason_zh: '辨識服務暫時無法使用，請重試或手動輸入。',
    };
  }
}
```

### Image Preprocessing (before API call)

```typescript
async function preprocessImage(file: File): Promise<{ base64: string; mediaType: string }> {
  // 1. Check file type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Unsupported image format. Please use JPEG or PNG.');
  }

  // 2. Resize if too large (max 2048px on longest side, reduce API cost)
  const img = await createImageBitmap(file);
  const maxDim = 2048;
  let width = img.width;
  let height = img.height;

  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // 3. Compress to JPEG at 85% quality
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });

  // 4. Convert to base64
  const buffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

  return { base64, mediaType: 'image/jpeg' };
}
```

### User Confirmation Flow (critical UX)

After recognition, ALWAYS show a confirmation screen:

```
┌─────────────────────────────┐
│  辨識結果                     │
│                              │
│  藥品名稱: 阿斯匹靈 ✅ 高信心  │
│  劑量: 100mg ✅ 高信心         │
│  用法: 每日一次 ⚠️ 中信心      │  ← yellow = user should verify
│  注意事項: (未辨識) ❌          │  ← red = could not read
│                              │
│  [✏️ 修改辨識結果]             │
│  [✅ 確認並加入]               │
│  [📸 重新拍照]                │
└─────────────────────────────┘
```

- High confidence fields: show with green checkmark
- Medium confidence fields: show with yellow warning, editable
- Low confidence / null fields: show with red X, prompt manual input
- ALWAYS allow user to edit any field before saving

---

## Security & Privacy

- API key must be stored server-side, NEVER in client-side code
- For prototype/demo: can use client-side API key temporarily, but flag for production migration
- Health data (medication lists, lab results) must be encrypted at rest
- Images should NOT be stored after recognition — process and discard
- Add disclaimer: "AI 辨識結果僅供參考，請核對後再儲存。用藥相關問題請諮詢醫師或藥師。"

---

## Cost Estimation

| Scene | Avg Image Size | Input Tokens | Output Tokens | Cost per Call |
|-------|---------------|-------------|--------------|---------------|
| Medication | ~500KB | ~1,600 | ~500 | ~$0.012 |
| Supplement | ~500KB | ~1,600 | ~600 | ~$0.014 |
| Health Check | ~800KB | ~2,000 | ~800 | ~$0.018 |

At 100 daily active users × 2 scans/day = ~$1.20-3.60/day. Very manageable.

---

## How to Track & Optimize (For Dev Team)

### 1. Prompt Version Control
Every prompt change gets a row in the "Prompt Version History" table in each scene section above.
Include: what changed, why, and the measured result (accuracy improvement or regression).

### 2. Recognition Accuracy Logging
Log every recognition result to a simple analytics table:

```typescript
interface RecognitionLog {
  id: string;
  timestamp: string;
  scene: 'medication' | 'supplement' | 'healthcheck';
  recognized: boolean;
  overallConfidence: string;
  userEdited: boolean;        // did user modify the result?
  editedFields: string[];     // which fields were corrected?
  promptVersion: string;      // e.g., "MEDICATION_V1"
  modelUsed: string;          // e.g., "claude-sonnet-4-20250514"
  processingTimeMs: number;
}
```

If `userEdited` is frequently `true` for a specific field → the prompt needs improvement for that field.

### 3. Monthly Review Checklist
- [ ] Check recognition accuracy rate (target: >90% for high-confidence fields)
- [ ] Review most frequently user-edited fields → adjust prompt
- [ ] Check API cost trends
- [ ] Test with new drug packages / supplement brands that users reported issues with
- [ ] Update Taiwan FDA database cache (re-download monthly)
- [ ] Check if Anthropic released a better/cheaper model → evaluate switching

### 4. Known Limitations & Future Improvements
- Handwritten prescriptions: Claude Vision struggles with doctor's handwriting. Defer to manual input.
- Blurry/dark photos: Add client-side image quality check before API call (check brightness, blur detection)
- Multi-page reports: Currently handles single image. Future: support PDF upload with multiple pages.
- Drug interaction database: Currently using SuppleMate's data. Future: integrate with Taiwan NHI drug interaction database if available.

---

## File Locations in Codebase

| File | Purpose |
|------|---------|
| `src/services/recognitionService.ts` | Core API call logic |
| `src/services/prompts/medication.ts` | Medication prompt template |
| `src/services/prompts/supplement.ts` | Supplement prompt template |
| `src/services/prompts/healthcheck.ts` | Health check prompt template |
| `src/services/fdaDatabase.ts` | Taiwan FDA data lookup |
| `src/services/normalRanges.ts` | Health check normal range constants |
| `src/components/health/RecognitionConfirm.tsx` | User confirmation UI |
| `src/components/health/CameraCapture.tsx` | Camera/album image capture |
| `docs/AI_RECOGNITION_SPEC.md` | THIS FILE — update when prompts change |
