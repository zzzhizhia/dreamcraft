
export interface GameMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  promptPrefix: string;
  placeholder?: string;
}

export interface PlayerStatus {
  location?: string;
  objective?: string;
  inventory?: string[];
  mood?: string; // e.g., alert, tired, hopeful
  // Add other relevant player attributes here
}

export interface GameStateData {
  sceneSummary: string;
  playerStatus: PlayerStatus;
}
