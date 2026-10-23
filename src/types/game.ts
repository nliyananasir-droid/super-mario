export type CharacterType = 'adam' | 'aisyah';

export interface QuestionOption {
  id: 'A' | 'B';
  label: string;
  isCorrect: boolean;
  illustrationType: 'greet_teacher' | 'ignore_teacher' | 'return_pencil' | 'keep_pencil' | 'share_swing' | 'push_swing' | 'clean_trash' | 'leave_trash' | 'say_thanks' | 'walk_away';
  feedback: string;
}

export interface QuestionData {
  id: number;
  moralValue: string;
  situation: string;
  audioPrompt: string;
  options: [QuestionOption, QuestionOption];
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'grass' | 'wood' | 'stone' | 'cloud' | 'school' | 'market';
}

export interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  moralValue: string;
  theme: 'village' | 'market' | 'playground' | 'school' | 'castle';
  worldWidth: number;
  spawn: { x: number; y: number };
  checkpoint: { x: number; y: number };
  questionBlock: { x: number; y: number; width: number; height: number };
  finishGate: { x: number; y: number; width: number; height: number };
  platforms: Platform[];
  pits: { x: number; width: number }[];
  coins: { id: number; x: number; y: number }[];
  question: QuestionData;
}

export type GameState = 
  | 'CHARACTER_SELECT'
  | 'LEVEL_SELECT'
  | 'PLAYING'
  | 'QUESTION_ACTIVE'
  | 'LEVEL_CLEARED'
  | 'GAME_OVER'
  | 'TREASURE_ROOM';
