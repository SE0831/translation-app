import React, { useState, useEffect } from 'react';
import { History, X, Trash2 } from 'lucide-react';
import { TranslationHistoryItem } from '../types';
import { HistoryService } from '../services/historyService';

interface TranslationHistoryProps {
  onSelectHistoryItem: (item: TranslationHistoryItem) => void;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({ onSelectHistoryItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(HistoryService.getHistory());
    }
  }, [isOpen]);

  const handleClearHistory = () => {
    HistoryService.clearHistory();
    setHistory([]);
  };

  const handleRemoveItem = (id: string) => {
    HistoryService.removeFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageName = (lang: string) => {
    return lang === 'ja' ? '日本語' : 'English';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="翻訳履歴"
      >
        <History size={20} />
        <span>履歴</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] m-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">翻訳履歴</h2>
              <div className="flex items-center space-x-2">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="履歴をクリア"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  翻訳履歴はありません
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                      onClick={() => {
                        onSelectHistoryItem(item);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>{getLanguageName(item.fromLanguage)} → {getLanguageName(item.toLanguage)}</span>
                            <span>•</span>
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-900 dark:text-white truncate">
                              {item.originalText}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 truncate">
                              {item.translatedText}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                          title="削除"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
