import { TranslationHistoryItem, Language } from '../types';

const HISTORY_KEY = 'translation-history';
const MAX_HISTORY_ITEMS = 50;

export class HistoryService {
  static getHistory(): TranslationHistoryItem[] {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  static addToHistory(
    originalText: string,
    translatedText: string,
    fromLanguage: Language,
    toLanguage: Language
  ): void {
    try {
      const history = this.getHistory();
      const newItem: TranslationHistoryItem = {
        id: Date.now().toString(),
        originalText,
        translatedText,
        fromLanguage,
        toLanguage,
        timestamp: Date.now()
      };

      // 重複チェック（同じ原文と翻訳文の組み合わせ）
      const isDuplicate = history.some(
        item => 
          item.originalText === originalText && 
          item.translatedText === translatedText &&
          item.fromLanguage === fromLanguage &&
          item.toLanguage === toLanguage
      );

      if (!isDuplicate) {
        history.unshift(newItem);
        
        // 最大件数を超えた場合は古いものを削除
        if (history.length > MAX_HISTORY_ITEMS) {
          history.splice(MAX_HISTORY_ITEMS);
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  static removeFromHistory(id: string): void {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Failed to remove from history:', error);
    }
  }
}
