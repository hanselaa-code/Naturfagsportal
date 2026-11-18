export type ModuleId =
  | 'big-bang'
  | 'livets-tre'
  | 'helse-ernering'
  | 'kjemiske-bindinger'
  | 'miljo-klima';

export interface QuizScoreRecord {
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
  subtopicId?: string;
}

export interface ModuleProgress {
  moduleId: ModuleId;
  completedSubchapters: string[];
  totalSubchapters: number;
  quizScores: Record<string, QuizScoreRecord>;
  lastVisitedAt?: string;
}

export type PortalProgressState = Record<ModuleId, ModuleProgress>;

export interface StorageAdapter {
  getProgress(): PortalProgressState;
  saveProgress(state: PortalProgressState): void;
  clearProgress(): void;
}
