import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DigestiveBodyExplorer } from './components/DigestiveBodyExplorer';
import { HealthMindMap } from './components/HealthMindMap';
import { ImageLightbox } from './components/ImageLightbox';
import { InfoPanel } from './components/InfoPanel';
import { ModuleExplorer } from './components/ModuleExplorer';
import { QuizModal } from './components/QuizModal';
import { TimelineDock } from './components/TimelineDock';
import { TopBar } from './components/TopBar';
import { HEALTH_CENTER_NODE } from './data/healthHubData';
import {
  parseViewFromHash,
  THEME_LIST,
  THEMES,
} from './data/themes';
import type { AppView, HealthNodeData, ThemeId } from './data/types';
import { progressService } from '../../core/storage';
import {
  FullscreenClosingSlide,
  type ClosingSlideMode,
} from '../../components/FullscreenClosingSlide';
import { QrShareModal } from '../../components/QrShareModal';
import { REFLECTION_PROMPTS } from '../../data/reflectionPrompts';

interface ThemeProgressState {
  currentStepIndex: number;
  unlockedStepIndex: number;
  showAllSteps: boolean;
}

function createInitialProgress(): Record<ThemeId, ThemeProgressState> {
  return Object.fromEntries(
    THEME_LIST.map((t) => [
      t.id,
      {
        currentStepIndex: 0,
        unlockedStepIndex: 0,
        showAllSteps: false,
      },
    ]),
  ) as Record<ThemeId, ThemeProgressState>;
}

