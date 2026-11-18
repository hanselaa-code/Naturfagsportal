import { useCallback, useEffect, useState } from 'react';
import {
  createInitialPortalProgress,
  localStorageAdapter,
} from './localStorageAdapter';
import type {
  ModuleId,
  ModuleProgress,
  PortalProgressState,
  StorageAdapter,
} from './types';

const PROGRESS_EVENT = 'naturfag-vg1-progress-updated';

class ProgressService {
  private adapter: StorageAdapter;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  setAdapter(adapter: StorageAdapter) {
    this.adapter = adapter;
    this.notify();
  }

  getAll(): PortalProgressState {
    return this.adapter.getProgress();
  }

  getModule(moduleId: ModuleId): ModuleProgress {
    return this.adapter.getProgress()[moduleId];
  }

  markSubchapterCompleted(moduleId: ModuleId, subchapterId: string) {
    const state = this.adapter.getProgress();
    const current = state[moduleId];
    const completedSet = new Set(current.completedSubchapters);
    completedSet.add(subchapterId);

    const next: PortalProgressState = {
      ...state,
      [moduleId]: {
        ...current,
        completedSubchapters: Array.from(completedSet),
        lastVisitedAt: new Date().toISOString(),
      },
    };
    this.adapter.saveProgress(next);
    this.notify();
  }

  markModuleVisited(moduleId: ModuleId) {
    const state = this.adapter.getProgress();
    const current = state[moduleId];
    const next: PortalProgressState = {
      ...state,
      [moduleId]: {
        ...current,
        lastVisitedAt: new Date().toISOString(),
      },
    };
    this.adapter.saveProgress(next);
    this.notify();
  }

  saveQuizScore(
    moduleId: ModuleId,
    subtopicId: string,
    score: number,
    total: number,
  ) {
    const state = this.adapter.getProgress();
    const current = state[moduleId];
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const prevBest = current.quizScores[subtopicId];

    // Keep best score if already attempted, or update with latest if higher/equal
    const bestScore =
      prevBest && prevBest.percentage > percentage
        ? prevBest
        : {
            score,
            total,
            percentage,
            completedAt: new Date().toISOString(),
            subtopicId,
          };

    const completedSet = new Set(current.completedSubchapters);
    completedSet.add(subtopicId);

    const next: PortalProgressState = {
      ...state,
      [moduleId]: {
        ...current,
        completedSubchapters: Array.from(completedSet),
        quizScores: {
          ...current.quizScores,
          [subtopicId]: bestScore,
        },
        lastVisitedAt: new Date().toISOString(),
      },
    };
    this.adapter.saveProgress(next);
    this.notify();
  }

  resetAll() {
    this.adapter.clearProgress();
    this.adapter.saveProgress(createInitialPortalProgress());
    this.notify();
  }

  private notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
    }
  }
}

export const progressService = new ProgressService(localStorageAdapter);

export function usePortalProgress() {
  const [progress, setProgress] = useState<PortalProgressState>(() =>
    progressService.getAll(),
  );

  useEffect(() => {
    const sync = () => setProgress(progressService.getAll());
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const markSubchapterCompleted = useCallback(
    (moduleId: ModuleId, subchapterId: string) => {
      progressService.markSubchapterCompleted(moduleId, subchapterId);
    },
    [],
  );

  const saveQuizScore = useCallback(
    (moduleId: ModuleId, subtopicId: string, score: number, total: number) => {
      progressService.saveQuizScore(moduleId, subtopicId, score, total);
    },
    [],
  );

  const markModuleVisited = useCallback((moduleId: ModuleId) => {
    progressService.markModuleVisited(moduleId);
  }, []);

  const resetAllProgress = useCallback(() => {
    progressService.resetAll();
  }, []);

  return {
    progress,
    markSubchapterCompleted,
    saveQuizScore,
    markModuleVisited,
    resetAllProgress,
  };
}
