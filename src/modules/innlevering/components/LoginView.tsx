import {
  AlertTriangle,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  LogIn,
  ShieldCheck,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  listClasses,
  signInAdminWithGoogle,
  signInStudent,
} from '../services/innleveringService';
import { ADMIN_EMAIL, type Classroom } from '../types';

interface LoginViewProps {
  preselectedClassId?: string;
  hasDeepLinkAssignment?: boolean;
}

export function LoginView({
  preselectedClassId,
  hasDeepLinkAssignment = false,
}: LoginViewProps) {
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingClasses(true);
        setClassesError(null);
        const result = await listClasses();
        if (!mounted) return;
        setClasses(result);
        if (result.length > 0) {
          const matching = preselectedClassId
            ? result.find((c) => c.id === preselectedClassId)
            : undefined;
          setSelectedClassId(matching ? matching.id : result[0].id);
        }
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        setClassesError(
          msg.includes('permission') || msg.includes('PERMISSION_DENIED')
            ? 'Kunne ikke hente klasseliste. Sjekk at Firestore og sikkerhetsregler er aktivert i Firebase.'
            : 'Kunne ikke laste klasser fra databasen ennå. Logg inn som admin for å sette opp første klasse.',
        );
      } finally {
        if (mounted) setLoadingClasses(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [preselectedClassId]);

  const handleStudentLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInStudent(selectedClassId, username, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes('auth/invalid-credential') ||
        msg.includes('auth/wrong-password') ||
        msg.includes('auth/user-not-found')
      ) {
        setError(
          'Feil klasse, brukernavn eller passord. Dobbeltsjekk opplysningene fra lærer.',
        );
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInAdminWithGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/popup-closed-by-user')) {
        setError('Innloggingsvinduet ble lukket før innloggingen var ferdig.');
      } else if (msg.includes('auth/unauthorized-domain')) {
        setError(
          'Domenet er ikke godkjent for Google-innlogging i Firebase Console (Authentication → Settings → Authorized domains).',
        );
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10 sm:py-16">
      <div className="glass-panel w-full rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">
            Innleveringsportal
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Naturfag Vg1 (NAT01-05) • Oppgaver og AI-sensor
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('student');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              mode === 'student'
                ? 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            Elevinnlogging
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              mode === 'admin'
                ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin (Lærer)
          </button>
        </div>

        {/* Deep-link notice when opened via QR code / Teams link */}
        {hasDeepLinkAssignment && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-sky-400/35 bg-sky-500/10 p-3.5 text-xs leading-relaxed text-sky-200">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
            <span>
              <strong>Innleveringsoppgave via QR-kode/lenke:</strong> Logg inn
              med klassen din, brukernavn og passord for å gå rett inn i
              oppgaven.
            </span>
          </div>
        )}

        {/* Error Box */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'student' ? (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            {/* Class selector */}
            <div>
              <label
                htmlFor="student-class"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Velg klasse
              </label>
              {loadingClasses ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-3 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                  Laster klasser...
                </div>
              ) : classes.length === 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-xs text-amber-200">
                  {classesError ||
                    'Ingen klasser er opprettet ennå. Lærer må først logge inn i adminpanelet og opprette klasse og elever.'}
                </div>
              ) : (
                <select
                  id="student-class"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.schoolYear})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="student-username"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Brukernavn
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="student-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="F.eks. ola.nordmann"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pr-3.5 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="student-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Passord
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="student-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Skriv inn passord fra lærer"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pr-11 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Skjul passord' : 'Vis passord'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || classes.length === 0}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Logg inn som elev
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-sm text-slate-300">
              <p className="font-semibold text-emerald-200 mb-1">
                Administrator-tilgang
              </p>
              <p className="text-xs leading-relaxed text-slate-300">
                Logg inn med Google-kontoen{' '}
                <span className="font-semibold text-white">{ADMIN_EMAIL}</span>{' '}
                for å administrere klasser, elevkontoer, innleveringsoppgaver,
                vurderingskriterier og AI-sensor.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-700" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
              )}
              Logg inn med Google (Admin)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
