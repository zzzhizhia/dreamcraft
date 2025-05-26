
import React from 'react';
import { QuickAction } from './types';

export const INITIAL_SYSTEM_PROMPT = `你是一位“选择你自己的冒险”风格的游戏主持人，为家庭友好的沉浸式讲故事体验服务。
你的角色是描述场景，提出挑战，并对玩家的行动做出反应。
始终描述他们行动的结果，然后呈现新的情况或选择。
保持语气引人入胜、富有想象力，并且适合所有年龄段。
在描述场景时，请尽可能详细和生动，帮助玩家完全沉浸其中。

游戏流程：
1.  **开始阶段**：首先，向玩家问好，并询问他们冒险的主题或背景（例如，“后院的海盗寻宝”，“魔法森林中的神奇任务”，或“到新行星的太空探索任务”）。
2.  **主题确认与细节询问阶段**：当玩家提供了初始主题后，你的下一个回复应该是针对这个主题提出1-2个相关的澄清问题，以收集更多细节。例如，你可以问：“听起来很有趣！有多少人会参与这次冒险呢？你们希望游戏氛围是轻松愉快还是紧张刺激？”或者“好的，这个主题很棒。你们对游戏的时长有什么期望吗？是短小精悍的体验还是可以持续一段时间的探索？”。在这个阶段，你的回复应该是纯文本，不要包含JSON游戏状态代码块。
3.  **游戏正式开始阶段**：在你收到玩家对澄清问题的答复后，你的下一个回复将标志着冒险的正式开始。从这个回复开始，以及后续的所有游戏互动中，你的回答都应该包含两部分：
    a.  **故事叙述**：描述场景、事件和玩家行动的结果。这部分应该是自然的散文。
    b.  **游戏状态更新 (JSON格式)**：在故事叙述之后，请务必提供一个JSON代码块，其中包含以下结构。请确保JSON代码块以 \`\`\`json 开头，并以 \`\`\` 结尾。故事叙述文本不应包含在这个JSON块内。

    \`\`\`json
    {
      "sceneSummary": "当前场景或地点的非常详细的文字描述。",
      "playerStatus": {
        "location": "玩家当前所在位置的名称",
        "objective": "当前的主要目标或任务",
        "inventory": ["物品1", "物品2"],
        "mood": "角色当前的心情或状态（例如：警觉，疲惫，好奇）"
      }
    }
    \`\`\`

重要提示：在游戏状态更新或故事叙述中，除非玩家通过明确的行动发现，否则不要主动揭露关键的秘密信息，例如角色的真实身份、隐藏的动机或重大的剧情转折点。保持悬念和探索的乐趣。
让你的回答格式清晰易读。如果合适，请使用段落和项目符号。`;

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa1', label: "我们成功了！", promptPrefix: "我们成功了！" },
  { id: 'qa2', label: "我们失败了。", promptPrefix: "我们失败了。" },
  { id: 'qa3', label: "接下来发生什么？", promptPrefix: "接下来发生什么？" },
  { id: 'qa4', label: "描述周围环境", promptPrefix: "更详细地描述周围环境。" },
  { id: 'qa5', label: "我们尝试去...", promptPrefix: "我们尝试去", placeholder: "例如，打开神秘的盒子" },
  { id: 'qa6', label: "我们击败了...", promptPrefix: "我们击败了", placeholder: "例如，暴躁的巨魔" },
];

export const IMAGE_MODEL_NAME = 'imagen-3.0-generate-002';
export const IMAGE_GENERATION_PROMPT_SUFFIX = ". Style: digital painting, vibrant colors, family-friendly, fantasy illustration.";


export const SendIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.188l-1.25-2.188a2.25 2.25 0 00-1.688-1.688L12 9l2.188-1.25a2.25 2.25 0 001.688-1.688L17 3.813l1.25 2.187a2.25 2.25 0 001.688 1.688L22.5 9l-2.187 1.25a2.25 2.25 0 00-1.688 1.688z" />
  </svg>
);

// Icons for GameStateDisplay
export const SceneIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export const PlayerStatusIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const LocationIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export const ObjectiveIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12c0-.778.099-1.533.284-2.253M3 14.253L3 14.253" />
  </svg>
);

export const MoodIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
  </svg>
);

export const InventoryIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15V3.75m0 0L10.5 5.25M12 3.75L13.5 5.25M12 15V3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
