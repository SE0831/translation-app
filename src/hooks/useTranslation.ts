import { useState, useCallback } from 'react';
import { Language } from '../types';
import { TranslationService } from '../services/translationService';
import { HistoryService } from '../services/historyService';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    fromLang: Language,
    toLang: Language
  ): Promise<string | null> => {
    if (!text.trim()) return null;

    setIsTranslating(true);
    setError(null);

    try {
      const result = await TranslationService.translate({
        text: text.trim(),
        from: fromLang,
        to: toLang
      });

      // 履歴に追加
      HistoryService.addToHistory(
        text.trim(),
        result.translatedText,
        fromLang,
        toLang
      );

      return result.translatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '翻訳に失敗しました';
      setError(errorMessage);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const detectLanguage = useCallback(async (text: string): Promise<Language> => {
    if (!text.trim()) return 'en';

    try {
      const result = await TranslationService.detectLanguage(text.trim());
      return result.language;
    } catch (error) {
      console.error('Language detection failed:', error);
      // フォールバック: オフライン判定
      return TranslationService.detectLanguageOffline(text);
    }
  }, []);

  return {
    translate,
    detectLanguage,
    isTranslating,
    error,
    clearError: () => setError(null)
  };
};
