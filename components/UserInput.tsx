
import React, { useState } from 'react';
import { QuickAction } from '../types';
import { QUICK_ACTIONS, SendIcon } from '../constants';

interface UserInputProps {
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickActionClick = (action: QuickAction) => {
    setInputText(prev => `${action.promptPrefix}${action.placeholder ? prev.startsWith(action.promptPrefix) ? prev.substring(action.promptPrefix.length) : prev : ''}`.trim());
    const textarea = document.getElementById('userInputArea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(textarea.value.length, textarea.value.length), 0);
    }
  };
  

  return (
    <div className="pt-4 border-t border-neutral-300">
      <div className="mb-3">
        <p className="text-xs text-neutral-600 mb-1 font-medium">快捷操作：</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleQuickActionClick(action)}
              disabled={isLoading}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs sm:text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              title={action.placeholder ? `${action.promptPrefix}${action.placeholder}` : action.promptPrefix}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <textarea
          id="userInputArea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={QUICK_ACTIONS.find(qa => inputText.startsWith(qa.promptPrefix))?.placeholder || "描述你的行动或你说的话..."}
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
          disabled={isLoading || !inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition-colors duration-150 h-full flex items-center justify-center aspect-square disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="发送消息"
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
    </div>
  );
};

export default UserInput;