import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  FolderOpen,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  createClass,
  deleteClass,
  listAllAssignments,
  listAllStudents,
  listAllSubmissions,
  listClasses,
  signOutUser,
} from '../services/innleveringService';
import type {
  Assignment,
  Classroom,
  StudentProfile,
  Submission,
} from '../types';
import { AdminClassView } from './AdminClassView';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create class form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [className, setClassName] = useState('');
  const [schoolYear, setSchoolYear] = useState('2026/2027');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [clsList, stuList, assList, subList] = await Promise.all([
        listClasses(),
        listAllStudents(),
        listAllAssignments(),
        listAllSubmissions(),
      ]);
      setClasses(clsList);
      setAllStudents(stuList);
      setAllAssignments(assList);
      setAllSubmissions(subList);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const handleCreateClass = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await createClass({ name: className, schoolYear, description });
      setClassName('');
      setDescription('');
      setShowCreateForm(false);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClass = async (cls: Classroom) => {
    if (
      !window.confirm(
        `Slette klassen "${cls.name}" fra oversikten? (Elever og innleveringer i databasen slettes ikke automatisk.)`,
      )
    ) {
      return;
    }
    setError(null);
    try {
      await deleteClass(cls.id);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Persistent Admin Top Banner */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white">
              Adminpanel • Innleveringsportal
            </p>
            <p className="text-xs text-slate-400">
              Logget inn som{' '}
              <span className="font-semibold text-emerald-300">
                {user.email}
              </span>
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

      {selectedClass ? (
        <AdminClassView
          classroom={selectedClass}
          onBack={() => {
            setSelectedClassId(null);
            void loadOverview();
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-white">
                Klasseoversikt
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Velg en klasse for å administrere oppgaver, elever,
                innleveringer og AI-vurderinger.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-sky-400"
            >
              <Plus className="h-4 w-4" />
              Opprett ny klasse
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-xs text-rose-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Create Class Form */}
          {showCreateForm && (
            <form
              onSubmit={handleCreateClass}
              className="glass-panel rounded-3xl border border-sky-400/30 p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display text-base font-bold text-white">
                  Ny klasse
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Klassenavn
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="F.eks. 1STA eller 1HO"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Skoleår
                  </label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    placeholder="2026/2027"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Beskrivelse (valgfritt)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="F.eks. Naturfag Vg1 studiespesialisering"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Opprett klasse
                </button>
              </div>
            </form>
          )}

          {/* Classes Grid */}
          {loading ? (
            <div className="glass-panel flex items-center justify-center gap-2 rounded-2xl p-12 text-sm text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
              Laster klasser...
            </div>
          ) : classes.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <FolderOpen className="mx-auto mb-3 h-12 w-12 text-slate-600" />
              <h3 className="font-display text-lg font-bold text-white">
                Ingen klasser opprettet ennå
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">
                Opprett din første klasse for å legge inn elever og lage
                innleveringsoppgaver med AI-sensor.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />
                Opprett første klasse
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {classes.map((cls) => {
                const stuCount = allStudents.filter(
                  (s) => s.classId === cls.id,
                ).length;
                const assCount = allAssignments.filter(
                  (a) => a.classId === cls.id,
                ).length;
                const subCount = allSubmissions.filter(
                  (s) => s.classId === cls.id,
                ).length;

                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className="group glass-panel relative flex cursor-pointer flex-col justify-between rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/45 hover:shadow-xl hover:shadow-sky-500/10"
                  >
                    <div>
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
                            {cls.schoolYear}
                          </span>
                          <h3 className="mt-2 font-display text-xl font-extrabold text-white">
                            {cls.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDeleteClass(cls);
                          }}
                          title="Slett klasse"
                          className="rounded-lg p-1.5 text-slate-500 opacity-0 transition hover:bg-slate-800 hover:text-rose-300 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {cls.description && (
                        <p className="mb-4 text-xs leading-relaxed text-slate-400">
                          {cls.description}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                        <div>
                          <p className="font-display text-lg font-bold text-white">
                            {stuCount}
                          </p>
                          <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                            <Users className="h-3 w-3" />
                            Elever
                          </p>
                        </div>
                        <div className="border-x border-slate-800">
                          <p className="font-display text-lg font-bold text-sky-300">
                            {assCount}
                          </p>
                          <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                            <ClipboardList className="h-3 w-3" />
                            Oppgaver
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-lg font-bold text-emerald-300">
                            {subCount}
                          </p>
                          <p className="text-[11px] text-slate-400">Levert</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5 text-xs font-semibold text-sky-300">
                      <span>Åpne klasse</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
