import { Language, TranslationRequest, TranslationResponse, DetectedLanguage } from '../types';

// LibreTranslate API endpoint (using public instance)
const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';
const DETECT_API_URL = 'https://libretranslate.com/detect';

export class TranslationService {
  static async translate({ text, from, to }: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(LIBRETRANSLATE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: 'text'
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        translatedText: data.translatedText
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('翻訳に失敗しました。しばらく待ってから再度お試しください。');
    }
  }

  static async detectLanguage(text: string): Promise<DetectedLanguage> {
    try {
      const response = await fetch(DETECT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        }),
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`);
      }

      const data = await response.json();
      const detectedLang = data[0]?.language;
      
      // 日本語または英語に限定
      if (detectedLang === 'ja' || detectedLang === 'en') {
        return {
          language: detectedLang as Language,
          confidence: data[0]?.confidence || 0
        };
      }
      
      // 検出できない場合は英語をデフォルトとする
      return {
        language: 'en',
        confidence: 0.5
      };
    } catch (error) {
      console.error('Language detection error:', error);
      // エラーの場合は英語をデフォルトとする
      return {
        language: 'en',
        confidence: 0.5
      };
    }
  }

  // 簡易的な言語判定（オフライン用フォールバック）
  static detectLanguageOffline(text: string): Language {
    // 日本語の文字（ひらがな、カタカナ、漢字）が含まれているかチェック
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    return japaneseRegex.test(text) ? 'ja' : 'en';
  }
}
