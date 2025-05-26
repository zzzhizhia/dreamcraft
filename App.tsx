
import React, { useState, useEffect, useCallback } from 'react';
import { GameMessage, GameStateData } from './types';
import { initializeChat, sendMessageToAI, startInitialConversation, generateImageForScene } from './services/geminiService';
import GameDisplay from './components/GameDisplay';
import UserInput from './components/UserInput';
import InitialThemeInput from './components/InitialThemeInput';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import GameStateDisplay from './components/GameStateDisplay';

const App: React.FC = () => {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [currentGameState, setCurrentGameState] = useState<GameStateData | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const [isThemeSet, setIsThemeSet] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false); // New state
  const [isWaitingForAIResponse, setIsWaitingForAIResponse] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);


  const parseAIResponse = (responseText: string): { narrative: string, gameState: GameStateData | null } => {
    const gameStateRegex = /```json\s*([\s\S]*?)\s*```/s;
    const match = responseText.match(gameStateRegex);
    let narrative = responseText;
    let gameState: GameStateData | null = null;

    if (match && match[1]) {
      try {
        let jsonString = match[1].trim();
        jsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // Remove comments
        gameState = JSON.parse(jsonString) as GameStateData;
        narrative = responseText.replace(gameStateRegex, '').trim();
      } catch (e) {
        console.error("AI响应中解析游戏状态JSON失败:", e);
        console.error("原始JSON字符串:", match && match[1] ? match[1].trim() : "N/A");
      }
    }
    return { narrative, gameState };
  };

  const initAdventure = useCallback(async () => {
    setError(null);
    setIsLoadingInitial(true);
    setIsAppReady(false);
    setIsThemeSet(false);
    setIsGameStarted(false); // Reset game started state
    setMessages([]);
    setCurrentGameState(null);
    setBackgroundImageUrl(null);
    try {
      await initializeChat();
      const firstAiMessageRaw = await startInitialConversation();
      setMessages([{ ...firstAiMessageRaw, text: firstAiMessageRaw.text.trim() }]);
      setIsAppReady(true);
    } catch (err) {
      console.error("初始化失败:", err);
      let specificError = "初始化冒险失败。请检查API密钥和网络连接。";
      if (err instanceof Error) {
        if (err.message.includes("API_KEY 未配置") || err.message.includes("API密钥无效")) {
          specificError = err.message;
        } else if (err.message.includes("AI通信失败")) {
          specificError = err.message;
          if (err.message.includes("AI返回了空响应。")) {
            specificError += " 请检查浏览器开发者控制台中的详细日志（特别是 'finishReason' 和 'safetyRatings'），以了解更多信息。";
          }
        }
      }
      setError(specificError);
      setIsAppReady(false);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    initAdventure();
  }, [initAdventure]);

  const generateAndUpdateBackgroundImage = async (sceneSummary: string) => {
    if (!sceneSummary || isGeneratingImage) return;
    setIsGeneratingImage(true);
    console.log("开始为场景生成背景图片:", sceneSummary.substring(0,100) + "...");
    try {
      const imageUrl = await generateImageForScene(sceneSummary);
      if (imageUrl) {
        setBackgroundImageUrl(imageUrl);
        console.log("背景图片已更新。");
      } else {
        console.warn("未能生成场景背景图片。");
      }
    } catch (imgError) {
      console.error("背景图片生成过程中出错:", imgError);
    } finally {
      setIsGeneratingImage(false);
    }
  };


  const processAndSetAIResponse = (aiResponseText: string) => {
    const { narrative, gameState } = parseAIResponse(aiResponseText);

    const aiMessage: GameMessage = {
      id: `model-${Date.now()}`,
      role: 'model',
      text: narrative,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    if (gameState) {
      setCurrentGameState(gameState);
      setIsGameStarted(true); // Game officially starts when first game state is received
      if (gameState.sceneSummary) {
        void generateAndUpdateBackgroundImage(gameState.sceneSummary);
      }
    } else if (isThemeSet && !isGameStarted) {
      // This is likely the AI asking clarifying questions, no game state expected yet.
      console.log("AI回复了澄清问题或叙述，游戏尚未正式开始。");
    } else if (isGameStarted) {
      // Game has started, but current response didn't include game state
      console.warn("AI响应中未找到或解析游戏状态失败，但游戏已开始。");
      // setCurrentGameState(null); // Optional: clear or retain previous state based on desired behavior
    }
  };

  const handleSetTheme = async (themeText: string) => {
    if (!themeText.trim()) return;

    const userMessage: GameMessage = {
      id: `user-theme-${Date.now()}`,
      role: 'user',
      text: themeText,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsWaitingForAIResponse(true);
    setCurrentGameState(null); 
    setIsGameStarted(false); // Reset game started state for new theme clarification
    setError(null);
    setBackgroundImageUrl(null); 

    try {
      // The AI is expected to ask clarifying questions after this first message about the theme.
      const aiResponseMessage = await sendMessageToAI(`冒险主题是：${themeText}`);
      processAndSetAIResponse(aiResponseMessage.text);
      setIsThemeSet(true); // Theme is set, AI is now in clarification phase
    } catch (err) {
      console.error("设置主题时出错:", err);
      let errorMessage = err instanceof Error ? err.message : "设置主题时发生了意外错误。";
      if (errorMessage.includes("AI返回了空响应。")) {
        errorMessage += " 请检查浏览器开发者控制台中的详细日志（特别是 'finishReason' 和 'safetyRatings'），以了解更多信息。";
      }
      setError(errorMessage);
      setIsThemeSet(false); // Theme setting failed
    } finally {
      setIsWaitingForAIResponse(false);
    }
  };

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: GameMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsWaitingForAIResponse(true);
    setError(null);

    try {
      // This message could be an answer to AI's question, or a regular game action.
      const aiResponseMessage = await sendMessageToAI(prompt);
      processAndSetAIResponse(aiResponseMessage.text);
    } catch (err) {
      console.error("发送消息或接收AI响应时出错：", err);
      let errorMessage = err instanceof Error ? err.message : "发生了意外错误。";
      if (errorMessage.includes("AI返回了空响应。")) {
        errorMessage += " 请检查浏览器开发者控制台中的详细日志（特别是 'finishReason' 和 'safetyRatings'），以了解更多信息。";
      }
      setError(errorMessage);
    } finally {
      setIsWaitingForAIResponse(false);
    }
  };

  const renderGameStateArea = () => {
    if (!isAppReady || isLoadingInitial) { 
        return null;
    }
    
    // Before game starts (AI is asking questions or user hasn't answered yet)
    if (isThemeSet && !isGameStarted && !isWaitingForAIResponse) {
      return (
        <div className="flex items-center justify-center h-24 my-2 text-center text-neutral-500 italic p-4">
          冒险细节确认后，游戏场景和状态将在此处显示...
        </div>
      );
    }
    
    // Waiting for AI response during theme setting or clarification
    if (isWaitingForAIResponse && ((!isThemeSet && !isGameStarted) || (isThemeSet && !isGameStarted && !currentGameState ))) {
      return <LoadingSpinner />;
    }
    
    // Game has started and current game state is available
    if (isGameStarted && currentGameState) {
      return <GameStateDisplay gameState={currentGameState} />;
    }

    // Game has started, but no current game state (e.g., parsing error or AI didn't provide it)
    if (isGameStarted && !isWaitingForAIResponse && !currentGameState) {
      return (
        <div className="text-center text-neutral-500 italic p-4 my-2 border border-neutral-200 rounded-xl bg-white shadow-md">
          未能加载或解析游戏场景信息。AI可能没有按预期格式提供数据。
        </div>
      );
    }

     // Default placeholder when theme is not yet set
    if (!isThemeSet && !isWaitingForAIResponse) {
      return (
        <div className="flex items-center justify-center h-24 my-2 text-center text-neutral-500 italic p-4">
          设定主题后，AI会与您确认一些细节，然后游戏场景和状态将在此处显示...
        </div>
      );
    }

    return null;
  };

  const renderMainInteractionArea = () => {
    if (isLoadingInitial && !error) {
      return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    if (error && !isAppReady) { 
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full">
          <ErrorMessage message={error} />
          {(error.toLowerCase().includes("api") || error.toLowerCase().includes("密钥") || error.toLowerCase().includes("初始化")) && (
            <button
              onClick={initAdventure}
              disabled={isLoadingInitial || isWaitingForAIResponse}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-neutral-800 font-semibold py-2 px-4 rounded-md transition-colors duration-150 disabled:opacity-50"
            >
              重试初始化
            </button>
          )}
        </div>
      );
    }
    
    if (!isAppReady && !isLoadingInitial && !error) { 
        return (
            <div className="text-center p-4 flex flex-col items-center justify-center h-full">
                <p className="text-neutral-600 mb-4">未能加载冒险。请重试。</p>
                <button
                    onClick={initAdventure}
                    disabled={isLoadingInitial || isWaitingForAIResponse}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 disabled:opacity-50"
                >
                    开始新的冒险
                </button>
            </div>
        );
    }
    
    if (!isAppReady) return null; 

    return (
      <>
        <div className="flex-grow overflow-y-auto min-h-0"> {/* Chat display area */}
          <GameDisplay messages={messages} />
        </div>
        
        {error && (isThemeSet || isGameStarted) && ( 
          <div className="my-2 px-1 flex-shrink-0">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="pt-4 border-t border-neutral-300 flex-shrink-0"> {/* Input section */}
          {!isThemeSet ? (
            <InitialThemeInput onSetTheme={handleSetTheme} isLoading={isWaitingForAIResponse} />
          ) : (
            <UserInput onSendMessage={handleSendMessage} isLoading={isWaitingForAIResponse} />
          )}
        </div>
      </>
    );
  };
  
  const appStyle: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    transition: 'background-image 0.5s ease-in-out',
  };
  if (backgroundImageUrl) {
    appStyle.backgroundImage = `url(${backgroundImageUrl})`;
  }


  return (
    <div 
      className="min-h-screen bg-neutral-50 flex flex-col items-center p-2 sm:p-4"
      style={appStyle}
    >
      <Header />
      
      <div className="w-full max-w-3xl mx-auto flex-grow overflow-y-auto">
        {renderGameStateArea()}
      </div>

      <main className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-4 sm:p-6 flex flex-col border border-neutral-200 mt-2 mb-2 h-[28vh] overflow-hidden">
        {renderMainInteractionArea()}
      </main>

      <footer className="text-center text-xs text-neutral-500 py-3 sm:py-4 flex-shrink-0">
        由 Gemini AI 驱动。为家庭娱乐和创意讲故事而设计。
      </footer>
    </div>
  );
};

export default App;
