import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  UserPlus,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  createAssignment,
  createStudentInClass,
  deleteAssignment,
  listAssignmentsByClass,
  listCredentialsByClass,
  listStudentsByClass,
  listSubmissionsByClass,
  updateAssignment,
} from '../services/innleveringService';
import {
  formatNorwegianDateTime,
  getGradingScaleShortLabel,
  getSubmissionTypeLabel,
  GRADING_SCALE_OPTIONS,
  normalizeUsername,
  SUBMISSION_TYPE_OPTIONS,
  type Assignment,
  type Classroom,
  type GradingScale,
  type StudentCredential,
  type StudentProfile,
  type Submission,
  type SubmissionType,
} from '../types';
import { AdminStudentDetail } from './AdminStudentDetail';
import { getGradeBadgeStyle } from './AiFeedbackCard';

interface AdminClassViewProps {
  classroom: Classroom;
  onBack: () => void;
}

function generateStudentPassword(): string {
  const words = ['Atom', 'Sol', 'DNA', 'Celle', 'Karbon', 'Stjerne', 'Foto'];
  const word = words[Math.floor(Math.random() * words.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${word}${digits}`;
}

export function AdminClassView({ classroom, onBack }: AdminClassViewProps) {
  const [activeTab, setActiveTab] = useState<'assignments' | 'students'>(
    'assignments',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [credentials, setCredentials] = useState<
    Record<string, StudentCredential>
  >({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [selectedStudentUid, setSelectedStudentUid] = useState<string | null>(
    null,
  );
  const [filterAssignmentId, setFilterAssignmentId] = useState<string>('all');

  // Assignment form state
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null,
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submissionType, setSubmissionType] =
    useState<SubmissionType>('anticheat');
  const [gradingScale, setGradingScale] = useState<GradingScale>('grades_1_6');
  const [minWords, setMinWords] = useState(50);
  const [published, setPublished] = useState(true);
  const [savingAssignment, setSavingAssignment] = useState(false);

  // Add student form state
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentFullName, setStudentFullName] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState(
    generateStudentPassword,
  );
  const [savingStudent, setSavingStudent] = useState(false);

  // Bulk import students state
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    done: number;
    total: number;
    created: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const loadClassData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [assList, stuList, credMap, subList] = await Promise.all([
        listAssignmentsByClass(classroom.id, false),
        listStudentsByClass(classroom.id),
        listCredentialsByClass(classroom.id),
        listSubmissionsByClass(classroom.id),
      ]);
      setAssignments(assList);
      setStudents(stuList);
      setCredentials(credMap);
      setSubmissions(subList);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [classroom.id]);

  useEffect(() => {
    void loadClassData();
  }, [loadClassData]);

  const resetAssignmentForm = () => {
    setEditingAssignmentId(null);
    setTitle('');
    setDescription('');
    setCriteria('');
    setDueDate('');
    setSubmissionType('anticheat');
    setGradingScale('grades_1_6');
    setMinWords(50);
    setPublished(true);
    setShowAssignmentForm(false);
  };

  const openEditAssignment = (a: Assignment) => {
    setEditingAssignmentId(a.id);
    setTitle(a.title);
    setDescription(a.description);
    setCriteria(a.criteria);
    setDueDate(a.dueDate ? a.dueDate.slice(0, 16) : '');
    setSubmissionType(a.submissionType);
    setGradingScale(a.gradingScale);
    setMinWords(a.minWords);
    setPublished(a.published);
    setShowAssignmentForm(true);
  };

  const handleSaveAssignment = async (e: FormEvent) => {
    e.preventDefault();
    setSavingAssignment(true);
    setError(null);
    try {
      const isoDue = dueDate ? new Date(dueDate).toISOString() : '';
      if (editingAssignmentId) {
        await updateAssignment(editingAssignmentId, {
          title: title.trim(),
          description: description.trim(),
          criteria: criteria.trim(),
          dueDate: isoDue,
          submissionType,
          gradingScale,
          minWords,
          published,
        });
      } else {
        await createAssignment({
          classId: classroom.id,
          title,
          description,
          criteria,
          dueDate: isoDue,
          submissionType,
          gradingScale,
          minWords,
          published,
        });
      }
      resetAssignmentForm();
      await loadClassData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleTogglePublished = async (a: Assignment) => {
    setError(null);
    try {
      await updateAssignment(a.id, { published: !a.published });
      await loadClassData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteAssignment = async (a: Assignment) => {
    if (
      !window.confirm(
        `Slette oppgaven "${a.title}"? Eksisterende innleveringer forblir lagret i databasen.`,
      )
    ) {
      return;
    }
    setError(null);
    try {
      await deleteAssignment(a.id);
      await loadClassData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCreateStudent = async (e: FormEvent) => {
    e.preventDefault();
    setSavingStudent(true);
    setError(null);
    try {
      await createStudentInClass({
        classId: classroom.id,
        className: classroom.name,
        fullName: studentFullName,
        username: studentUsername,
        password: studentPassword,
      });
      setStudentFullName('');
      setStudentUsername('');
      setStudentPassword(generateStudentPassword());
      setShowStudentForm(false);
      await loadClassData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingStudent(false);
    }
  };

  const handleBulkImport = async (e: FormEvent) => {
    e.preventDefault();
    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    setBulkImporting(true);
    setError(null);
    const errors: string[] = [];
    let created = 0;
    let skipped = 0;
    setBulkProgress({ done: 0, total: lines.length, created: 0, skipped: 0, errors: [] });

    for (let i = 0; i < lines.length; i += 1) {
      const parts = lines[i]
        .split(/[,;\t|]+/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length < 2) {
        errors.push(`Linje ${i + 1} hoppet over (må ha minst brukernavn og passord): "${lines[i]}"`);
        skipped += 1;
      } else {
        const fullName = parts.length >= 3 ? parts[0] : parts[0];
        const username = parts.length >= 3 ? parts[1] : parts[0];
        const password = parts.length >= 3 ? parts[2] : parts[1];

        try {
          await createStudentInClass({
            classId: classroom.id,
            className: classroom.name,
            fullName,
            username,
            password,
          });
          created += 1;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`${username}: ${msg}`);
          skipped += 1;
        }
      }

      setBulkProgress({
        done: i + 1,
        total: lines.length,
        created,
        skipped,
        errors: [...errors],
      });
    }

    setBulkImporting(false);
    await loadClassData();
  };

  const selectedStudent = students.find((s) => s.uid === selectedStudentUid);
  if (selectedStudent) {
    return (
      <AdminStudentDetail
        student={selectedStudent}
        credential={credentials[selectedStudent.uid]}
        assignments={assignments}
        submissions={submissions.filter(
          (sub) => sub.studentUid === selectedStudent.uid,
        )}
        onBack={() => setSelectedStudentUid(null)}
        onDataChanged={loadClassData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Tilbake til alle klasser
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-extrabold text-white">
              Klasse {classroom.name}
            </h2>
            <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-0.5 text-xs font-semibold text-slate-300">
              {classroom.schoolYear}
            </span>
          </div>
          {classroom.description && (
            <p className="mt-1 text-xs text-slate-400">
              {classroom.description}
            </p>
          )}
        </div>

        {/* Clean Tab Switcher */}
        <div className="inline-flex rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'assignments'
                ? 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Oppgaveverktøy ({assignments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'students'
                ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            Elever & Innleveringer ({students.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="glass-panel flex items-center justify-center gap-2 rounded-2xl p-12 text-sm text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
          Laster klassedata...
        </div>
      ) : activeTab === 'assignments' ? (
        /* =============================================================== */
        /* TAB 1: OPPGAVEVERKTØY                                           */
        /* =============================================================== */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Oppgaveverktøy
              </h3>
              <p className="text-xs text-slate-400">
                Sett opp oppgavebeskrivelse, vurderingskriterier, tidsfrist,
                innleveringstype og vurderingsskala for AI-sensor.
              </p>
            </div>
            {!showAssignmentForm && (
              <button
                type="button"
                onClick={() => setShowAssignmentForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />
                Ny innleveringsoppgave
              </button>
            )}
          </div>

          {showAssignmentForm && (
            <form
              onSubmit={handleSaveAssignment}
              className="glass-panel rounded-3xl p-6 space-y-5 border border-sky-400/30"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-display text-base font-bold text-white">
                  {editingAssignmentId
                    ? 'Rediger oppgave'
                    : 'Opprett ny innleveringsoppgave'}
                </h4>
                <button
                  type="button"
                  onClick={resetAssignmentForm}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Oppgavetittel
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="F.eks. Big Bang og kosmisk bakgrunnsstråling"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Tidsfrist
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Minimum antall ord
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    value={minWords}
                    onChange={(e) => setMinWords(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Innleveringstype */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Innleveringstype
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {SUBMISSION_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSubmissionType(opt.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        submissionType === opt.value
                          ? 'border-sky-400/60 bg-sky-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vurderingsskala for AI-sensor */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  Vurderingsskala for AI-sensor
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {GRADING_SCALE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setGradingScale(opt.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        gradingScale === opt.value
                          ? 'border-emerald-400/60 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selve oppgaven */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Selve oppgaven (oppgavebeskrivelse til eleven og AI-sensor)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beskriv oppgaven tydelig. AI-sensoren leser denne teksten sammen med vurderingskriteriene."
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                />
              </div>

              {/* Vurderingskriterier */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Vurderingskriterier (hva AI-sensor skal vurdere etter)
                </label>
                <textarea
                  rows={4}
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder={
                    '- Forklarer sentrale fagbegreper presist\n- Bruker konkrete eksempler fra naturfag\n- Viser sammenheng mellom årsak og virkning\n- Strukturert og selvstendig fremstilling'
                  }
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 accent-sky-500"
                  />
                  Publiser oppgaven umiddelbart (synlig for elevene i{' '}
                  {classroom.name})
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAssignmentForm}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={savingAssignment}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                  >
                    {savingAssignment && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {editingAssignmentId ? 'Lagre endringer' : 'Opprett oppgave'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Assignment List */}
          {assignments.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <ClipboardList className="mx-auto mb-3 h-10 w-10 text-slate-600" />
              <p className="text-sm font-semibold text-slate-200">
                Ingen innleveringsoppgaver i {classroom.name} ennå
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Klikk «Ny innleveringsoppgave» for å sette opp oppgave,
                vurderingskriterier, frist og vurderingsskala.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((a) => {
                const subCount = submissions.filter(
                  (s) => s.assignmentId === a.id,
                ).length;

                return (
                  <div
                    key={a.id}
                    className="glass-panel rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display text-base font-bold text-white">
                            {a.title}
                          </h4>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                              a.published
                                ? 'border-emerald-400/35 bg-emerald-500/15 text-emerald-200'
                                : 'border-slate-700 bg-slate-800 text-slate-400'
                            }`}
                          >
                            {a.published ? 'Publisert' : 'Utkast (skjult)'}
                          </span>
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-200">
                            {getGradingScaleShortLabel(a.gradingScale)}
                          </span>
                          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300">
                            {getSubmissionTypeLabel(a.submissionType)}
                          </span>
                        </div>
                        <p className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                            Frist: {formatNorwegianDateTime(a.dueDate)}
                          </span>
                          <span>Min. {a.minWords} ord</span>
                          <span className="font-semibold text-slate-200">
                            {subCount} / {students.length} levert
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(a)}
                          title={a.published ? 'Skjul for elever' : 'Publiser'}
                          className="rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-slate-300 hover:border-sky-400/40 hover:text-white"
                        >
                          {a.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditAssignment(a)}
                          title="Rediger oppgave"
                          className="rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-slate-300 hover:border-sky-400/40 hover:text-white"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(a)}
                          title="Slett oppgave"
                          className="rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-slate-400 hover:border-rose-500/40 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Oppgavebeskrivelse
                        </p>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-200 line-clamp-4">
                          {a.description}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Vurderingskriterier
                        </p>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-200 line-clamp-4">
                          {a.criteria}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* =============================================================== */
        /* TAB 2: ELEVER & INNLEVERINGER                                   */
        /* =============================================================== */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Elever & Innleveringer i {classroom.name}
              </h3>
              <p className="text-xs text-slate-400">
                Opprett elevkontoer (brukernavn + passord), se innleveringsstatus
                og AI-tilbakemeldinger. Klikk på en elev for full fremgang.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {assignments.length > 0 && (
                <select
                  value={filterAssignmentId}
                  onChange={(e) => setFilterAssignmentId(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-400"
                >
                  <option value="all">Alle oppgaver ({assignments.length})</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowBulkImport((prev) => !prev);
                  setShowStudentForm(false);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-xs font-bold text-sky-200 transition hover:bg-sky-500/25"
              >
                <Upload className="h-4 w-4" />
                Masseimporter
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowStudentForm((prev) => !prev);
                  setShowBulkImport(false);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                <UserPlus className="h-4 w-4" />
                Legg til elev
              </button>
            </div>
          </div>

          {/* Bulk Import Students Form */}
          {showBulkImport && (
            <form
              onSubmit={handleBulkImport}
              className="glass-panel rounded-3xl border border-sky-400/30 p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-display text-sm font-bold text-white">
                    Masseimporter elever til {classroom.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Én elev per linje på formatet <code>Brukernavn, Passord</code>{' '}
                    (eller <code>Fullt navn, Brukernavn, Passord</code>). Korte
                    1-ords passord som «sol» støttes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkImport(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <textarea
                rows={8}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={'Simba, sol\nNala, vind\nElsa, snø'}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 font-mono text-xs text-white outline-none focus:border-sky-400"
              />

              {bulkProgress && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-1.5">
                  <p className="font-semibold text-slate-200">
                    Fremdrift: {bulkProgress.done} / {bulkProgress.total} •{' '}
                    <span className="text-emerald-300">
                      {bulkProgress.created} opprettet
                    </span>
                    {bulkProgress.skipped > 0 && (
                      <span className="text-amber-300">
                        {' '}
                        • {bulkProgress.skipped} hoppet over
                      </span>
                    )}
                  </p>
                  {bulkProgress.errors.length > 0 && (
                    <ul className="max-h-24 overflow-y-auto space-y-0.5 text-[11px] text-amber-200">
                      {bulkProgress.errors.map((e, idx) => (
                        <li key={idx}>• {e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkImport(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Lukk
                </button>
                <button
                  type="submit"
                  disabled={bulkImporting}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {bulkImporting && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {bulkImporting ? 'Importerer...' : 'Importer alle elever'}
                </button>
              </div>
            </form>
          )}

          {/* Add Student Form */}
          {showStudentForm && (
            <form
              onSubmit={handleCreateStudent}
              className="glass-panel rounded-3xl border border-emerald-400/30 p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-display text-sm font-bold text-white">
                  Opprett elevkonto i {classroom.name}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Fullt navn
                  </label>
                  <input
                    type="text"
                    value={studentFullName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStudentFullName(val);
                      if (!studentUsername) {
                        setStudentUsername(
                          normalizeUsername(val.replace(/\s+/g, '.')),
                        );
                      }
                    }}
                    placeholder="F.eks. Ola Nordmann"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Brukernavn
                  </label>
                  <input
                    type="text"
                    value={studentUsername}
                    onChange={(e) => setStudentUsername(e.target.value)}
                    placeholder="ola.nordmann"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Passord (minst 2 tegn)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                      minLength={2}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 font-mono text-sm text-white outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setStudentPassword(generateStudentPassword())
                      }
                      title="Generer nytt passord"
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 text-slate-300 hover:border-emerald-400/40 hover:text-white"
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {savingStudent && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Opprett elev
                </button>
              </div>
            </form>
          )}

          {/* Students Overview Table */}
          {students.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-slate-600" />
              <p className="text-sm font-semibold text-slate-200">
                Ingen elever registrert i {classroom.name} ennå
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Klikk «Legg til elev» for å opprette brukernavn og passord for
                elevene i klassen.
              </p>
            </div>
          ) : (
            <div className="glass-panel overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3.5">Elev</th>
                      <th className="px-5 py-3.5">Brukernavn / Passord</th>
                      <th className="px-5 py-3.5">Innleveringer</th>
                      <th className="px-5 py-3.5">AI-vurdering & tilbakemelding</th>
                      <th className="px-5 py-3.5 text-right">Detaljer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {students.map((stu) => {
                      const stuSubs = submissions.filter(
                        (s) => s.studentUid === stu.uid,
                      );
                      const filteredSub =
                        filterAssignmentId === 'all'
                          ? stuSubs[0]
                          : stuSubs.find(
                              (s) => s.assignmentId === filterAssignmentId,
                            );
                      const cred = credentials[stu.uid];
                      const pct =
                        assignments.length > 0
                          ? Math.round(
                              (stuSubs.length / assignments.length) * 100,
                            )
                          : 0;

                      return (
                        <tr
                          key={stu.uid}
                          onClick={() => setSelectedStudentUid(stu.uid)}
                          className="cursor-pointer transition hover:bg-slate-800/40"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">
                              {stu.fullName}
                            </div>
                            {!stu.active && (
                              <span className="text-[11px] text-rose-400">
                                Deaktivert
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-mono text-xs text-slate-200">
                              {stu.username}
                            </div>
                            {cred && (
                              <div className="font-mono text-[11px] text-slate-500">
                                Pass: {cred.password}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {filterAssignmentId === 'all' ? (
                              <div className="w-32 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-slate-200">
                                    {stuSubs.length} / {assignments.length}
                                  </span>
                                  <span className="text-slate-400">{pct}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className="h-full rounded-full bg-sky-400"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            ) : filteredSub ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-200">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Levert
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                                <Clock className="h-3.5 w-3.5" />
                                Ikke levert
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 max-w-md">
                            {filteredSub?.aiAssessment ? (
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-bold ${getGradeBadgeStyle(
                                      filteredSub.teacherGradeOverride ||
                                        filteredSub.aiAssessment.gradeLabel,
                                      filteredSub.aiAssessment.numericScore,
                                    )}`}
                                  >
                                    <Award className="h-3 w-3" />
                                    {filteredSub.teacherGradeOverride ||
                                      filteredSub.aiAssessment.gradeLabel}
                                  </span>
                                  <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                    {filteredSub.assignmentTitle}
                                  </span>
                                </div>
                                <p className="line-clamp-1 text-xs text-slate-300">
                                  {filteredSub.aiAssessment.summary}
                                </p>
                              </div>
                            ) : filteredSub ? (
                              <span className="text-xs text-amber-300">
                                Levert – venter på AI-sensor
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Ingen innlevering ennå
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-sky-300">
                              Åpne
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