export function App() {
  const { tema } = useParams<{ tema?: string }>();
  const navigate = useNavigate();
  const initialView: AppView = tema ? parseViewFromHash(tema) : 'oversikt';

  const [activeView, setActiveView] = useState<AppView>(initialView);
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(
    initialView === 'oversikt' ? 'naeringsstoffer' : initialView,
  );
  const [progressByTheme, setProgressByTheme] = useState<
    Record<ThemeId, ThemeProgressState>
  >(createInitialProgress);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [lightboxNode, setLightboxNode] = useState<HealthNodeData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [closingSlide, setClosingSlide] = useState<ClosingSlideMode | null>(
    null,
  );

  const isMindMap = activeView === 'oversikt';
  const activeTheme = THEMES[activeThemeId];
  const progress = progressByTheme[activeThemeId];
  const { currentStepIndex, unlockedStepIndex, showAllSteps } = progress;

  useEffect(() => {
    progressService.markModuleVisited('helse-ernering');
  }, []);

  useEffect(() => {
    const nextView: AppView = tema ? parseViewFromHash(tema) : 'oversikt';
    setActiveView(nextView);
    if (nextView !== 'oversikt') {
      setActiveThemeId(nextView);
      progressService.markSubchapterCompleted('helse-ernering', nextView);
    }
    setClosingSlide(null);
    setIsQuizOpen(false);
    setLightboxNode(null);
  }, [tema]);

  useEffect(() => {
    const pageTitle = isMindMap
      ? HEALTH_CENTER_NODE.dropdownTitle
      : activeTheme.title;
    document.title = `${pageTitle} | Naturfag Vg1`;
  }, [activeTheme.title, isMindMap]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setClosingSlide(null);
    }
  }, [isFullscreen]);

  const handleSelectView = useCallback(
    (nextView: AppView) => {
      setActiveView(nextView);
      if (nextView !== 'oversikt') {
        setActiveThemeId(nextView);
        progressService.markSubchapterCompleted('helse-ernering', nextView);
      }
      setClosingSlide(null);
      setIsQuizOpen(false);
      setLightboxNode(null);
      navigate(
        nextView === 'oversikt'
          ? '/helse-ernering'
          : `/helse-ernering/${nextView}`,
      );
    },
    [navigate],
  );

  const jumpToStep = useCallback(
    (nextIdx: number) => {
      const total = activeTheme.mainStepIds.length;
      const clamped = Math.max(0, Math.min(total - 1, nextIdx));
      setClosingSlide(null);
      setProgressByTheme((prev) => {
        const cur = prev[activeThemeId];
        return {
          ...prev,
          [activeThemeId]: {
            ...cur,
            currentStepIndex: clamped,
            unlockedStepIndex: Math.max(cur.unlockedStepIndex, clamped),
          },
        };
      });
    },
    [activeTheme.mainStepIds.length, activeThemeId],
  );

  const handlePrevStep = useCallback(() => {
    if (isFullscreen && closingSlide === 'questions') {
      setClosingSlide('summary');
      return;
    }
    if (isFullscreen && closingSlide === 'summary') {
      setClosingSlide(null);
      return;
    }
    jumpToStep(currentStepIndex - 1);
  }, [closingSlide, currentStepIndex, isFullscreen, jumpToStep]);

  const handleNextStep = useCallback(() => {
    if (isFullscreen && closingSlide === 'summary') {
      setClosingSlide('questions');
      return;
    }
    if (isFullscreen && closingSlide === 'questions') {
      return;
    }
    if (currentStepIndex < activeTheme.mainStepIds.length - 1) {
      jumpToStep(currentStepIndex + 1);
    } else if (isFullscreen) {
      setClosingSlide('summary');
    }
  }, [
    activeTheme.mainStepIds.length,
    closingSlide,
    currentStepIndex,
    isFullscreen,
    jumpToStep,
  ]);

  const handleToggleShowAll = useCallback(() => {
    setProgressByTheme((prev) => {
      const cur = prev[activeThemeId];
      return {
        ...prev,
        [activeThemeId]: {
          ...cur,
          showAllSteps: !cur.showAllSteps,
        },
      };
    });
  }, [activeThemeId]);

  const handleResetPresentation = useCallback(() => {
    setClosingSlide(null);
    setProgressByTheme((prev) => ({
      ...prev,
      [activeThemeId]: {
        currentStepIndex: 0,
        unlockedStepIndex: 0,
        showAllSteps: false,
      },
    }));
  }, [activeThemeId]);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen denial in iframes
    }
  }, []);

  // Global keyboard shortcuts matching big-bang
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setLightboxNode(null);
        setIsQuizOpen(false);
        setIsQrOpen(false);
        return;
      }

      if (
        e.key.toLowerCase() === 'f' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }

      if (
        e.key.toLowerCase() === 'k' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsQrOpen((p) => !p);
        return;
      }

      if (isMindMap) return;

      if (
        e.key.toLowerCase() === 'q' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsQuizOpen((p) => !p);
        return;
      }

      if (isQuizOpen || isQrOpen || lightboxNode) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevStep();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleNextStep,
    handlePrevStep,
    handleToggleFullscreen,
    isMindMap,
    isQrOpen,
    isQuizOpen,
    lightboxNode,
  ]);

  const activeNodeId = activeTheme.mainStepIds[currentStepIndex];
  const activeNode =
    activeTheme.nodeMap[activeNodeId] ?? activeTheme.allNodes[0];

  return (
    <div className="min-h-screen lg:h-screen flex flex-col health-canvas text-slate-100 lg:overflow-hidden">
      <TopBar
        activeView={activeView}
        activeTheme={activeTheme}
        currentStepIndex={currentStepIndex}
        showAllSteps={showAllSteps}
        isQuizOpen={isQuizOpen}
        isFullscreen={isFullscreen}
        onSelectView={handleSelectView}
        onToggleShowAll={handleToggleShowAll}
        onToggleQuiz={() => setIsQuizOpen((p) => !p)}
        onOpenQrModal={() => setIsQrOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
        onResetPresentation={handleResetPresentation}
      />

      {isMindMap ? (
        <HealthMindMap onSelectTheme={(id) => handleSelectView(id)} />
      ) : (
        <>
          <main
            className={`flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 ${
              isFullscreen
                ? 'px-2 sm:px-3 py-2 gap-2 lg:gap-3'
                : 'px-3 sm:px-4 lg:px-6 py-3 gap-3 lg:gap-4'
            }`}
          >
            {isFullscreen && closingSlide ? (
              <div className="lg:col-span-12 min-h-0 h-full">
                <FullscreenClosingSlide
                  mode={closingSlide}
                  themeId={activeThemeId}
                  themeTitle={activeTheme.title}
                  themeSubtitle={activeTheme.subtitle}
                  accent="amber"
                  steps={activeTheme.mainStepIds.map((id, idx) => {
                    const n = activeTheme.nodeMap[id];
                    return {
                      stepNumber: idx + 1,
                      title: n.title,
                      shortLabel: n.shortLabel,
                      summaryTitle: n.summaryTitle,
                      badge: n.primaryBadge,
                    };
                  })}
                  keyTerms={Array.from(
                    new Set(
                      activeTheme.mainStepIds.flatMap(
                        (id) => activeTheme.nodeMap[id]?.terms ?? [],
                      ),
                    ),
                  )}
                  reviewQuestions={activeTheme.mcqQuestions
                    .slice(0, 3)
                    .map((q) => ({
                      id: q.id,
                      question: q.question,
                      answerPoints: [
                        `Riktig svar: ${q.options[q.correctIndex]}`,
                        q.explanation,
                      ],
                    }))}
                  reflectionPrompt={
                    REFLECTION_PROMPTS[activeThemeId] ?? {
                      question:
                        activeNode.discussionQuestion ??
                        `Hvordan kan du bruke det vi har lært om ${activeTheme.title.toLowerCase()} i din egen hverdag?`,
                    }
                  }
                  onJumpToStep={jumpToStep}
                  onOpenQuiz={() => setIsQuizOpen(true)}
                />
              </div>
            ) : (
              <>
                <div className="lg:col-span-6 xl:col-span-7 min-h-[340px] lg:min-h-0">
                  {activeTheme.id === 'fordoyelsen' ? (
                    <DigestiveBodyExplorer
                      activeTheme={activeTheme}
                      currentStepIndex={currentStepIndex}
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      onSelectStep={jumpToStep}
                    />
                  ) : (
                    <ModuleExplorer
                      activeTheme={activeTheme}
                      currentStepIndex={currentStepIndex}
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      onSelectStep={jumpToStep}
                    />
                  )}
                </div>

                <div className="lg:col-span-6 xl:col-span-5 min-h-[420px] lg:min-h-0">
                  <InfoPanel
                    activeTheme={activeTheme}
                    node={activeNode}
                    isFullscreen={isFullscreen}
                    onOpenLightbox={setLightboxNode}
                  />
                </div>
              </>
            )}
          </main>

          <TimelineDock
            activeTheme={activeTheme}
            currentStepIndex={currentStepIndex}
            unlockedStepIndex={unlockedStepIndex}
            showAllSteps={showAllSteps}
            isFullscreen={isFullscreen}
            closingSlide={closingSlide}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onJumpToStep={jumpToStep}
            onSelectClosingSlide={setClosingSlide}
          />
        </>
      )}

      <QuizModal
        key={activeThemeId}
        isOpen={isQuizOpen}
        activeTheme={activeTheme}
        onClose={() => setIsQuizOpen(false)}
        onJumpToStep={jumpToStep}
      />

      <QrShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        routePath={
          activeView === 'oversikt'
            ? '/helse-ernering'
            : `/helse-ernering/${activeView}`
        }
        badgeLabel={activeView === 'oversikt' ? 'Temastartside' : 'Undertema'}
        title={
          activeView === 'oversikt' ? 'Helse og ernæring' : activeTheme.title
        }
        accent="amber"
      />

      <ImageLightbox
        node={lightboxNode}
        onClose={() => setLightboxNode(null)}
      />
    </div>
  );
}

export default App;

