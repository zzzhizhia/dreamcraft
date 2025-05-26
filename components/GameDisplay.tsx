
import React, { useEffect, useRef } from 'react';
import { GameMessage } from '../types';

interface GameDisplayProps {
  messages: GameMessage[];
}

const GameDisplay: React.FC<GameDisplayProps> = ({ messages }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // If new messages are added and container is already scrolled near bottom, auto-scroll.
  // Otherwise, user might be reading history, so don't auto-scroll.
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 30; // 30px threshold
      if (isScrolledToBottom || messages.length <=2) { // Auto-scroll if at bottom or very few messages
        scrollToBottom();
      }
    }
  }, [messages]);


  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    // Removed flex-grow, ensure it takes the height given by parent
    <div ref={containerRef} className="h-full overflow-y-auto mb-2 space-y-4 p-4 rounded-lg bg-neutral-100 shadow-inner">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col ${
            msg.role === 'user' ? 'items-end' : 'items-start'
          }`}
        >
          <div
            className={`p-3 rounded-xl shadow-md max-w-lg break-words
              ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-neutral-200 text-neutral-800 rounded-bl-none'
              }
            `}
          >
            <p className="text-sm whitespace-pre-wrap">{renderTextWithLineBreaks(msg.text)}</p>
          </div>
          <span className={`text-xs mt-1 ${msg.role === 'user' ? 'mr-1 text-neutral-500' : 'ml-1 text-neutral-500'}`}>
            {msg.role === 'model' ? 'AI故事讲述者' : '你'} - {formatTimestamp(msg.timestamp)}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default GameDisplay;
