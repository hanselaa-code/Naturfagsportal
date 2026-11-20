import { onAuthStateChanged, type User } from 'firebase/auth';
import { AlertTriangle, Loader2, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { auth } from '../../core/firebase';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import {
  getStudentProfile,
  isAdminUser,
  signOutUser,
} from './services/innleveringService';
import type { StudentProfile } from './types';

export default function InnleveringModule() {
  const { assignmentId } = useParams<{ assignmentId?: string }>();
  const [searchParams] = useSearchParams();
  const preselectedClassId = searchParams.get('klasse') ?? undefined;

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Innlevering | Naturfag Vg1 (NAT01-05)';
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setProfileError(null);

      if (!nextUser) {
        setStudentProfile(null);
        setAuthReady(true);
        return;
      }

      if (isAdminUser(nextUser)) {
        setStudentProfile(null);
        setAuthReady(true);
        return;
      }

      // Non-admin user: fetch their student profile
      setProfileLoading(true);
      try {
        const profile = await getStudentProfile(nextUser.uid);
        if (!profile) {
          setProfileError(
            'Kontoen din er ikke registrert som administrator eller elev i Innleveringsportalen.',
          );
          setStudentProfile(null);
        } else if (!profile.active) {
          setProfileError(
            'Elevkontoen din er deaktivert. Ta kontakt med læreren din.',
          );
          setStudentProfile(null);
        } else {
          setStudentProfile(profile);
        }
      } catch (err) {
        setProfileError(
          err instanceof Error ? err.message : 'Kunne ikke laste elevprofil.',
        );
        setStudentProfile(null);
      } finally {
        setProfileLoading(false);
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!authReady || profileLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-slate-300">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        <p className="text-sm font-medium">Laster innleveringsportalen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginView
        preselectedClassId={preselectedClassId}
        hasDeepLinkAssignment={Boolean(assignmentId)}
      />
    );
  }

  if (isAdminUser(user)) {
    return <AdminDashboard user={user} />;
  }

  if (studentProfile) {
    return (
      <StudentPortal
        student={studentProfile}
        initialAssignmentId={assignmentId}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="glass-panel rounded-3xl p-6 text-center space-y-4">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
        <h2 className="font-display text-lg font-bold text-white">
          Ingen tilgang
        </h2>
        <p className="text-xs leading-relaxed text-slate-300">
          {profileError || 'Du har ikke tilgang med denne kontoen.'}
        </p>
        <button
          type="button"
          onClick={() => void signOutUser()}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4" />
          Logg ut og prøv igjen
        </button>
      </div>
    </div>
  );
}
