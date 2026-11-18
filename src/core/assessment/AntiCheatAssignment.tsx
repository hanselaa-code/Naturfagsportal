import {
  AlertTriangle,
  CheckCircle2,
  ClipboardX,
  EyeOff,
  Send,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export interface IntegrityEvent {
  id: string;
  type: 'tab-switch' | 'paste-blocked' | 'copy-blocked' | 'cut-blocked' | 'contextmenu-blocked';
  message: string;
  timestamp: string;
}

export interface AntiCheatSubmission {
  assignmentTitle: string;
  answer: string;
  wordCount: number;
  tabSwitchCount: number;
  blockedActionCount: number;
  events: IntegrityEvent[];
  submittedAt: string;
}

interface AntiCheatAssignmentProps {
  title?: string;
  prompt?: string;
  competenceGoal?: string;
  minWords?: number;
  onSubmit?: (submission: AntiCheatSubmission) => void;
}

export function AntiCheatAssignment({
  title = 'Skriftlig underveisvurdering (Kopisperre aktiv)',
  prompt = 'Forklar med egne ord hvordan Big Bang-teorien støttes av kosmisk bakgrunnsstråling og rødforskyvning av galakser.',
  competenceGoal = 'NAT01-05: Gjøre rede for hovedtrekkene i teorien om universets utvikling.',
  minWords = 30,
  onSubmit,
}: AntiCheatAssignmentProps) {
  const [answer, setAnswer] = useState('');
  const [events, setEvents] = useState<IntegrityEvent[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [blockedActionCount, setBlockedActionCount] = useState(0);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<AntiCheatSubmission | null>(null);

  const logEvent = (
    type: IntegrityEvent['type'],
    message: string,
    isTabSwitch = false,
  ) => {
    const entry: IntegrityEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString('nb-NO'),
    };
    setEvents((prev) => [entry, ...prev].slice(0, 15));
    setActiveWarning(message);
    if (isTabSwitch) {
      setTabSwitchCount((c) => c + 1);
    } else {
      setBlockedActionCount((c) => c + 1);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !submitted) {
        logEvent(
          'tab-switch',
          'Fane-bytte registrert! Hold deg i eksamensfanen under besvarelsen.',
          true,
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [submitted]);

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount < minWords) {
      setActiveWarning(
        `Svaret bør inneholde minst ${minWords} ord før innlevering (du har ${wordCount} ord).`,
      );
      return;
    }

    const payload: AntiCheatSubmission = {
      assignmentTitle: title,
      answer: answer.trim(),
      wordCount,
      tabSwitchCount,
      blockedActionCount,
      events,
      submittedAt: new Date().toISOString(),
    };
    setSubmitted(payload);
    setActiveWarning(null);
    onSubmit?.(payload);
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            Kopisperre & Fane-overvåking
          </div>
          <h3 className="font-display text-lg font-bold text-slate-50">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-400">{competenceGoal}</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium ${
              tabSwitchCount > 0
                ? 'border-rose-400/40 bg-rose-500/15 text-rose-200'
                : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {tabSwitchCount > 0 ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            Fane-bytter: {tabSwitchCount}
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-700/70 bg-slate-900/70 p-4 text-sm leading-relaxed text-slate-200">
        {prompt}
      </div>

      {activeWarning && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-xs font-medium text-amber-200"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            {activeWarning}
          </span>
          <button
            type="button"
            onClick={() => setActiveWarning(null)}
            className="rounded-lg px-2 py-1 text-[11px] text-amber-300 hover:bg-amber-500/20"
          >
            Lukk
          </button>
        </div>
      )}

      {submitted ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            Besvarelse registrert ({submitted.wordCount} ord)
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Loggført integritet: {submitted.tabSwitchCount} fane-bytter,{' '}
            {submitted.blockedActionCount} blokkerte utklippshandlinger.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(null);
              setAnswer('');
              setEvents([]);
              setTabSwitchCount(0);
              setBlockedActionCount(0);
            }}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Skriv ny besvarelse
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                logEvent(
                  'paste-blocked',
                  'Lim inn (Paste) er deaktivert i dette svarfeltet.',
                );
              }}
              onCopy={(e) => {
                e.preventDefault();
                logEvent(
                  'copy-blocked',
                  'Kopiering (Copy) er deaktivert i dette svarfeltet.',
                );
              }}
              onCut={(e) => {
                e.preventDefault();
                logEvent(
                  'cut-blocked',
                  'Klipp ut (Cut) er deaktivert i dette svarfeltet.',
                );
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                logEvent(
                  'contextmenu-blocked',
                  'Høyreklikk er deaktivert i svarfeltet.',
                );
              }}
              rows={6}
              placeholder="Skriv besvarelsen din her med egne ord... (Lim inn, kopier, klipp ut og høyreklikk er blokkert)"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/75 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>
                Ord:{' '}
                <strong
                  className={
                    wordCount >= minWords ? 'text-emerald-400' : 'text-slate-200'
                  }
                >
                  {wordCount}
                </strong>{' '}
                / {minWords} min.
              </span>
              {blockedActionCount > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <ClipboardX className="h-3.5 w-3.5" />
                  {blockedActionCount} blokkert
                </span>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              <Send className="h-3.5 w-3.5" />
              Lever besvarelse
            </button>
          </div>
        </form>
      )}

      {events.length > 0 && (
        <div className="mt-4 border-t border-slate-800 pt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Hendelseslogg ({events.length})
          </p>
          <ul className="max-h-28 space-y-1 overflow-y-auto custom-scrollbar text-xs text-slate-400">
            {events.map((ev) => (
              <li key={ev.id} className="flex items-center justify-between gap-2">
                <span className="truncate">{ev.message}</span>
                <span className="font-mono-time shrink-0 text-[10px] text-slate-500">
                  {ev.timestamp}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
