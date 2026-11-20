import { deleteApp, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../../../core/firebase';
import {
  ADMIN_EMAIL,
  buildStudentAuthEmail,
  buildStudentAuthPassword,
  countWords,
  normalizeUsername,
  type AiAssessment,
  type Assignment,
  type Classroom,
  type GradingScale,
  type IntegrityReport,
  type StudentCredential,
  type StudentProfile,
  type Submission,
  type SubmissionType,
} from '../types';

export function isAdminUser(user: User | null): boolean {
  return (
    Boolean(user?.email) && user!.email!.toLowerCase() === ADMIN_EMAIL
  );
}

export async function signInAdminWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
    login_hint: ADMIN_EMAIL,
  });

  const credential = await signInWithPopup(auth, provider);
  if (!isAdminUser(credential.user)) {
    await signOut(auth);
    throw new Error(
      `Tilgang avslått. Kun administrator (${ADMIN_EMAIL}) kan logge inn i adminpanelet.`,
    );
  }
  return credential.user;
}

export async function signInStudent(
  classId: string,
  username: string,
  password: string,
): Promise<StudentProfile> {
  const cleanUsername = normalizeUsername(username);
  if (!classId || !cleanUsername || !password) {
    throw new Error('Velg klasse og fyll inn både brukernavn og passord.');
  }

  const email = buildStudentAuthEmail(cleanUsername, classId);
  const wrappedPassword = buildStudentAuthPassword(password);

  let credential;
  try {
    credential = await signInWithEmailAndPassword(auth, email, wrappedPassword);
  } catch (err) {
    // Fallback for any legacy accounts created with raw >= 6-char password
    if (password.trim().length >= 6) {
      credential = await signInWithEmailAndPassword(
        auth,
        email,
        password.trim(),
      );
    } else {
      throw err;
    }
  }

  const profile = await getStudentProfile(credential.user.uid);
  if (!profile) {
    await signOut(auth);
    throw new Error(
      'Elevprofil ble ikke funnet. Kontakt lærer for å få sjekket kontoen din.',
    );
  }
  if (!profile.active) {
    await signOut(auth);
    throw new Error(
      'Denne elevkontoen er deaktivert av lærer. Kontakt lærer for hjelp.',
    );
  }
  return profile;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

export async function listClasses(): Promise<Classroom[]> {
  const q = query(collection(db, 'classes'), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Classroom, 'id'>),
  }));
}

export async function createClass(input: {
  name: string;
  schoolYear: string;
  description?: string;
}): Promise<Classroom> {
  const name = input.name.trim();
  const schoolYear = input.schoolYear.trim() || '2026/2027';
  const description = (input.description ?? '').trim();
  if (!name) throw new Error('Klassenavn kan ikke være tomt.');

  const payload = {
    name,
    schoolYear,
    description,
    createdAt: new Date().toISOString(),
  };

  const ref = await addDoc(collection(db, 'classes'), payload);
  return { id: ref.id, ...payload };
}

export async function deleteClass(classId: string): Promise<void> {
  await deleteDoc(doc(db, 'classes', classId));
}

// ---------------------------------------------------------------------------
// Students (Admin creates Firebase Auth accounts without signing out admin!)
// ---------------------------------------------------------------------------

export async function getStudentProfile(
  uid: string,
): Promise<StudentProfile | null> {
  const snap = await getDoc(doc(db, 'students', uid));
  if (!snap.exists()) return null;
  return snap.data() as StudentProfile;
}

export async function listStudentsByClass(
  classId: string,
): Promise<StudentProfile[]> {
  const q = query(
    collection(db, 'students'),
    where('classId', '==', classId),
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => d.data() as StudentProfile);
  return items.sort((a, b) => a.fullName.localeCompare(b.fullName, 'nb-NO'));
}

export async function listAllStudents(): Promise<StudentProfile[]> {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs.map((d) => d.data() as StudentProfile);
}

export async function listCredentialsByClass(
  classId: string,
): Promise<Record<string, StudentCredential>> {
  const q = query(
    collection(db, 'adminStudentCredentials'),
    where('classId', '==', classId),
  );
  const snap = await getDocs(q);
  const map: Record<string, StudentCredential> = {};
  snap.docs.forEach((d) => {
    const data = d.data() as Omit<StudentCredential, 'uid'>;
    map[d.id] = { uid: d.id, ...data };
  });
  return map;
}

