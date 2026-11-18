import type { ModuleId, PortalProgressState, StorageAdapter } from './types';

const STORAGE_KEY = 'naturfag_vg1_progress_v1';

export const DEFAULT_MODULE_TOTALS: Record<ModuleId, number> = {
  'big-bang': 6,
  'kjemiske-bindinger': 5,
  'miljo-klima': 5,
  'helse-ernering': 7,
  'livets-tre': 7,
};

export function createInitialPortalProgress(): PortalProgressState {
  return {
    'big-bang': {
      moduleId: 'big-bang',
      completedSubchapters: [],
      totalSubchapters: DEFAULT_MODULE_TOTALS['big-bang'],
      quizScores: {},
    },
    'kjemiske-bindinger': {
      moduleId: 'kjemiske-bindinger',
      completedSubchapters: [],
      totalSubchapters: DEFAULT_MODULE_TOTALS['kjemiske-bindinger'],
      quizScores: {},
    },
    'miljo-klima': {
      moduleId: 'miljo-klima',
      completedSubchapters: [],
      totalSubchapters: DEFAULT_MODULE_TOTALS['miljo-klima'],
      quizScores: {},
    },
    'helse-ernering': {
      moduleId: 'helse-ernering',
      completedSubchapters: [],
      totalSubchapters: DEFAULT_MODULE_TOTALS['helse-ernering'],
      quizScores: {},
    },
    'livets-tre': {
      moduleId: 'livets-tre',
      completedSubchapters: [],
      totalSubchapters: DEFAULT_MODULE_TOTALS['livets-tre'],
      quizScores: {},
    },
  };
}

export const localStorageAdapter: StorageAdapter = {
  getProgress(): PortalProgressState {
    const fallback = createInitialPortalProgress();
    if (typeof window === 'undefined') return fallback;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as Partial<PortalProgressState>;
      const merged = { ...fallback };

      (Object.keys(fallback) as ModuleId[]).forEach((id) => {
        const saved = parsed[id];
        if (saved) {
          merged[id] = {
            moduleId: id,
            completedSubchapters: Array.isArray(saved.completedSubchapters)
              ? saved.completedSubchapters
              : [],
            totalSubchapters: DEFAULT_MODULE_TOTALS[id],
            quizScores:
              saved.quizScores && typeof saved.quizScores === 'object'
                ? saved.quizScores
                : {},
            lastVisitedAt: saved.lastVisitedAt,
          };
        }
      });

      return merged;
    } catch {
      return fallback;
    }
  },

  saveProgress(state: PortalProgressState): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota or private-browsing errors
    }
  },

  clearProgress(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};
