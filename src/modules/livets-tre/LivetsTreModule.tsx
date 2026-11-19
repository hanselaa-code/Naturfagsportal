import { Minimize } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimalCellExplorer } from './components/AnimalCellExplorer';
import { BiologyMindMap } from './components/BiologyMindMap';
import { DnaReplicationExplorer } from './components/DnaReplicationExplorer';
import { EvolutionExplorer } from './components/EvolutionExplorer';
import { GeneticsExplorer } from './components/GeneticsExplorer';
import { HumanBodyExplorer } from './components/HumanBodyExplorer';
import { ImageLightbox } from './components/ImageLightbox';
import { InfoPanel } from './components/InfoPanel';
import { PhylogeneticTree } from './components/PhylogeneticTree';
import { PlantCellExplorer } from './components/PlantCellExplorer';
import { ProteinSynthesisTimeline } from './components/ProteinSynthesisTimeline';
import { QuizModal } from './components/QuizModal';
import { TimelineDock } from './components/TimelineDock';
import { TopBar } from './components/TopBar';
import { BIOLOGY_CENTER_NODE } from './data/biologyHubData';
import {
  parseViewFromHash,
  THEME_LIST,
  THEMES,
  type AppView,
  type ThemeId,
} from './data/themes';
import { progressService } from '../../core/storage';
import {
  FullscreenClosingSlide,
  type ClosingSlideMode,
} from '../../components/FullscreenClosingSlide';
import { QrShareModal } from '../../components/QrShareModal';
import { REFLECTION_PROMPTS } from '../../data/reflectionPrompts';
import type { TreeNodeData } from './data/treeOfLifeData';

interface ThemeProgressState {
  currentStepIndex: number;
  unlockedStepIndex: number;
  selectedNodeId: string;
  showAllSteps: boolean;
}

function createInitialProgress(): Record<ThemeId, ThemeProgressState> {
  return Object.fromEntries(
    THEME_LIST.map((t) => [
      t.id,
      {
        currentStepIndex: 0,
        unlockedStepIndex: 0,
        selectedNodeId: t.mainStepIds[0],
        showAllSteps: false,
      },
    ]),
  ) as Record<ThemeId, ThemeProgressState>;
}

