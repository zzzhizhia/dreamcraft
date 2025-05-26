
import React, { useState } from 'react';
import { SendIcon } from '../constants';

interface InitialThemeInputProps {
  onSetTheme: (themeText: string) => void;
  isLoading: boolean;
}

const InitialThemeInput: React.FC<InitialThemeInputProps> = ({ onSetTheme, isLoading }) => {
  const [themeText, setThemeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (themeText.trim() && !isLoading) {
      onSetTheme(themeText.trim());
      // setThemeText(''); // Optionally clear after submit, or let App.tsx manage if it's single-use
    }
  };

  return (
    <div className="pt-4 border-t border-neutral-300">
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <textarea
          value={themeText}
          onChange={(e) => setThemeText(e.target.value)}
          placeholder="请描述您想进行的冒险主题或场景，例如：“太空海盗的宝藏探险”或“魔法森林的奇遇记”..."
          rows={3}
          disabled={isLoading}
          className="flex-grow p-3 rounded-lg bg-white border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-neutral-900 resize-none placeholder-neutral-500 disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !themeText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition-colors duration-150 h-full flex items-center justify-center aspect-square disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="设置主题并开始冒险"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
      <p className="text-xs text-neutral-500 mt-2 text-center">
        输入您想要的冒险主题，AI 将以此为背景开始故事。
      </p>
    </div>
  );
};

export default InitialThemeInput;