export async function createStudentInClass(input: {
  classId: string;
  className: string;
  fullName: string;
  username: string;
  password: string;
}): Promise<{ profile: StudentProfile; credential: StudentCredential }> {
  const fullName = input.fullName.trim();
  const username = normalizeUsername(input.username);
  const password = input.password.trim();

  if (!fullName) throw new Error('Fullt navn må fylles ut.');
  if (username.length < 2) {
    throw new Error('Brukernavn må være minst 2 tegn (bokstaver/tall).');
  }
  if (password.length < 2) {
    throw new Error('Passord må være minst 2 tegn.');
  }

  const authEmail = buildStudentAuthEmail(username, input.classId);
  const authPassword = buildStudentAuthPassword(password);

  // Use an isolated secondary Firebase app so creating a student account
  // does NOT sign out the currently logged-in admin user.
  const secondaryAppName = `student-creator-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);

  let createdUid = '';
  try {
    const userCred = await createUserWithEmailAndPassword(
      secondaryAuth,
      authEmail,
      authPassword,
    );
    createdUid = userCred.user.uid;
    await signOut(secondaryAuth);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('auth/email-already-in-use')) {
      throw new Error(
        `Brukernavnet "${username}" finnes allerede i klassen ${input.className}. Velg et annet brukernavn.`,
      );
    }
    throw err;
  } finally {
    await deleteApp(secondaryApp);
  }

  const now = new Date().toISOString();
  const profile: StudentProfile = {
    uid: createdUid,
    classId: input.classId,
    className: input.className,
    fullName,
    username,
    authEmail,
    active: true,
    createdAt: now,
  };

  const credentialPayload = {
    classId: input.classId,
    fullName,
    username,
    password,
    updatedAt: now,
  };

  await setDoc(doc(db, 'students', createdUid), profile);
  await setDoc(
    doc(db, 'adminStudentCredentials', createdUid),
    credentialPayload,
  );

  return { profile, credential: { uid: createdUid, ...credentialPayload } };
}

export async function toggleStudentActive(
  uid: string,
  active: boolean,
): Promise<void> {
  await updateDoc(doc(db, 'students', uid), { active });
}

export async function removeStudentRecord(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'students', uid));
  await deleteDoc(doc(db, 'adminStudentCredentials', uid));
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

export async function listAssignmentsByClass(
  classId: string,
  onlyPublished = false,
): Promise<Assignment[]> {
  const constraints = onlyPublished
    ? [where('classId', '==', classId), where('published', '==', true)]
    : [where('classId', '==', classId)];

  const q = query(collection(db, 'assignments'), ...constraints);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Assignment, 'id'>),
  }));
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAllAssignments(): Promise<Assignment[]> {
  const snap = await getDocs(collection(db, 'assignments'));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Assignment, 'id'>),
  }));
}

export async function createAssignment(input: {
  classId: string;
  title: string;
  description: string;
  criteria: string;
  dueDate: string;
  submissionType: SubmissionType;
  gradingScale: GradingScale;
  minWords: number;
  published: boolean;
}): Promise<Assignment> {
  const now = new Date().toISOString();
  const payload = {
    classId: input.classId,
    title: input.title.trim(),
    description: input.description.trim(),
    criteria: input.criteria.trim(),
    dueDate: input.dueDate,
    submissionType: input.submissionType,
    gradingScale: input.gradingScale,
    minWords: Math.max(0, Math.round(input.minWords || 0)),
    published: input.published,
    createdAt: now,
    updatedAt: now,
  };

  if (!payload.title) throw new Error('Oppgavetittel må fylles ut.');
  if (!payload.description) throw new Error('Oppgavebeskrivelse må fylles ut.');
  if (!payload.criteria) throw new Error('Vurderingskriterier må fylles ut.');

  const ref = await addDoc(collection(db, 'assignments'), payload);
  return { id: ref.id, ...payload };
}

export async function updateAssignment(
  assignmentId: string,
  updates: Partial<Omit<Assignment, 'id' | 'classId' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, 'assignments', assignmentId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteAssignment(assignmentId: string): Promise<void> {
  await deleteDoc(doc(db, 'assignments', assignmentId));
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

export async function listSubmissionsByClass(
  classId: string,
): Promise<Submission[]> {
  const q = query(
    collection(db, 'submissions'),
    where('classId', '==', classId),
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Submission, 'id'>),
  }));
  return items.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function listSubmissionsByStudent(
  studentUid: string,
): Promise<Submission[]> {
  const q = query(
    collection(db, 'submissions'),
    where('studentUid', '==', studentUid),
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Submission, 'id'>),
  }));
  return items.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function listAllSubmissions(): Promise<Submission[]> {
  const snap = await getDocs(collection(db, 'submissions'));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Submission, 'id'>),
  }));
}

export async function saveStudentSubmission(input: {
  assignment: Assignment;
  student: StudentProfile;
  answerText: string;
  integrity?: IntegrityReport;
}): Promise<Submission> {
  const submissionId = `${input.assignment.id}_${input.student.uid}`;
  const submittedAt = new Date().toISOString();
  const dueTime = input.assignment.dueDate
    ? new Date(input.assignment.dueDate).getTime()
    : Number.NaN;
  const isLate =
    !Number.isNaN(dueTime) && new Date(submittedAt).getTime() > dueTime;

  const submission: Submission = {
    id: submissionId,
    assignmentId: input.assignment.id,
    assignmentTitle: input.assignment.title,
    classId: input.student.classId,
    studentUid: input.student.uid,
    studentName: input.student.fullName,
    studentUsername: input.student.username,
    submissionType: input.assignment.submissionType,
    answerText: input.answerText.trim(),
    wordCount: countWords(input.answerText),
    submittedAt,
    isLate,
    ...(input.integrity ? { integrity: input.integrity } : {}),
  };

  await setDoc(doc(db, 'submissions', submissionId), submission, {
    merge: true,
  });
  return submission;
}

export async function saveAiAssessment(
  submissionId: string,
  aiAssessment: AiAssessment,
): Promise<void> {
  await updateDoc(doc(db, 'submissions', submissionId), { aiAssessment });
}

export async function saveTeacherReview(
  submissionId: string,
  teacherNote: string,
  teacherGradeOverride: string,
): Promise<void> {
  await updateDoc(doc(db, 'submissions', submissionId), {
    teacherNote: teacherNote.trim(),
    teacherGradeOverride: teacherGradeOverride.trim(),
  });
}
