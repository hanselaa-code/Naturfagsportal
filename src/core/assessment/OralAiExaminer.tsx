import {
  Bot,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  MessageSquare,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';
import { useState } from 'react';

export interface OralExaminerTurn {
  question: string;
  answer: string;
  goalRef: string;
}

interface OralAiExaminerProps {
  topicTitle?: string;
  moduleContext?: string;
  competenceGoals?: string[];
  onComplete?: (summary: {
    topicTitle: string;
    turns: OralExaminerTurn[];
    completedAt: string;
  }) => void;
}

const DEFAULT_GOALS = [
  'Gjøre rede for hovedtrekkene i teorien om Big Bang og universets utvikling.',
  'Forklare sammenhengen mellom DNA, proteinsyntese og arv av egenskaper.',
  'Drøfte hvordan kosthold, næringsstoffer og fysisk aktivitet påvirker helsen.',
];

export function OralAiExaminer({
  topicTitle = 'Naturfag Vg1 – Muntlig prøveforberedelse',
  moduleContext = 'Tverrfaglig samtale om energi, arv og helse i NAT01-05.',
  competenceGoals = DEFAULT_GOALS,
  onComplete,
}: OralAiExaminerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [turns, setTurns] = useState<OralExaminerTurn[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const questions = competenceGoals.map((goal, idx) => ({
    goalRef: goal,
    question:
      idx === 0
        ? `Ta utgangspunkt i kompetansemålet: «${goal}». Kan du forklare hovedmekanismen med egne ord og gi et konkret eksempel?`
        : idx === 1
          ? `La oss gå videre til neste mål: «${goal}». Hvilke begreper er mest sentrale her, og hvordan henger de sammen?`
          : `Avsluttende spørsmål knyttet til: «${goal}». Hvordan kan vi bruke denne kunnskapen til å vurdere påstander i hverdagen?`,
  }));

  const currentPrompt = questions[stepIndex];

  const handleSubmitTurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || !currentPrompt) return;

    const nextTurns: OralExaminerTurn[] = [
      ...turns,
      {
        question: currentPrompt.question,
        answer: currentAnswer.trim(),
        goalRef: currentPrompt.goalRef,
      },
    ];
    setTurns(nextTurns);
    setCurrentAnswer('');

    if (stepIndex + 1 < questions.length) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsFinished(true);
      onComplete?.({
        topicTitle,
        turns: nextTurns,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setCurrentAnswer('');
    setTurns([]);
    setIsFinished(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
            <Bot className="h-3.5 w-3.5" />
            Muntlig AI-sensor (Klargjort grensesnitt)
          </div>
          <h3 className="font-display text-lg font-bold text-slate-50">
            {topicTitle}
          </h3>
          <p className="mt-1 text-xs text-slate-400">{moduleContext}</p>
        </div>

        <span className="rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 font-mono-time text-xs text-slate-300">
          Steg {isFinished ? questions.length : stepIndex + 1} /{' '}
          {questions.length}
        </span>
      </div>

      {/* Competence goals checklist */}
      <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Kompetansemål i vurderingen
        </p>
        <ul className="space-y-1.5">
          {competenceGoals.map((goal, idx) => {
            const done = idx < turns.length;
            const active = !isFinished && idx === stepIndex;
            return (
              <li
                key={goal}
                className={`flex items-start gap-2 text-xs ${
                  done
                    ? 'text-emerald-300'
                    : active
                      ? 'text-sky-200 font-medium'
                      : 'text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                    done
                      ? 'text-emerald-400'
                      : active
                        ? 'text-sky-400'
                        : 'text-slate-600'
                  }`}
                />
                <span>{goal}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Conversation history */}
      {turns.length > 0 && (
        <div className="mb-4 max-h-60 space-y-3 overflow-y-auto custom-scrollbar pr-1">
          {turns.map((turn, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-800/70 p-3 text-xs text-slate-200">
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-semibold text-emerald-300">
                    Sensor:
                  </span>{' '}
                  {turn.question}
                </div>
              </div>
              <div className="ml-6 flex items-start gap-2.5 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-slate-100">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <span className="font-semibold text-sky-300">Elev:</span>{' '}
                  {turn.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFinished ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <FileCheck2 className="h-5 w-5" />
            Vurderingsgrunnlag oppsummert
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-200">
            Alle {turns.length} delspørsmål er besvart. Samtaleloggen er
            strukturert etter kompetansemålene og klar til å sendes til
            AI-vurderingsmotor eller faglærer for tilbakemelding.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-emerald-200/90">
            <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 ring-1 ring-emerald-400/25">
              Totalt ord:{' '}
              {turns.reduce(
                (acc, t) => acc + t.answer.split(/\s+/).filter(Boolean).length,
                0,
              )}
            </span>
            <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 ring-1 ring-emerald-400/25">
              Dekket {turns.length} / {competenceGoals.length} mål
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Start ny muntlig øving
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitTurn} className="space-y-3">
          {currentPrompt && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-slate-100">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  Sensorspørsmål {stepIndex + 1}
                </p>
                <p className="mt-1 leading-relaxed">{currentPrompt.question}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Skriv ditt muntlige svar her (eller bruk tale-til-tekst)..."
              className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950/75 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
            <button
              type="submit"
              disabled={!currentAnswer.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Svar sensor
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
