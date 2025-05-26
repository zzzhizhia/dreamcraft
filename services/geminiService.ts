
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GameMessage } from '../types';
import { INITIAL_SYSTEM_PROMPT, IMAGE_MODEL_NAME, IMAGE_GENERATION_PROMPT_SUFFIX } from '../constants';

let ai: GoogleGenAI | null = null;
let currentChat: Chat | null = null;

const getApiKey = (): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  console.warn("在 process.env 中未找到 API_KEY。请确保已设置。");
  return undefined;
};


export const initializeChat = async (): Promise<Chat> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY 未配置。请设置 API_KEY 环境变量。");
  }

  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }

  currentChat = ai.chats.create({
    model: 'gemini-2.5-flash-preview-04-17',
    config: {
      systemInstruction: INITIAL_SYSTEM_PROMPT,
      // temperature: 0.7, // Adjust for creativity vs. predictability
    },
  });
  return currentChat;
};

export const sendMessageToAI = async (messageText: string): Promise<GameMessage> => {
  if (!currentChat) {
    console.log("聊天未初始化。正在立即初始化...");
    await initializeChat();
    if (!currentChat) { // Check again after attempting initialization
        throw new Error("聊天初始化失败。无法发送消息。");
    }
  }

  try {
    const response: GenerateContentResponse = await currentChat.sendMessage({ message: messageText });
    const aiText = response.text;

    if (!aiText) {
      // Enhanced logging for empty AI text response
      console.error("AI响应为空或未定义. 完整响应详情:", JSON.stringify(response, null, 2));
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        console.error("候选内容完成原因 (Candidate Finish Reason):", candidate.finishReason);
        if (candidate.safetyRatings) {
          console.error("安全评分 (Safety Ratings):", JSON.stringify(candidate.safetyRatings, null, 2));
        }
      } else {
        console.error("响应中没有候选内容 (No candidates in response).");
      }
      throw new Error("AI返回了空响应。");
    }

    return {
      id: `model-${Date.now()}`,
      role: 'model',
      text: aiText, // Raw text, parsing will be done in App.tsx
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("向AI发送消息时出错：", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("API密钥无效。请检查您的API_KEY环境变量。");
        }
        // Keep the original error message if it's already "AI返回了空响应。"
        if (error.message === "AI返回了空响应。") {
            throw error;
        }
        throw new Error(`AI通信失败：${error.message}`);
    }
    throw new Error("与AI通信时发生未知错误。");
  }
};

export const startInitialConversation = async (): Promise<GameMessage> => {
  if (!currentChat) {
    await initializeChat();
     if (!currentChat) {
        throw new Error("开始对话的聊天初始化失败。");
    }
  }
  // Send a "starter" message to get the AI's initial response (guided by system prompt)
  return sendMessageToAI("你好！让我们开始冒险吧。");
};

export const generateImageForScene = async (sceneDescription: string): Promise<string | null> => {
  if (!ai) {
    console.error("GoogleGenAI 实例未初始化。无法生成图像。");
    // Attempt to initialize if critical, or ensure it's done earlier in app flow
    try {
        await initializeChat(); // This sets up `ai`
        if (!ai) throw new Error("Re-initialization attempt failed.");
    } catch (initError) {
        console.error("尝试重新初始化AI实例失败:", initError);
        return null;
    }
  }

  const prompt = `${sceneDescription}${IMAGE_GENERATION_PROMPT_SUFFIX}`;
  console.log("图像生成提示:", prompt);

  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL_NAME,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.error("AI图像生成响应中未找到图像数据:", response);
      return null;
    }
  } catch (error) {
    console.error("AI图像生成失败:", error);
    return null;
  }
};
