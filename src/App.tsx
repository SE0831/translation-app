import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, Sun, Moon, Loader2, AlertCircle } from 'lucide-react';
import { Language, TranslationHistoryItem } from './types';
import { useTranslation } from './hooks/useTranslation';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageSelector } from './components/LanguageSelector';
import { TextArea } from './components/TextArea';
import { TranslationHistory } from './components/TranslationHistory';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLanguage, setFromLanguage] = useState<Language>('ja');
  const [toLanguage, setToLanguage] = useState<Language>('en');
  const [copySuccess, setCopySuccess] = useState(false);

  const { translate, detectLanguage, isTranslating, error, clearError } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // 翻訳実行
  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const result = await translate(inputText, fromLanguage, toLanguage);
    if (result) {
      setOutputText(result);
    }
  }, [inputText, fromLanguage, toLanguage, translate]);

  // 言語自動検出と翻訳
  const handleAutoTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const detectedLang = await detectLanguage(inputText);
    const targetLang = detectedLang === 'ja' ? 'en' : 'ja';
    
    setFromLanguage(detectedLang);
    setToLanguage(targetLang);

    const result = await translate(inputText, detectedLang, targetLang);
    if (result) {
      setOutputText(result);
    }
  }, [inputText, detectLanguage, translate]);

  // 言語入れ替え
  const handleSwapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(outputText);
    setOutputText(inputText);
  };

  // コピー成功表示
  const handleCopySuccess = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // 音声読み上げ
  const handleSpeak = (text: string, language: Language) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  // 履歴アイテム選択
  const handleSelectHistoryItem = (item: TranslationHistoryItem) => {
    setInputText(item.originalText);
    setOutputText(item.translatedText);
    setFromLanguage(item.fromLanguage);
    setToLanguage(item.toLanguage);
  };

  // 入力テキスト変更時の処理
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputText.trim()) {
        handleAutoTranslate();
      } else {
        setOutputText('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputText, handleAutoTranslate]);

  // エラー自動クリア
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(clearError, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">翻訳アプリ</h1>
          <div className="flex items-center space-x-4">
            <TranslationHistory onSelectHistoryItem={handleSelectHistoryItem} />
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* コピー成功メッセージ */}
        {copySuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200">クリップボードにコピーしました</p>
          </div>
        )}

        {/* 翻訳エリア */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* 言語選択バー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <LanguageSelector
              language={fromLanguage}
              onChange={setFromLanguage}
              disabled={isTranslating}
            />
            
            <button
              onClick={handleSwapLanguages}
              disabled={isTranslating}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="言語を入れ替え"
            >
              <ArrowLeftRight size={20} />
            </button>
            
            <LanguageSelector
              language={toLanguage}
              onChange={setToLanguage}
              disabled={isTranslating}
            />
          </div>

          {/* テキストエリア */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            {/* 入力エリア */}
            <div className="p-4">
              <TextArea
                value={inputText}
                onChange={setInputText}
                placeholder="翻訳したいテキストを入力してください..."
                showSpeakButton={!!inputText}
                onSpeak={() => handleSpeak(inputText, fromLanguage)}
              />
            </div>

            {/* 出力エリア */}
            <div className="p-4 relative">
              <TextArea
                value={outputText}
                placeholder={isTranslating ? '翻訳中...' : '翻訳結果がここに表示されます'}
                readOnly
                showCopyButton={!!outputText}
                showSpeakButton={!!outputText}
                onCopy={handleCopySuccess}
                onSpeak={() => handleSpeak(outputText, toLanguage)}
              />
              
              {/* 翻訳中インジケーター */}
              {isTranslating && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-700/80 flex items-center justify-center rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <Loader2 size={20} className="animate-spin" />
                    <span>翻訳中...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 使い方 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">使い方</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• テキストを入力すると自動で言語を判定し、翻訳します</li>
            <li>• 言語選択で手動で言語を指定することもできます</li>
            <li>• 中央のボタンで入力と出力の言語を入れ替えできます</li>
            <li>• スピーカーアイコンで音声読み上げができます</li>
            <li>• コピーアイコンで翻訳結果をクリップボードにコピーできます</li>
            <li>• 翻訳履歴は自動で保存され、履歴から再利用できます</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
