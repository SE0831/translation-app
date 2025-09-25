import React from 'react';
import { Copy, Volume2 } from 'lucide-react';

interface TextAreaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  showCopyButton?: boolean;
  showSpeakButton?: boolean;
  onCopy?: () => void;
  onSpeak?: () => void;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  showCopyButton = false,
  showSpeakButton = false,
  onCopy,
  onSpeak
}) => {
  const handleCopy = async () => {
    if (value && onCopy) {
      try {
        await navigator.clipboard.writeText(value);
        onCopy();
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  };

  const handleSpeak = () => {
    if (value && onSpeak) {
      onSpeak();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
          readOnly ? 'bg-gray-50 dark:bg-gray-800' : ''
        }`}
      />
      
      {(showCopyButton || showSpeakButton) && value && (
        <div className="absolute bottom-3 right-3 flex space-x-2">
          {showSpeakButton && (
            <button
              onClick={handleSpeak}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="音声読み上げ"
            >
              <Volume2 size={16} />
            </button>
          )}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="コピー"
            >
              <Copy size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
