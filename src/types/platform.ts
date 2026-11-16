export type BankingExam =
  | 'SBI PO'
  | 'SBI Clerk'
  | 'IBPS PO'
  | 'IBPS Clerk'
  | 'IBPS RRB PO'
  | 'IBPS RRB Clerk';

export type ExamSubject =
  | 'English Language'
  | 'Quantitative Aptitude'
  | 'Reasoning Aptitude';

export type QuestionDifficulty = 'Easy' | 'Moderate' | 'Hard';

export type MockTestCategory =
  | 'Full Length Tests'
  | 'Sectional Test 2.0'
  | 'Bank Topic Test';

export type PortalView =
  | 'home'
  | 'exam-series'
  | 'question-bank'
  | 'bookmarks'
  | 'create-mock'
  | 'add-question'
  | 'instructions'
  | 'simulator'
  | 'analytics';

export interface QuestionItem {
  id: string;
  questionText: string;
  exam: BankingExam;
  subject: ExamSubject;
  chapter: string;
  difficulty: QuestionDifficulty;
  options: [string, string, string, string, string];
  correctOptionIndex: number;
  /**
   * Data URL of the uploaded or drawn handwritten solution photo
   */
  handwrittenSolutionImage?: string;
  handwrittenFileName?: string;
  solutionNote?: string;
  bookmarked?: boolean;
  createdAt: string;
}

export interface CustomMockTest {
  id: string;
  testNumber: number;
  title: string;
  tagLabel: string;
  tagType: 'pattern' | 'easy' | 'moderate' | 'hard';
  isFree: boolean;
  exam: BankingExam;
  category: MockTestCategory;
  subjectScope: string;
  durationMinutes: number;
  positiveMarks: number;
  negativeMarks: number;
  cutoffMarks: number;
  questionIds: string[];
  createdAt: string;
}

export interface MockAttemptRecord {
  id: string;
  mockId: string;
  mockTitle: string;
  exam: BankingExam;
  answers: Record<string, number | null>;
  questionTimeSeconds: Record<string, number>;
  totalTimeSeconds: number;
  netScore: number;
  maxMarks: number;
  accuracyPercent: number;
  attemptedAt: string;
}
