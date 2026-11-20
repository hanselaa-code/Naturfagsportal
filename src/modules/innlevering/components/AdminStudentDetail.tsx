import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  RefreshCw,
  Save,
  ShieldAlert,
  Sparkles,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import { evaluateSubmissionWithAI } from '../services/aiSensorService';
import {
  saveAiAssessment,
  saveTeacherReview,
  toggleStudentActive,
} from '../services/innleveringService';
import {
  formatNorwegianDateTime,
  getGradingScaleShortLabel,
  getSubmissionTypeLabel,
  type Assignment,
  type StudentCredential,
  type StudentProfile,
  type Submission,
} from '../types';
import { AiFeedbackCard, getGradeBadgeStyle } from './AiFeedbackCard';

interface AdminStudentDetailProps {
  student: StudentProfile;
  credential?: StudentCredential;
  assignments: Assignment[];
  submissions: Submission[];
  onBack: () => void;
  onDataChanged: () => Promise<void>;
}

export function AdminStudentDetail({
  student,
  credential,
  assignments,
  submissions,
  onBack,
  onDataChanged,
}: AdminStudentDetailProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [togglingActive, setTogglingActive] = useState(false);
  const [reEvaluatingId, setReEvaluatingId] = useState<string | null>(null);
  const [savingReviewId, setSavingReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Per-submission teacher review drafts
  const [reviewDrafts, setReviewDrafts] = useState<
    Record<string, { note: string; override: string }>
  >({});

  const submissionByAssignment = new Map<string, Submission>();
  submissions.forEach((s) => submissionByAssignment.set(s.assignmentId, s));

  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter((a) =>
    submissionByAssignment.has(a.id),
  ).length;
  const completionPct =
    totalAssignments > 0
      ? Math.round((submittedCount / totalAssignments) * 100)
      : 0;

  const assessedSubmissions = submissions.filter((s) => s.aiAssessment);
  const averageScore =
    assessedSubmissions.length > 0
      ? Math.round(
          assessedSubmissions.reduce(
            (sum, s) => sum + (s.aiAssessment?.numericScore ?? 0),
            0,
          ) / assessedSubmissions.length,
        )
      : null;

  const totalIntegrityFlags = submissions.reduce(
    (sum, s) =>
      sum +
      (s.integrity?.tabSwitchCount ?? 0) +
      (s.integrity?.blockedActionCount ?? 0),
    0,
  );

  const handleCopy = (label: string, value: string) => {
    void navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleToggleActive = async () => {
    setTogglingActive(true);
    setError(null);
    try {
      await toggleStudentActive(student.uid, !student.active);
      await onDataChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setTogglingActive(false);
    }
  };

  const handleReEvaluate = async (
    assignment: Assignment,
    submission: Submission,
  ) => {
    setReEvaluatingId(submission.id);
    setError(null);
    try {
      const assessment = await evaluateSubmissionWithAI({
        assignment,
        answerText: submission.answerText,
        studentName: student.fullName,
      });
      await saveAiAssessment(submission.id, assessment);
      await onDataChanged();
    } catch (err) {
      setError(
        `AI-sensor feilet: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setReEvaluatingId(null);
    }
  };

  const getDraft = (sub: Submission) =>
    reviewDrafts[sub.id] ?? {
      note: sub.teacherNote ?? '',
      override: sub.teacherGradeOverride ?? '',
    };

  const handleSaveReview = async (sub: Submission) => {
    const draft = getDraft(sub);
    setSavingReviewId(sub.id);
    setError(null);
    try {
      await saveTeacherReview(sub.id, draft.note, draft.override);
      await onDataChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingReviewId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-400/40 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake til elevoversikt
        </button>

        <button
          type="button"
          onClick={handleToggleActive}
          disabled={togglingActive}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
            student.active
              ? 'border-rose-500/35 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
              : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
          }`}
        >
          {togglingActive ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : student.active ? (
            <UserX className="h-3.5 w-3.5" />
          ) : (
            <UserCheck className="h-3.5 w-3.5" />
          )}
          {student.active ? 'Deaktiver elevkonto' : 'Aktiver elevkonto'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Student Header + Credentials */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
                Klasse {student.className}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  student.active
                    ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                    : 'border-rose-400/30 bg-rose-500/15 text-rose-300'
                }`}
              >
                {student.active ? 'Aktiv konto' : 'Deaktivert'}
              </span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              {student.fullName}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Opprettet {formatNorwegianDateTime(student.createdAt)}
            </p>
          </div>

          {/* Admin-only login credentials card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 min-w-[260px]">
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <KeyRound className="h-3.5 w-3.5 text-sky-400" />
              Innloggingsdetaljer (kun admin)
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Brukernavn:</span>
                <div className="flex items-center gap-1.5">
                  <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-slate-100">
                    {student.username}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy('user', student.username)}
                    className="text-slate-400 hover:text-white"
                    title="Kopier brukernavn"
                  >
                    {copiedField === 'user' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              {credential && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Passord:</span>
                  <div className="flex items-center gap-1.5">
                    <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-slate-100">
                      {showPassword ? credential.password : '••••••••'}
                    </code>
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="text-slate-400 hover:text-white"
                      title={showPassword ? 'Skjul passord' : 'Vis passord'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy('pass', credential.password)}
                      className="text-slate-400 hover:text-white"
                      title="Kopier passord"
                    >
                      {copiedField === 'pass' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Fullføringsgrad
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-white">
              {completionPct}%
            </p>
            <p className="text-xs text-slate-400">
              {submittedCount} av {totalAssignments} oppgaver
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Snitt AI-skår
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-sky-300">
              {averageScore !== null ? `${averageScore}/100` : '–'}
            </p>
            <p className="text-xs text-slate-400">
              {assessedSubmissions.length} vurderte
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Siste vurdering
            </p>
            <p className="mt-1 font-display text-xl font-extrabold text-emerald-300 truncate">
              {submissions[0]?.teacherGradeOverride ||
                submissions[0]?.aiAssessment?.gradeLabel ||
                '–'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {submissions[0]?.assignmentTitle || 'Ingen innleveringer'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Kopisperre-varsler
            </p>
            <p
              className={`mt-1 font-display text-2xl font-extrabold ${
                totalIntegrityFlags > 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {totalIntegrityFlags}
            </p>
            <p className="text-xs text-slate-400">Fanebytte / blokkeringer</p>
          </div>
        </div>
      </div>

      {/* Assignment-by-assignment detailed progress */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-white">
          Detaljert fremgang per oppgave
        </h3>

        {assignments.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-sm text-slate-400">
            Det er ikke opprettet noen oppgaver i denne klassen ennå.
          </div>
        ) : (
          assignments.map((assignment) => {
            const sub = submissionByAssignment.get(assignment.id);
            const draft = sub ? getDraft(sub) : null;

            return (
              <div
                key={assignment.id}
                className="glass-panel rounded-2xl p-5 space-y-4"
              >
                {/* Assignment header row */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-base font-bold text-white">
                        {assignment.title}
                      </h4>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                        {getGradingScaleShortLabel(assignment.gradingScale)}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                        {getSubmissionTypeLabel(assignment.submissionType)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Frist: {formatNorwegianDateTime(assignment.dueDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!sub ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Ikke levert
                      </span>
                    ) : (
                      <>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                            sub.isLate
                              ? 'border-amber-400/35 bg-amber-500/15 text-amber-200'
                              : 'border-emerald-400/35 bg-emerald-500/15 text-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {sub.isLate ? 'Levert etter frist' : 'Levert i tide'}
                        </span>
                        {(sub.teacherGradeOverride ||
                          sub.aiAssessment?.gradeLabel) && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getGradeBadgeStyle(
                              sub.teacherGradeOverride ||
                                sub.aiAssessment!.gradeLabel,
                              sub.aiAssessment?.numericScore ?? 50,
                            )}`}
                          >
                            <Award className="h-3.5 w-3.5" />
                            {sub.teacherGradeOverride ||
                              sub.aiAssessment!.gradeLabel}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {sub && (
                  <div className="space-y-4">
                    {/* Submission Metadata + Integrity */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-sky-400" />
                          {sub.wordCount} ord • Levert{' '}
                          {formatNorwegianDateTime(sub.submittedAt)}
                        </span>
                        {sub.integrity && (
                          <span
                            className={`inline-flex items-center gap-1 ${
                              sub.integrity.tabSwitchCount > 0 ||
                              sub.integrity.blockedActionCount > 0
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                            }`}
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Fanebytte: {sub.integrity.tabSwitchCount} •
                            Blokkert: {sub.integrity.blockedActionCount}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleReEvaluate(assignment, sub)}
                        disabled={reEvaluatingId === sub.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/35 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/20 disabled:opacity-50"
                      >
                        {reEvaluatingId === sub.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        {sub.aiAssessment
                          ? 'Kjør AI-sensor på nytt'
                          : 'Kjør AI-sensor nå'}
                      </button>
                    </div>

                    {/* Student Answer */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Elevens besvarelse
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                        {sub.answerText}
                      </p>
                    </div>

                    {/* AI Feedback */}
                    {sub.aiAssessment ? (
                      <AiFeedbackCard
                        assessment={sub.aiAssessment}
                        teacherGradeOverride={sub.teacherGradeOverride}
                        teacherNote={sub.teacherNote}
                      />
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                        <Sparkles className="h-4 w-4 shrink-0" />
                        <span>
                          Ingen AI-vurdering lagret ennå. Klikk «Kjør AI-sensor
                          nå» for å generere vurdering.
                        </span>
                      </div>
                    )}

                    {/* Teacher Note / Override */}
                    {draft && (
                      <div className="rounded-xl border border-violet-400/25 bg-violet-500/5 p-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                          Lærervurdering / overstyring (valgfritt)
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <label className="mb-1 block text-[11px] text-slate-400">
                              Overstyr karakter/nivå
                            </label>
                            <input
                              type="text"
                              value={draft.override}
                              onChange={(e) =>
                                setReviewDrafts((prev) => ({
                                  ...prev,
                                  [sub.id]: {
                                    ...draft,
                                    override: e.target.value,
                                  },
                                }))
                              }
                              placeholder="F.eks. 5- eller Bestått"
                              className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white outline-none focus:border-violet-400"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-[11px] text-slate-400">
                              Kommentar til eleven
                            </label>
                            <input
                              type="text"
                              value={draft.note}
                              onChange={(e) =>
                                setReviewDrafts((prev) => ({
                                  ...prev,
                                  [sub.id]: { ...draft, note: e.target.value },
                                }))
                              }
                              placeholder="Skriv eventuell tilbakemelding fra lærer..."
                              className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white outline-none focus:border-violet-400"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSaveReview(sub)}
                            disabled={savingReviewId === sub.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-violet-400 disabled:opacity-50"
                          >
                            {savingReviewId === sub.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Save className="h-3.5 w-3.5" />
                            )}
                            Lagre lærervurdering
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