export function App() {
  const { tema } = useParams<{ tema?: string }>();
  const navigate = useNavigate();
  const initialView: AppView = tema ? parseViewFromHash(tema) : 'biologi';

  const [activeView, setActiveView] = useState<AppView>(initialView);
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(
    initialView === 'biologi' ? 'dyrecellen' : initialView,
  );
  const [progressByTheme, setProgressByTheme] = useState<
    Record<ThemeId, ThemeProgressState>
  >(createInitialProgress);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [lightboxNode, setLightboxNode] = useState<TreeNodeData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCinemaFallback, setIsCinemaFallback] = useState(false);
  const [closingSlide, setClosingSlide] = useState<ClosingSlideMode | null>(
    null,
  );

  const isMindMap = activeView === 'biologi';
  const activeTheme = THEMES[activeThemeId];
  const progress = progressByTheme[activeThemeId];
  const {
    currentStepIndex,
    unlockedStepIndex,
    selectedNodeId,
    showAllSteps,
  } = progress;

  useEffect(() => {
    window.focus();
    progressService.markModuleVisited('livets-tre');
  }, []);

  useEffect(() => {
    const nextView: AppView = tema ? parseViewFromHash(tema) : 'biologi';
    setActiveView(nextView);
    if (nextView !== 'biologi') {
      setActiveThemeId(nextView);
      progressService.markSubchapterCompleted('livets-tre', nextView);
    }
    setClosingSlide(null);
    setIsQuizOpen(false);
    setLightboxNode(null);
  }, [tema]);

  useEffect(() => {
    if (!isFullscreen) {
      setClosingSlide(null);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const pageTitle = isMindMap
      ? BIOLOGY_CENTER_NODE.dropdownTitle
      : activeTheme.title;
    document.title = `${pageTitle} | Naturfag Vg1`;
  }, [activeTheme.title, isMindMap]);

  const handleSelectView = useCallback(
    (nextView: AppView) => {
      setActiveView(nextView);
      if (nextView !== 'biologi') {
        setActiveThemeId(nextView);
        progressService.markSubchapterCompleted('livets-tre', nextView);
      }
      setClosingSlide(null);
      setIsQuizOpen(false);
      setLightboxNode(null);
      navigate(
        nextView === 'biologi' ? '/livets-tre' : `/livets-tre/${nextView}`,
      );
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [navigate],
  );

  const handleSelectTheme = useCallback(
    (nextThemeId: ThemeId) => {
      handleSelectView(nextThemeId);
    },
    [handleSelectView],
  );

  const jumpToStep = useCallback(
    (nextIdx: number) => {
      const mainIds = activeTheme.mainStepIds;
      const clamped = Math.max(0, Math.min(mainIds.length - 1, nextIdx));
      setClosingSlide(null);
      setProgressByTheme((prev) => {
        const cur = prev[activeThemeId];
        return {
          ...prev,
          [activeThemeId]: {
            ...cur,
            currentStepIndex: clamped,
            unlockedStepIndex: Math.max(cur.unlockedStepIndex, clamped),
            selectedNodeId: mainIds[clamped],
          },
        };
      });
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [activeTheme.mainStepIds, activeThemeId],
  );

  const handleNext = useCallback(() => {
    if (isQuizOpen || isQrOpen) return;

    if (isFullscreen && closingSlide === 'summary') {
      setClosingSlide('questions');
      return;
    }
    if (isFullscreen && closingSlide === 'questions') {
      setIsQuizOpen(true);
      return;
    }

    if (currentStepIndex < activeTheme.mainStepIds.length - 1) {
      jumpToStep(currentStepIndex + 1);
    } else if (isFullscreen) {
      setClosingSlide('summary');
    } else {
      setIsQuizOpen(true);
    }
  }, [
    activeTheme.mainStepIds.length,
    closingSlide,
    currentStepIndex,
    isFullscreen,
    isQrOpen,
    isQuizOpen,
    jumpToStep,
  ]);

  const handlePrev = useCallback(() => {
    if (isQrOpen) {
      setIsQrOpen(false);
      return;
    }
    if (isQuizOpen) {
      setIsQuizOpen(false);
      return;
    }
    if (isFullscreen && closingSlide === 'questions') {
      setClosingSlide('summary');
      return;
    }
    if (isFullscreen && closingSlide === 'summary') {
      setClosingSlide(null);
      return;
    }
    if (currentStepIndex > 0) {
      jumpToStep(currentStepIndex - 1);
    }
  }, [
    closingSlide,
    currentStepIndex,
    isFullscreen,
    isQrOpen,
    isQuizOpen,
    jumpToStep,
  ]);

  const handleSelectNode = useCallback(
    (nodeId: string) => {
      const target = activeTheme.nodeMap[nodeId];
      if (!target) return;
      setClosingSlide(null);
      setProgressByTheme((prev) => {
        const cur = prev[activeThemeId];
        return {
          ...prev,
          [activeThemeId]: {
            ...cur,
            selectedNodeId: nodeId,
            currentStepIndex: target.isMainPath
              ? target.stepIndex
              : cur.currentStepIndex,
            unlockedStepIndex: Math.max(cur.unlockedStepIndex, target.stepIndex),
          },
        };
      });
    },
    [activeTheme.nodeMap, activeThemeId],
  );

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
    setIsQuizOpen(false);
    setIsQrOpen(false);
    setClosingSlide(null);
    setProgressByTheme((prev) => ({
      ...prev,
      [activeThemeId]: {
        currentStepIndex: 0,
        unlockedStepIndex: 0,
        selectedNodeId: activeTheme.mainStepIds[0],
        showAllSteps: false,
      },
    }));
  }, [activeTheme.mainStepIds, activeThemeId]);

  const toggleFullscreen = useCallback(async () => {
    if (isCinemaFallback) {
      setIsCinemaFallback(false);
      setIsFullscreen(false);
      return;
    }
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsCinemaFallback((prev) => {
        const next = !prev;
        setIsFullscreen(next);
        return next;
      });
    }
  }, [isCinemaFallback]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Seamless classroom keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'VIDEO' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (lightboxNode) {
          setLightboxNode(null);
          return;
        }
        if (isQrOpen) {
          setIsQrOpen(false);
          return;
        }
        if (isQuizOpen) {
          setIsQuizOpen(false);
          return;
        }
        if (isCinemaFallback) {
          setIsCinemaFallback(false);
          setIsFullscreen(false);
          return;
        }
      }

      if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          void toggleFullscreen();
          return;
        }
      }

      if (e.key === 'k' || e.key === 'K') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          setIsQrOpen((prev) => !prev);
          return;
        }
      }

      if (isMindMap) return;

      if (e.key === 'q' || e.key === 'Q') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          setIsQuizOpen((prev) => !prev);
          return;
        }
      }

      if (lightboxNode || isQrOpen) return;

      if (!isQuizOpen) {
        if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleNext,
    handlePrev,
    isCinemaFallback,
    isMindMap,
    isQrOpen,
    isQuizOpen,
    lightboxNode,
    toggleFullscreen,
  ]);

  const activeNode =
    activeTheme.nodeMap[selectedNodeId] ??
    activeTheme.nodeMap[activeTheme.mainStepIds[0]];

  return (
    <div className="min-h-screen lg:h-screen flex flex-col oceanic-canvas text-slate-100 overflow-x-hidden lg:overflow-hidden relative">
      {!isCinemaFallback ? (
        <TopBar
          activeView={activeView}
          activeTheme={activeTheme}
          currentStepIndex={currentStepIndex}
          showAllSteps={showAllSteps}
          isQuizOpen={isQuizOpen}
          isFullscreen={isFullscreen}
          onSelectView={handleSelectView}
          onToggleShowAll={handleToggleShowAll}
          onToggleQuiz={() => setIsQuizOpen((prev) => !prev)}
          onOpenQrModal={() => setIsQrOpen(true)}
          onToggleFullscreen={() => void toggleFullscreen()}
          onResetPresentation={handleResetPresentation}
        />
      ) : (
        <button
          id="btn-exit-cinema"
          type="button"
          onClick={() => void toggleFullscreen()}
          className="fixed top-3 right-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-300 shadow-lg cursor-pointer"
        >
          <Minimize className="w-3.5 h-3.5" />
          <span>Vis toppmeny (F)</span>
        </button>
      )}

      {isMindMap ? (
        <BiologyMindMap onSelectTheme={(id) => handleSelectView(id)} />
      ) : (
        <>
          {/* Main split classroom stage: Left/Top Interactive Canvas + Right Info Card, or Fullscreen Closing Slide */}
          <main
            className={`flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 w-full mx-auto ${
              isFullscreen
                ? 'p-2 pb-20 sm:p-2.5 sm:pb-20 lg:px-3 lg:py-2 lg:pb-2 gap-2.5'
                : 'p-3 pb-24 sm:p-4 sm:pb-24 lg:px-6 lg:py-4 lg:pb-4 gap-3.5 sm:gap-4 max-w-[1920px]'
            }`}
          >
            {isFullscreen && closingSlide ? (
              <div className="lg:col-span-12 min-h-0 h-full">
                <FullscreenClosingSlide
                  mode={closingSlide}
                  themeId={activeThemeId}
                  themeTitle={activeTheme.title}
                  themeSubtitle={activeTheme.subtitle}
                  accent="emerald"
                  steps={activeTheme.mainStepIds.map((id, idx) => {
                    const n = activeTheme.nodeMap[id];
                    return {
                      stepNumber: idx + 1,
                      title: n.title,
                      shortLabel: n.shortLabel,
                      summaryTitle: n.summaryTitle,
                      badge: n.timeMa,
                    };
                  })}
                  keyTerms={Array.from(
                    new Set(
                      activeTheme.mainStepIds.flatMap(
                        (id) => activeTheme.nodeMap[id]?.examples ?? [],
                      ),
                    ),
                  )}
                  reviewQuestions={activeTheme.controlQuestions
                    .slice(0, 3)
                    .map((q) => ({
                      id: q.id,
                      question: q.question,
                      hint: q.contextHint,
                      answerPoints: q.points.map(
                        (p) => `${p.heading}: ${p.detail}`,
                      ),
                    }))}
                  reflectionPrompt={
                    REFLECTION_PROMPTS[activeThemeId] ?? {
                      question: `Hva synes du er det mest overraskende eller viktigste ved ${activeTheme.title.toLowerCase()}, og hvordan henger det sammen med livet rundt oss i dag?`,
                    }
                  }
                  onJumpToStep={jumpToStep}
                  onOpenQuiz={() => setIsQuizOpen(true)}
                />
              </div>
            ) : (
              <>
                <section
                  aria-label={activeTheme.title}
                  className="h-[42vh] min-h-[280px] sm:h-[50vh] lg:h-full lg:col-span-7 xl:col-span-7"
                >
                  {activeThemeId === 'livets-tre' && (
                    <PhylogeneticTree
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'kroppens-evolusjon' && (
                    <HumanBodyExplorer
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'dyrecellen' && (
                    <AnimalCellExplorer
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'plantecellen' && (
                    <PlantCellExplorer
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'dna-replikasjon' && (
                    <DnaReplicationExplorer
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'proteinsyntesen' && (
                    <ProteinSynthesisTimeline
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'evolusjon' && (
                    <EvolutionExplorer
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                  {activeThemeId === 'genetikk' && (
                    <GeneticsExplorer
                      unlockedStepIndex={unlockedStepIndex}
                      showAllSteps={showAllSteps}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={handleSelectNode}
                    />
                  )}
                </section>

                <section
                  aria-label="Fagkort for valgt tema"
                  className="lg:h-full lg:col-span-5 xl:col-span-5 min-h-0"
                >
                  <InfoPanel
                    activeTheme={activeTheme}
                    node={activeNode}
                    currentMainStepIndex={currentStepIndex}
                    isFullscreen={isFullscreen}
                    onSelectNode={handleSelectNode}
                    onOpenLightbox={(node) => setLightboxNode(node)}
                    onSwitchTheme={handleSelectTheme}
                  />
                </section>
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
            onPrev={handlePrev}
            onNext={handleNext}
            onJumpToStep={jumpToStep}
            onSelectClosingSlide={setClosingSlide}
          />
        </>
      )}

      {isQuizOpen && (
        <QuizModal
          key={activeThemeId}
          activeTheme={activeTheme}
          onClose={() => setIsQuizOpen(false)}
          onJumpToStep={jumpToStep}
        />
      )}

      <QrShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        routePath={
          activeView === 'biologi' ? '/livets-tre' : `/livets-tre/${activeView}`
        }
        badgeLabel={activeView === 'biologi' ? 'Temastartside' : 'Undertema'}
        title={
          activeView === 'biologi' ? 'Biologi & Livets tre' : activeTheme.title
        }
        accent="emerald"
      />

      <ImageLightbox
        node={lightboxNode}
        onClose={() => setLightboxNode(null)}
      />
    </div>
  );
}

export default App;

