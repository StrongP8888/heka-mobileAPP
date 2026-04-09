/**
 * AI Recognition Service
 *
 * Calls /api/recognize serverless function which uses Claude Sonnet 4 Vision.
 * See docs/AI_RECOGNITION_SPEC.md for full spec.
 */

export type RecognitionScene = 'medication' | 'supplement' | 'healthcheck';
export type Confidence = 'high' | 'medium' | 'low';

export interface RecognizedField<T = string> {
  value: T;
  confidence: Confidence;
}

export interface MedicationRecognition {
  recognized: true;
  scene: 'medication';
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
  scene: 'supplement';
  productName: RecognizedField & { zh: string; en: string };
  brand: RecognizedField;
  keyIngredients: { name: string; amount: string; confidence: Confidence }[];
  recommendedDosage: RecognizedField;
  healthClaims: string[];
  overallConfidence: Confidence;
}

export interface HealthCheckRecognition {
  recognized: true;
  scene: 'healthcheck';
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
  scene: RecognitionScene;
  reason: string;
  reason_zh: string;
}

export type RecognitionResult =
  | MedicationRecognition
  | SupplementRecognition
  | HealthCheckRecognition
  | RecognitionFailure;

/**
 * Send image to /api/recognize serverless function for Claude Vision analysis.
 */
export async function recognizeImage(
  imageBase64: string,
  mediaType: string,
  scene: RecognitionScene
): Promise<RecognitionResult> {
  try {
    const res = await fetch('/api/recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mediaType, scene }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        recognized: false,
        scene,
        reason: err.reason || `Server error ${res.status}`,
        reason_zh: err.reason_zh || '辨識服務暫時無法使用，請重試或手動輸入。',
      };
    }

    return await res.json();
  } catch (error) {
    return {
      recognized: false,
      scene,
      reason: 'Network error',
      reason_zh: '網路連線失敗，請檢查網路後重試。',
    };
  }
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
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return { base64, mediaType: 'image/jpeg' };
}
