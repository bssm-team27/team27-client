import type { ReactNode } from 'react';

// Game Types
export type ParticipantType = 'single' | 'double' | 'group';
export type ActivityType = 'swimming' | 'fishing' | 'leisure';
export type GamePhase = 'setup' | 'playing' | 'analysis' | 'finished';

// UI Types
export type PageType = 'main' | 'setup' | 'game' | 'analysis';
export type LoadingType = 'game-creating' | 'scenario-loading' | 'analysis-loading';

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Game Setup Types
export interface GameSetup {
  participants: ParticipantType;
  activity: ActivityType;
}

// Scenario Types
export interface Scenario {
  id: string;
  title: string;
  description: string;
  backgroundImageUrl: string;
  choices: Choice[];
  context: string;
}

export interface Choice {
  id: string;
  text: string;
  consequence?: string;
  safetyRating: number; // 1-5, 5 being safest
  explanation?: string;
}

// Game State Types
export interface GameState {
  gameId: string;
  setup: GameSetup;
  currentScenarioIndex: number;
  scenarios: Scenario[];
  choices: GameChoice[];
  phase: GamePhase;
  isLoading: boolean;
  loadingType?: LoadingType;
}

export interface GameChoice {
  scenarioId: string;
  choiceId: string;
  timestamp: Date;
  safetyRating: number;
}

// Analysis Types
export interface ScenarioFeedback {
  scenarioId: string;
  chosenChoice: Choice;
  optimalChoice: Choice;
  feedback: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface AnalysisData {
  totalScore: number;
  maxScore: number;
  safetyGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  improvements: string[];
  detailedFeedback: ScenarioFeedback[];
  summary: string;
}

// Game Creation Response
export interface GameCreationResponse {
  gameId: string;
  initialScenario: Scenario;
}

// Choice Response
export interface ChoiceResponse {
  feedback: string;
  nextScenario?: Scenario;
  isGameComplete: boolean;
  immediateConsequence: string;
}

// Component Props Types
export interface BackgroundImageProps {
  imageUrl: string;
  altText: string;
  isLoading?: boolean;
}

export interface ScenarioDescriptionProps {
  title: string;
  description: string;
  isVisible: boolean;
}

export interface ChoiceListProps {
  choices: Choice[];
  onChoiceSelect: (choiceId: string) => void;
  disabled?: boolean;
}

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

// Store Types
export interface GameStore {
  // State
  gameState: GameState | null;
  currentPage: PageType;
  error: string | null;

  // Actions
  setCurrentPage: (page: PageType) => void;
  setError: (error: string | null) => void;
  createGame: (setup: GameSetup) => Promise<void>;
  selectChoice: (choiceId: string) => Promise<void>;
  getAnalysis: () => Promise<AnalysisData | null>;
  resetGame: () => void;
}

export interface UIStore {
  // State
  isMenuOpen: boolean;
  notifications: Notification[];

  // Actions
  setMenuOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}