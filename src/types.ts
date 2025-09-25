export type Language = 'ja' | 'en';

export interface TranslationRequest {
  text: string;
  from: Language;
  to: Language;
}

export interface TranslationResponse {
  translatedText: string;
}

export interface TranslationHistoryItem {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: Language;
  toLanguage: Language;
  timestamp: number;
}

export interface DetectedLanguage {
  language: Language;
  confidence: number;
}
