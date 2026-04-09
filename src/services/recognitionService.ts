/**
 * AI Recognition Service — Mock implementation
 *
 * In production, this calls Claude Sonnet 4 Vision API.
 * Currently returns mock results for prototype demonstration.
 *
 * See docs/AI_RECOGNITION_SPEC.md for full spec, prompts, and validation logic.
 */

export type RecognitionScene = 'medication' | 'supplement' | 'healthcheck';
export type Confidence = 'high' | 'medium' | 'low';

export interface RecognizedField<T = string> {
  value: T;
  confidence: Confidence;
}

export interface MedicationRecognition {
  recognized: true;
  type: 'prescription' | 'otc' | 'unknown';
  drugName: RecognizedField & { zh: string; en: string };
  dosage: RecognizedField;
  frequency: RecognizedField;
  indication: RecognizedField | null;
  sideEffects: RecognizedField | null;
  overallConfidence: Confidence;
}

export interface SupplementRecognition {
  recognized: true;
  productName: RecognizedField & { zh: string; en: string };
  brand: RecognizedField;
  keyIngredients: { name: string; amount: string; confidence: Confidence }[];
  recommendedDosage: RecognizedField;
  healthClaims: string[];
  overallConfidence: Confidence;
}

export interface HealthCheckRecognition {
  recognized: true;
  reportDate: string;
  institution: string;
  metrics: {
    category: string;
    name: string;
    value: number;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low';
    confidence: Confidence;
  }[];
  overallConfidence: Confidence;
}

export interface RecognitionFailure {
  recognized: false;
  reason: string;
  reason_zh: string;
}

export type RecognitionResult =
  | (MedicationRecognition & { scene: 'medication' })
  | (SupplementRecognition & { scene: 'supplement' })
  | (HealthCheckRecognition & { scene: 'healthcheck' })
  | (RecognitionFailure & { scene: RecognitionScene });

// === Mock responses ===

const mockMedication: MedicationRecognition & { scene: 'medication' } = {
  scene: 'medication',
  recognized: true,
  type: 'prescription',
  drugName: { zh: '脈優錠 (Norvasc)', en: 'Amlodipine Besylate', value: '脈優錠', confidence: 'high' },
  dosage: { value: '5mg', confidence: 'high' },
  frequency: { value: '每日一次，早餐後', confidence: 'high' },
  indication: { value: '高血壓、冠狀動脈心臟病', confidence: 'medium' },
  sideEffects: { value: '頭痛、水腫、頭暈', confidence: 'low' },
  overallConfidence: 'high',
};

const mockSupplement: SupplementRecognition & { scene: 'supplement' } = {
  scene: 'supplement',
  recognized: true,
  productName: { zh: '挺立鈣強力錠', en: 'Caltrate Plus', value: '挺立鈣強力錠', confidence: 'high' },
  brand: { value: 'Caltrate 挺立', confidence: 'high' },
  keyIngredients: [
    { name: '碳酸鈣', amount: '600mg', confidence: 'high' },
    { name: '維生素D3', amount: '800IU', confidence: 'high' },
    { name: '鎂', amount: '50mg', confidence: 'medium' },
  ],
  recommendedDosage: { value: '每日 1-2 錠，隨餐服用', confidence: 'high' },
  healthClaims: ['骨質保健', '促進鈣吸收', '維持骨骼健康'],
  overallConfidence: 'high',
};

const mockHealthCheck: HealthCheckRecognition & { scene: 'healthcheck' } = {
  scene: 'healthcheck',
  recognized: true,
  reportDate: '2026-04-01',
  institution: '高雄榮民總醫院',
  metrics: [
    { category: '血糖', name: '空腹血糖', value: 105, unit: 'mg/dL', referenceRange: '70-100', status: 'high', confidence: 'high' },
    { category: '血糖', name: '糖化血色素 HbA1c', value: 5.8, unit: '%', referenceRange: '<5.7', status: 'high', confidence: 'high' },
    { category: '膽固醇', name: '總膽固醇', value: 195, unit: 'mg/dL', referenceRange: '<200', status: 'normal', confidence: 'high' },
    { category: '膽固醇', name: 'LDL', value: 118, unit: 'mg/dL', referenceRange: '<130', status: 'normal', confidence: 'medium' },
    { category: '膽固醇', name: 'HDL', value: 55, unit: 'mg/dL', referenceRange: '>40', status: 'normal', confidence: 'high' },
    { category: '肝功能', name: 'GOT (AST)', value: 28, unit: 'U/L', referenceRange: '<40', status: 'normal', confidence: 'high' },
    { category: '肝功能', name: 'GPT (ALT)', value: 22, unit: 'U/L', referenceRange: '<40', status: 'normal', confidence: 'high' },
    { category: '腎功能', name: '肌酸酐', value: 0.9, unit: 'mg/dL', referenceRange: '0.7-1.3', status: 'normal', confidence: 'high' },
    { category: '腎功能', name: 'eGFR', value: 78, unit: 'mL/min', referenceRange: '>60', status: 'normal', confidence: 'medium' },
    { category: '血液', name: '血紅素', value: 12.8, unit: 'g/dL', referenceRange: '12-16', status: 'normal', confidence: 'high' },
  ],
  overallConfidence: 'high',
};

/**
 * Mock recognition — simulates 1.5s API call, returns mock data.
 * Replace with real Claude Vision API call in production.
 */
export async function recognizeImage(
  _imageBase64: string,
  _mediaType: string,
  scene: RecognitionScene
): Promise<RecognitionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (scene) {
        case 'medication':  resolve(mockMedication); break;
        case 'supplement':  resolve(mockSupplement); break;
        case 'healthcheck': resolve(mockHealthCheck); break;
      }
    }, 1500);
  });
}

/**
 * Preprocess image before API call.
 * Resizes to max 2048px, compresses to JPEG 85%.
 */
export async function preprocessImage(file: File): Promise<{ base64: string; mediaType: string }> {
  const img = await createImageBitmap(file);
  const maxDim = 2048;
  let w = img.width;
  let h = img.height;
  if (w > maxDim || h > maxDim) {
    const ratio = Math.min(maxDim / w, maxDim / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
  const buffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return { base64, mediaType: 'image/jpeg' };
}
