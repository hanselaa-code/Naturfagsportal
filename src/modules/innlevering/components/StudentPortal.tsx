import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ClipboardList,
  Clock,
  GraduationCap,
  Loader2,
  LogOut,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { evaluateSubmissionWithAI } from '../services/aiSensorService';
import {
  listAssignmentsByClass,
  listSubmissionsByStudent,
  saveAiAssessment,
  saveStudentSubmission,
  signOutUser,
} from '../services/innleveringService';
import {
  countWords,
  formatNorwegianDateTime,
  getGradingScaleLabel,
  getGradingScaleShortLabel,
  getSubmissionTypeLabel,
  type Assignment,
  type IntegrityEventRecord,
  type StudentProfile,
  type Submission,
} from '../types';
import { AiFeedbackCard, getGradeBadgeStyle } from './AiFeedbackCard';

interface StudentPortalProps {
  student: StudentProfile;
  initialAssignmentId?: string;
}

export function StudentPortal({
  student,
  initialAssignmentId,
}: StudentPortalProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [handledInitialDeepLink, setHandledInitialDeepLink] = useState(false);

  // Editor state
  const [answerText, setAnswerText] = useState('');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [blockedActionCount, setBlockedActionCount] = useState(0);
  const [integrityEvents, setIntegrityEvents] = useState<
    IntegrityEventRecord[]
  >([]);
  const [integrityWarning, setIntegrityWarning] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [evaluatingAI, setEvaluatingAI] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [assList, subList] = await Promise.all([
        listAssignmentsByClass(student.classId, true),
        listSubmissionsByStudent(student.uid),
      ]);
      setAssignments(assList);
      setSubmissions(subList);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [student.classId, student.uid]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedAssignment = assignments.find(
    (a) => a.id === selectedAssignmentId,
  );
  const existingSubmission = selectedAssignment
    ? submissions.find((s) => s.assignmentId === selectedAssignment.id)
    : undefined;

  const isAnticheat = selectedAssignment?.submissionType === 'anticheat';

  const openAssignment = useCallback(
    (assignment: Assignment, subList: Submission[] = submissions) => {
      const existing = subList.find((s) => s.assignmentId === assignment.id);
      setSelectedAssignmentId(assignment.id);
      setAnswerText(existing?.answerText ?? '');
      setTabSwitchCount(existing?.integrity?.tabSwitchCount ?? 0);
      setBlockedActionCount(existing?.integrity?.blockedActionCount ?? 0);
      setIntegrityEvents(existing?.integrity?.events ?? []);
      setIntegrityWarning(null);
      setError(null);
    },
    [submissions],
  );

  // Auto-open assignment when arriving via QR code / Teams link
  useEffect(() => {
    if (loading || handledInitialDeepLink || !initialAssignmentId) return;
    setHandledInitialDeepLink(true);

    const target = assignments.find((a) => a.id === initialAssignmentId);
    if (target) {
      openAssignment(target, submissions);
    } else {
      setError(
        `Fant ikke oppgaven fra QR-koden/lenken i klassen din (${student.className}). Sjekk at du er logget inn i riktig klasse og at oppgaven er publisert.`,
      );
    }
  }, [
    loading,
    handledInitialDeepLink,
    initialAssignmentId,
    assignments,
    submissions,
    openAssignment,
    student.className,
  ]);

  // Kopisperre: visibilitychange (tab switch) listener
  useEffect(() => {
    if (!isAnticheat || !selectedAssignmentId) return;

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const event: IntegrityEventRecord = {
          type: 'tab-switch',
          message:
            'Fanebytte registrert under oppgave med aktiv kopisperre.',
          timestamp: new Date().toLocaleTimeString('nb-NO'),
        };
        setTabSwitchCount((c) => c + 1);
        setIntegrityEvents((prev) => [event, ...prev].slice(0, 20));
        setIntegrityWarning(
          'Fanebytte ble registrert. Hold deg i innleveringsfanen mens du skriver.',
        );
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [isAnticheat, selectedAssignmentId]);

  const handleBlockedAction = (
    type: IntegrityEventRecord['type'],
    message: string,
  ) => {
    const event: IntegrityEventRecord = {
      type,
      message,
      timestamp: new Date().toLocaleTimeString('nb-NO'),
    };
    setBlockedActionCount((c) => c + 1);
    setIntegrityEvents((prev) => [event, ...prev].slice(0, 20));
    setIntegrityWarning(message);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    const words = countWords(answerText);
    if (words < selectedAssignment.minWords) {
      setError(
        `Besvarelsen må inneholde minst ${selectedAssignment.minWords} ord (du har ${words} ord).`,
      );
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const saved = await saveStudentSubmission({
        assignment: selectedAssignment,
        student,
        answerText,
        ...(isAnticheat
          ? {
              integrity: {
                tabSwitchCount,
                blockedActionCount,
                events: integrityEvents,
              },
            }
          : {}),
      });

      setSubmitting(false);
      setEvaluatingAI(true);

      try {
        const assessment = await evaluateSubmissionWithAI({
          assignment: selectedAssignment,
          answerText,
          studentName: student.fullName,
        });
        await saveAiAssessment(saved.id, assessment);
      } catch (aiErr) {
        setError(
          `Besvarelsen din er levert og lagret, men AI-sensor kunne ikke vurdere den automatisk akkurat nå (${
            aiErr instanceof Error ? aiErr.message : String(aiErr)
          }). Lærer kan kjøre vurderingen på nytt.`,
        );
      } finally {
        setEvaluatingAI(false);
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
      setEvaluatingAI(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Student Bar */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white">
              {student.fullName}
            </p>
            <p className="text-xs text-slate-400">
              Klasse{' '}
              <span className="font-semibold text-sky-300">
                {student.className}
              </span>{' '}
              • Brukernavn: {student.username}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void signOutUser()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/40 hover:text-rose-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logg ut
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-xs text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {selectedAssignment ? (
        /* =============================================================== */
        /* ASSIGNMENT WORKSPACE VIEW                                       */
        /* =============================================================== */
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => {
              setSelectedAssignmentId(null);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Tilbake til mine oppgaver
          </button>

          {/* Assignment Details Card */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-sky-200">
                    {getGradingScaleLabel(selectedAssignment.gradingScale)}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300">
                    {getSubmissionTypeLabel(selectedAssignment.submissionType)}
                  </span>
                </div>
                <h1 className="font-display text-xl font-extrabold text-white sm:text-2xl">
                  {selectedAssignment.title}
                </h1>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2 text-right">
                <p className="text-[11px] text-slate-400">Tidsfrist</p>
                <p className="text-xs font-semibold text-slate-100">
                  {formatNorwegianDateTime(selectedAssignment.dueDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
                  Oppgavebeskrivelse
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Vurderingskriterier
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  {selectedAssignment.criteria}
                </p>
              </div>
            </div>
          </div>

          {/* Kopisperre status banner */}
          {isAnticheat && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 text-amber-200">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-300" />
                <span>
                  <strong>Kopisperre er aktiv:</strong> Lim inn, kopiering og
                  høyreklikk er deaktivert, og fanebytte loggføres.
                </span>
              </div>
              <span className="text-amber-200/90">
                Fanebytte: {tabSwitchCount} • Blokkert: {blockedActionCount}
              </span>
            </div>
          )}

          {integrityWarning && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{integrityWarning}</span>
            </div>
          )}

          {/* Answer Editor */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="student-answer"
                className="font-display text-sm font-bold text-white"
              >
                Din besvarelse
              </label>
              <span
                className={`text-xs font-semibold ${
                  countWords(answerText) >= selectedAssignment.minWords
                    ? 'text-emerald-300'
                    : 'text-slate-400'
                }`}
              >
                {countWords(answerText)} / min. {selectedAssignment.minWords}{' '}
                ord
              </span>
            </div>

            <textarea
              id="student-answer"
              rows={10}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              onPaste={(e) => {
                if (isAnticheat) {
                  e.preventDefault();
                  handleBlockedAction(
                    'paste-blocked',
                    'Lim inn er blokkert i denne oppgaven.',
                  );
                }
              }}
              onCopy={(e) => {
                if (isAnticheat) {
                  e.preventDefault();
                  handleBlockedAction(
                    'copy-blocked',
                    'Kopiering er blokkert i denne oppgaven.',
                  );
                }
              }}
              onCut={(e) => {
                if (isAnticheat) {
                  e.preventDefault();
                  handleBlockedAction(
                    'cut-blocked',
                    'Klipp ut er blokkert i denne oppgaven.',
                  );
                }
              }}
              onContextMenu={(e) => {
                if (isAnticheat) {
                  e.preventDefault();
                  handleBlockedAction(
                    'contextmenu-blocked',
                    'Høyreklikk er blokkert i denne oppgaven.',
                  );
                }
              }}
              placeholder="Skriv besvarelsen din her med egne ord..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-sm leading-relaxed text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Når du leverer, vurderer AI-sensoren svaret ditt automatisk mot
                oppgaven og vurderingskriteriene.
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || evaluatingAI}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
              >
                {submitting || evaluatingAI ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting
                  ? 'Lagrer innlevering...'
                  : evaluatingAI
                    ? 'AI-sensor vurderer...'
                    : existingSubmission
                      ? 'Lever oppdatert besvarelse'
                      : 'Lever inn og få AI-vurdering'}
              </button>
            </div>
          </div>

          {/* Evaluating indicator */}
          {evaluatingAI && (
            <div className="glass-panel flex items-center gap-3 rounded-2xl border border-sky-400/30 p-5 text-sm text-sky-200">
              <Sparkles className="h-5 w-5 animate-pulse text-sky-400" />
              <span>
                AI-sensoren leser oppgavebeskrivelsen, vurderingskriteriene og
                besvarelsen din...
              </span>
            </div>
          )}

          {/* Existing AI Feedback */}
          {existingSubmission?.aiAssessment && !evaluatingAI && (
            <AiFeedbackCard
              assessment={existingSubmission.aiAssessment}
              teacherGradeOverride={existingSubmission.teacherGradeOverride}
              teacherNote={existingSubmission.teacherNote}
            />
          )}
        </div>
      ) : (
        /* =============================================================== */
        /* STUDENT ASSIGNMENTS LIST                                        */
        /* =============================================================== */
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white">
              Mine innleveringsoppgaver
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Velg en oppgave for å skrive besvarelse og motta vurdering fra
              AI-sensor.
            </p>
          </div>

          {loading ? (
            <div className="glass-panel flex items-center justify-center gap-2 rounded-2xl p-12 text-sm text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
              Laster oppgaver...
            </div>
          ) : assignments.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <ClipboardList className="mx-auto mb-3 h-10 w-10 text-slate-600" />
              <p className="text-sm font-semibold text-slate-200">
                Ingen publiserte oppgaver for {student.className} ennå
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Når læreren publiserer en innleveringsoppgave, dukker den opp
                her.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((a) => {
                const sub = submissions.find((s) => s.assignmentId === a.id);
                const grade =
                  sub?.teacherGradeOverride || sub?.aiAssessment?.gradeLabel;

                return (
                  <div
                    key={a.id}
                    onClick={() => openAssignment(a)}
                    className="glass-panel group cursor-pointer rounded-2xl p-5 transition hover:border-sky-400/45"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-white group-hover:text-sky-200">
                            {a.title}
                          </h3>
                          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                            {getGradingScaleShortLabel(a.gradingScale)}
                          </span>
                          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                            {getSubmissionTypeLabel(a.submissionType)}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs text-slate-300">
                          {a.description}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          Frist: {formatNorwegianDateTime(a.dueDate)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {sub ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Levert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-200">
                            Åpen oppgave
                          </span>
                        )}

                        {grade && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold ${getGradeBadgeStyle(
                              grade,
                              sub?.aiAssessment?.numericScore ?? 50,
                            )}`}
                          >
                            <Award className="h-3.5 w-3.5" />
                            {grade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
