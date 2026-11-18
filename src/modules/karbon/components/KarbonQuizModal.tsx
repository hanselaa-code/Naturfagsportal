import {
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { progressService } from '../../../core/storage';
import type {
  KarbonControlQuestion,
  KarbonMcqQuestion,
} from '../data/atomBindingData';

interface KarbonQuizModalProps {
  title: string;
  subchapterId: string;
  controlQuestions: KarbonControlQuestion[];
  mcqQuestions: KarbonMcqQuestion[];
  onClose: () => void;
  onJumpToStep: (idx: number) => void;
}

export function KarbonQuizModal({
  title,
  subchapterId,
  controlQuestions,
  mcqQuestions,
  onClose,
  onJumpToStep,
}: KarbonQuizModalProps) {
  const [activeTab, setActiveTab] = useState<'oral' | 'mcq'>('mcq');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = mcqQuestions.reduce(
    (acc, q) => acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0),
    0,
  );
  const allAnswered =
    mcqQuestions.length > 0 && answeredCount === mcqQuestions.length;

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (selectedAnswers[qId] !== undefined) return;
    const next = { ...selectedAnswers, [qId]: optIdx };
    setSelectedAnswers(next);

    if (Object.keys(next).length === mcqQuestions.length) {
      const score = mcqQuestions.reduce(
        (acc, q) => acc + (next[q.id] === q.correctIndex ? 1 : 0),
        0,
      );
      progressService.saveQuizScore(
        'kjemiske-bindinger',
        subchapterId,
        score,
        mcqQuestions.length,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700 bg-[#0B1222] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white font-display">
                {title}
              </h2>
              <p className="text-xs text-slate-400">
                Test deg selv eller bruk som muntlig oppsummering i klasserommet
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Lukk"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-2 border-b border-slate-800/70">
          <button
            type="button"
            onClick={() => setActiveTab('mcq')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              activeTab === 'mcq'
                ? 'bg-violet-500 text-slate-950 border-violet-300'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            Flervalgsquiz ({mcqQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('oral')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              activeTab === 'oral'
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            Muntlige kontrollspørsmål ({controlQuestions.length})
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {activeTab === 'mcq' ? (
            <>
              {allAnswered && (
                <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-emerald-300 shrink-0" />
                    <div>
                      <div className="text-sm font-extrabold text-white">
                        Resultat: {correctCount} av {mcqQuestions.length} riktige!
                      </div>
                      <p className="text-xs text-emerald-200">
                        Resultatet er lagret i fremdriften din.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAnswers({})}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Prøv på nytt</span>
                  </button>
                </div>
              )}

              {mcqQuestions.map((q) => {
                const picked = selectedAnswers[q.id];
                const isAnswered = picked !== undefined;
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                        Spørsmål {q.number} • {q.topicBadge}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onJumpToStep(q.relatedStepIndex);
                          onClose();
                        }}
                        className="text-[11px] text-sky-300 hover:underline cursor-pointer"
                      >
                        Se steg {q.relatedStepIndex + 1} →
                      </button>
                    </div>

                    <div className="text-sm font-bold text-white">
                      {q.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, idx) => {
                        const isPicked = picked === idx;
                        const isCorrect = idx === q.correctIndex;
                        let style =
                          'bg-slate-950/70 hover:bg-slate-800 border-slate-700 text-slate-200';
                        if (isAnswered) {
                          if (isCorrect) {
                            style =
                              'bg-emerald-500/20 border-emerald-400 text-emerald-100';
                          } else if (isPicked) {
                            style =
                              'bg-rose-500/20 border-rose-400 text-rose-100';
                          } else {
                            style =
                              'bg-slate-950/40 border-slate-800 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(q.id, idx)}
                            className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer disabled:cursor-default ${style}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                            )}
                            {isAnswered && isPicked && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-300 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <p className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
                        <strong className="text-emerald-300">Forklaring:</strong>{' '}
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            controlQuestions.map((cq) => {
              const revealed = Boolean(revealedIds[cq.id]);
              return (
                <div
                  key={cq.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2.5"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Kontrollspørsmål {cq.number}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {cq.question}
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    Hint: {cq.contextHint}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setRevealedIds((prev) => ({
                        ...prev,
                        [cq.id]: !prev[cq.id],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 cursor-pointer"
                  >
                    {revealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Skjul fasit</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Vis fasit</span>
                      </>
                    )}
                  </button>

                  {revealed && (
                    <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-2">
                      {cq.points.map((pt) => (
                        <div key={pt.heading} className="text-xs text-slate-200">
                          <strong className="text-violet-300">
                            {pt.heading}:
                          </strong>{' '}
                          {pt.detail}
                        </div>
                      ))}
                      <div className="text-xs text-emerald-300 font-semibold pt-1 border-t border-slate-800">
                        Hovedpoeng: {cq.takeaway}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
