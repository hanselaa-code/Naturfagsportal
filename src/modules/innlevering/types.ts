export const ADMIN_EMAIL = 'hanselaa@gmail.com';

export type GradingScale =
  | 'grades_1_6'
  | 'pass_fail'
  | 'achievement_levels';

export type SubmissionType = 'anticheat' | 'text' | 'oral';

export const GRADING_SCALE_OPTIONS: {
  value: GradingScale;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    value: 'grades_1_6',
    label: 'Finfordelt karakterskala (1–6)',
    shortLabel: 'Karakter 1–6',
    description: 'Norsk karakterskala med +/- (f.eks. 3+, 4, 5-, 6).',
  },
  {
    value: 'pass_fail',
    label: 'Bestått / Ikke bestått',
    shortLabel: 'Bestått / Ikke bestått',
    description: 'Vurderer om besvarelsen oppfyller minstekravene i kriteriene.',
  },
  {
    value: 'achievement_levels',
    label: 'Lav – Middels – Høy måloppnåelse',
    shortLabel: 'Måloppnåelse (Lav/Middels/Høy)',
    description: 'Plasserer besvarelsen på lav, middels eller høy måloppnåelse.',
  },
];

export const SUBMISSION_TYPE_OPTIONS: {
  value: SubmissionType;
  label: string;
  description: string;
}[] = [
  {
    value: 'anticheat',
    label: 'Skriftlig med kopisperre',
    description: 'Blokkerer lim inn/kopiering og logger fanebytte.',
  },
  {
    value: 'text',
    label: 'Skriftlig fritekst',
    description: 'Vanlig skriftlig innlevering uten kopisperre.',
  },
  {
    value: 'oral',
    label: 'Muntlig refleksjon / manus',
    description: 'Strukturert refleksjon eller talepunkter for muntlig vurdering.',
  },
];

export interface Classroom {
  id: string;
  name: string;
  schoolYear: string;
  description: string;
  createdAt: string;
}

export interface StudentProfile {
  uid: string;
  classId: string;
  className: string;
  fullName: string;
  username: string;
  authEmail: string;
  active: boolean;
  createdAt: string;
}

export interface StudentCredential {
  uid: string;
  classId: string;
  fullName: string;
  username: string;
  password: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  criteria: string;
  dueDate: string;
  submissionType: SubmissionType;
  gradingScale: GradingScale;
  minWords: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrityEventRecord {
  type:
    | 'tab-switch'
    | 'paste-blocked'
    | 'copy-blocked'
    | 'cut-blocked'
    | 'contextmenu-blocked';
  message: string;
  timestamp: string;
}

export interface IntegrityReport {
  tabSwitchCount: number;
  blockedActionCount: number;
  events: IntegrityEventRecord[];
}

export interface CriterionAssessment {
  criterion: string;
  status: 'oppnadd' | 'delvis' | 'mangler';
  comment: string;
}

export interface AiAssessment {
  gradingScale: GradingScale;
  gradeLabel: string;
  numericScore: number; // 0-100 normalized for progress tracking
  summary: string;
  strengths: string[];
  improvements: string[];
  criteriaBreakdown: CriterionAssessment[];
  evaluatedAt: string;
  modelUsed: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  classId: string;
  studentUid: string;
  studentName: string;
  studentUsername: string;
  submissionType: SubmissionType;
  answerText: string;
  wordCount: number;
  submittedAt: string;
  isLate: boolean;
  integrity?: IntegrityReport;
  aiAssessment?: AiAssessment;
  teacherNote?: string;
  teacherGradeOverride?: string;
}

export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9._-]/g, '');
}

export function buildStudentAuthEmail(
  username: string,
  classId: string,
): string {
  const cleanUser = normalizeUsername(username);
  const cleanClass = classId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return `${cleanUser}--${cleanClass}@elever.naturfagsportal.no`;
}

const STUDENT_AUTH_PASSWORD_PREFIX = 'nf26#';

/**
 * Wraps short student passwords (e.g. 1-word passwords like "sol", "snø")
 * so they always satisfy Firebase Auth's 6-character minimum requirement.
 */
export function buildStudentAuthPassword(rawPassword: string): string {
  return `${STUDENT_AUTH_PASSWORD_PREFIX}${rawPassword.trim()}`;
}

export function getGradingScaleLabel(scale: GradingScale): string {
  return (
    GRADING_SCALE_OPTIONS.find((o) => o.value === scale)?.label ?? scale
  );
}

export function getGradingScaleShortLabel(scale: GradingScale): string {
  return (
    GRADING_SCALE_OPTIONS.find((o) => o.value === scale)?.shortLabel ?? scale
  );
}

export function getSubmissionTypeLabel(type: SubmissionType): string {
  return (
    SUBMISSION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
  );
}

export function formatNorwegianDateTime(iso: string): string {
  if (!iso) return 'Ingen frist';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
