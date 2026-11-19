import { ArrowLeft, ArrowRight, Construction, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FullscreenClosingSlide,
  type ClosingSlideMode,
} from '../../components/FullscreenClosingSlide';
import { QrShareModal } from '../../components/QrShareModal';
import { progressService } from '../../core/storage';
import { REFLECTION_PROMPTS } from '../../data/reflectionPrompts';
import { AtomBindingExplorer } from './components/AtomBindingExplorer';
import { KarbonHub } from './components/KarbonHub';
import { KarbonInfoPanel } from './components/KarbonInfoPanel';
import { KarbonQuizModal } from './components/KarbonQuizModal';
import { KarbonStepDock } from './components/KarbonStepDock';
import { getKarbonIcon, KarbonTopBar } from './components/KarbonTopBar';
import {
  ATOM_BINDING_CONTROL_QUESTIONS,
  ATOM_BINDING_MCQ_QUESTIONS,
  ATOM_BINDING_STEPS,
  type KarbonStepNode,
} from './data/atomBindingData';
import {
  KARBON_THEME_LIST,
  KARBON_THEMES,
  parseKarbonView,
  type KarbonAppView,
} from './data/karbonThemes';

export function KarbonModule() {
  const { tema } = useParams<{ tema?: string }>();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<KarbonAppView>(() =>
    parseKarbonView(tema),
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [unlockedStepIndex, setUnlockedStepIndex] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [closingSlide, setClosingSlide] = useState<ClosingSlideMode | null>(
    null,
  );
  const [lightboxNode, setLightboxNode] = useState<KarbonStepNode | null>(null);

  useEffect(() => {
    progressService.markModuleVisited('kjemiske-bindinger');
  }, []);

  useEffect(() => {
    const nextView = parseKarbonView(tema);
    setActiveView(nextView);
    setCurrentStepIndex(0);
    setUnlockedStepIndex(0);
    setClosingSlide(null);
    setIsQuizOpen(false);
    setLightboxNode(null);
    if (nextView === 'atommodell-bindinger') {
      progressService.markSubchapterCompleted(
        'kjemiske-bindinger',
        'atommodell-bindinger',
      );
    }
  }, [tema]);

  useEffect(() => {
    const title =
      activeView === 'karbon'
        ? 'Karbon – Oversikt'
        : KARBON_THEMES[activeView].title;
    document.title = `${title} | Naturfag Vg1`;
  }, [activeView]);

  const handleSelectView = useCallback(
    (nextView: KarbonAppView) => {
      setActiveView(nextView);
      setCurrentStepIndex(0);
      setUnlockedStepIndex(0);
      setClosingSlide(null);
      setIsQuizOpen(false);
      setLightboxNode(null);
      if (nextView === 'atommodell-bindinger') {
        progressService.markSubchapterCompleted(
          'kjemiske-bindinger',
          'atommodell-bindinger',
        );
      }
      navigate(nextView === 'karbon' ? '/karbon' : `/karbon/${nextView}`);
    },
    [navigate],
  );

  const jumpToStep = useCallback((nextIdx: number) => {
    const clamped = Math.max(
      0,
      Math.min(ATOM_BINDING_STEPS.length - 1, nextIdx),
    );
    setClosingSlide(null);
    setCurrentStepIndex(clamped);
    setUnlockedStepIndex((prev) => Math.max(prev, clamped));
  }, []);

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
    if (currentStepIndex < ATOM_BINDING_STEPS.length - 1) {
      jumpToStep(currentStepIndex + 1);
    } else if (isFullscreen) {
      setClosingSlide('summary');
    } else {
      setIsQuizOpen(true);
    }
  }, [
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

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen refusal
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setClosingSlide(null);
    }
  }, [isFullscreen]);

  // Classroom keyboard shortcuts (QR works everywhere; slide controls on ready subtopics)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
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
      }

      if (
        (e.key === 'k' || e.key === 'K') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsQrOpen((prev) => !prev);
        return;
      }

      if (activeView !== 'atommodell-bindinger') return;

      if (
        (e.key === 'q' || e.key === 'Q') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsQuizOpen((prev) => !prev);
        return;
      }

      if (
        (e.key === 'f' || e.key === 'F') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (lightboxNode || isQuizOpen || isQrOpen) return;

      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeView,
    handleNext,
    handlePrev,
    isQrOpen,
    isQuizOpen,
    lightboxNode,
    toggleFullscreen,
  ]);

  const activeMeta = activeView === 'karbon' ? null : KARBON_THEMES[activeView];
  const currentIdx = activeMeta
    ? KARBON_THEME_LIST.findIndex((t) => t.id === activeMeta.id)
    : -1;
  const prevTheme =
    currentIdx > 0 ? KARBON_THEME_LIST[currentIdx - 1] : null;
  const nextTheme =
    currentIdx >= 0 && currentIdx < KARBON_THEME_LIST.length - 1
      ? KARBON_THEME_LIST[currentIdx + 1]
      : null;

  const activeStep = ATOM_BINDING_STEPS[currentStepIndex];

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#080D1A] text-slate-100 overflow-x-hidden lg:overflow-hidden relative">
      <KarbonTopBar
        activeView={activeView}
        currentStepIndex={currentStepIndex}
        totalSteps={ATOM_BINDING_STEPS.length}
        showAllSteps={showAllSteps}
        isQuizOpen={isQuizOpen}
        isFullscreen={isFullscreen}
        onSelectView={handleSelectView}
        onToggleShowAll={() => setShowAllSteps((prev) => !prev)}
        onToggleQuiz={() => setIsQuizOpen((prev) => !prev)}
        onOpenQrModal={() => setIsQrOpen(true)}
        onToggleFullscreen={() => void toggleFullscreen()}
      />

      {activeView === 'karbon' ? (
        <KarbonHub onSelectTheme={handleSelectView} />
      ) : activeView === 'atommodell-bindinger' ? (
        <>
          <main
            className={`flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 w-full ${
              isFullscreen
                ? 'p-2 pb-20 sm:p-3 sm:pb-20 lg:px-3 lg:py-2 lg:pb-2 gap-2.5 sm:gap-3'
                : 'p-3 pb-24 sm:p-4 sm:pb-24 lg:px-6 lg:py-4 lg:pb-4 gap-3.5 sm:gap-4 max-w-[1920px] mx-auto'
            }`}
          >
            {isFullscreen && closingSlide ? (
              <div className="lg:col-span-12 min-h-0 h-full">
                <FullscreenClosingSlide
                  mode={closingSlide}
                  themeId="atommodell-bindinger"
                  themeTitle={KARBON_THEMES['atommodell-bindinger'].title}
                  themeSubtitle={
                    KARBON_THEMES['atommodell-bindinger'].dropdownDescription
                  }
                  accent="violet"
                  steps={ATOM_BINDING_STEPS.map((step) => ({
                    stepNumber: step.stepNumber,
                    title: step.title,
                    shortLabel: step.shortLabel,
                    summaryTitle: step.summaryTitle,
                    badge: step.categoryLabel,
                  }))}
                  keyTerms={Array.from(
                    new Set(ATOM_BINDING_STEPS.flatMap((step) => step.examples)),
                  )}
                  reviewQuestions={ATOM_BINDING_CONTROL_QUESTIONS.slice(0, 3).map(
                    (q) => ({
                      id: q.id,
                      question: q.question,
                      hint: q.contextHint,
                      answerPoints: q.points.map(
                        (p) => `${p.heading}: ${p.detail}`,
                      ),
                    }),
                  )}
                  reflectionPrompt={
                    REFLECTION_PROMPTS['atommodell-bindinger'] ?? {
                      question:
                        'Hvordan henger elektronene i det ytterste skallet sammen med egenskapene til stoffene vi møter i hverdagen?',
                    }
                  }
                  onJumpToStep={jumpToStep}
                  onOpenQuiz={() => setIsQuizOpen(true)}
                />
              </div>
            ) : (
              <>
                <section
                  aria-label="Interaktiv Atom- og Bindingslab"
                  className="h-[46vh] min-h-[300px] sm:h-[52vh] lg:h-full lg:col-span-7"
                >
                  <AtomBindingExplorer
                    currentStepIndex={currentStepIndex}
                    onSelectStep={jumpToStep}
                  />
                </section>

                <section
                  aria-label="Fagkort for kjemiske bindinger"
                  className="lg:h-full lg:col-span-5 min-h-0"
                >
                  <KarbonInfoPanel
                    node={activeStep}
                    totalSteps={ATOM_BINDING_STEPS.length}
                    isFullscreen={isFullscreen}
                    onOpenLightbox={setLightboxNode}
                  />
                </section>
              </>
            )}
          </main>

          <KarbonStepDock
            steps={ATOM_BINDING_STEPS}
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
      ) : (
        activeMeta && (
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/75 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getKarbonIcon(activeMeta.id);
                    return (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
                        style={{
                          borderColor: activeMeta.accentHex,
                          backgroundColor: activeMeta.glowHex,
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-300">
                      Undertema {activeMeta.order} av {KARBON_THEME_LIST.length} •{' '}
                      {activeMeta.dropdownBadge}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                      {activeMeta.title}
                    </h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/35 shrink-0">
                  <Construction className="w-3.5 h-3.5" />
                  <span>Klar for innhold</span>
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeMeta.dropdownDescription}
              </p>

              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-xs sm:text-sm text-slate-400">
                Menyen og strukturen for <strong>{activeMeta.title}</strong> er
                opprettet. Faglig innhold, interaktive modeller, illustrasjoner
                og oppgaver bygges ut steg for steg.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectView(prevTheme ? prevTheme.id : 'karbon')
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>
                    {prevTheme
                      ? `${prevTheme.order}. ${prevTheme.shortTitle}`
                      : 'Karbon-oversikt'}
                  </span>
                </button>

                {nextTheme && (
                  <button
                    type="button"
                    onClick={() => handleSelectView(nextTheme.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-xs font-bold text-violet-200 transition-colors cursor-pointer"
                  >
                    <span>
                      {nextTheme.order}. {nextTheme.shortTitle}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </main>
        )
      )}

      {isQuizOpen && activeView === 'atommodell-bindinger' && (
        <KarbonQuizModal
          title="Kontrollspørsmål: Atommodell & kjemiske bindinger"
          subchapterId="atommodell-bindinger"
          controlQuestions={ATOM_BINDING_CONTROL_QUESTIONS}
          mcqQuestions={ATOM_BINDING_MCQ_QUESTIONS}
          onClose={() => setIsQuizOpen(false)}
          onJumpToStep={jumpToStep}
        />
      )}

      {lightboxNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setLightboxNode(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxNode(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white cursor-pointer"
              aria-label="Lukk bilde"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightboxNode.image}
              alt={lightboxNode.title}
              className="w-full max-h-[75vh] object-contain bg-[#080D1A]"
            />
            <div className="p-4 border-t border-slate-800">
              <div className="text-sm font-bold text-white">
                {lightboxNode.title}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lightboxNode.imageCaption}
              </p>
            </div>
          </div>
        </div>
      )}
      <QrShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        routePath={activeView === 'karbon' ? '/karbon' : `/karbon/${activeView}`}
        badgeLabel={activeView === 'karbon' ? 'Temastartside' : 'Undertema'}
        title={
          activeView === 'karbon'
            ? 'Karbonforbindelser'
            : KARBON_THEMES[activeView].title
        }
        accent="violet"
      />
    </div>
  );
}

export default KarbonModule;
