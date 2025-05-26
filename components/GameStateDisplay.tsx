
import React from 'react';
import { GameStateData } from '../types';
import { SceneIcon, PlayerStatusIcon, LocationIcon, ObjectiveIcon, MoodIcon, InventoryIcon } from '../constants';

interface GameStateDisplayProps {
  gameState: GameStateData | null;
}

const GameStateDisplay: React.FC<GameStateDisplayProps> = ({ gameState }) => {
  if (!gameState) {
    return null;
  }

  const { sceneSummary, playerStatus } = gameState;

  const StatItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
      <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
        <span className="text-indigo-600">{icon}</span>
        <span className="font-semibold text-neutral-700">{label}:</span>
        <span className="text-neutral-600">{value}</span>
      </div>
    );
  };

  return (
    // Removed flex-grow. Relies on parent for positioning and sizing. Added bottom margin.
    <div className="p-3 sm:p-4 my-2 border border-neutral-200 rounded-xl bg-white shadow-md overflow-y-auto space-y-4">
      {/* Scene Section Card */}
      <div className="p-4 border border-neutral-200 rounded-lg bg-slate-50 shadow">
        <div className="flex items-center text-xl font-semibold text-indigo-700 mb-2">
          <SceneIcon className="w-7 h-7 mr-2 text-indigo-600" />
          当前场景
        </div>
        <p className="text-neutral-700 whitespace-pre-wrap text-sm sm:text-base">
          {sceneSummary || "暂无场景描述。"}
        </p>
      </div>

      {/* Player Status Section Card */}
      <div className="p-4 border border-neutral-200 rounded-lg bg-slate-50 shadow">
        <div className="flex items-center text-xl font-semibold text-indigo-700 mb-3">
          <PlayerStatusIcon className="w-7 h-7 mr-2 text-indigo-600" />
          玩家状态
        </div>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <StatItem icon={<LocationIcon />} label="位置" value={playerStatus.location} />
          <StatItem icon={<ObjectiveIcon />} label="目标" value={playerStatus.objective} />
          <StatItem icon={<MoodIcon />} label="心情" value={playerStatus.mood} />

          {playerStatus.inventory && playerStatus.inventory.length > 0 && (
            <div className="p-2 bg-slate-50 rounded-md">
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-indigo-600"><InventoryIcon /></span>
                <span className="font-semibold text-neutral-700">物品栏:</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-1">
                {playerStatus.inventory.map((item, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {!playerStatus.location && !playerStatus.objective && !playerStatus.mood && (!playerStatus.inventory || playerStatus.inventory.length === 0) && (
            <p className="text-neutral-500 italic px-2">暂无具体状态信息。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStateDisplay;
