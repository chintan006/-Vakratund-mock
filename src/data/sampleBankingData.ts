import {
  BankingExam,
  CustomMockTest,
  ExamSubject,
  MockTestCategory,
  QuestionDifficulty,
  QuestionItem,
} from '../types/platform';

export const BANKING_EXAMS: {
  id: BankingExam;
  title: string;
  shortCode: 'SBI' | 'IBPS' | 'RRB';
  totalTests: number;
  totalQuestions: number;
  totalHours: number;
}[] = [
  {
    id: 'SBI Clerk',
    title: 'SBI Clerk Mock Test 2026',
    shortCode: 'SBI',
    totalTests: 30,
    totalQuestions: 3000,
    totalHours: 30,
  },
  {
    id: 'SBI PO',
    title: 'SBI PO Mock Test 2026',
    shortCode: 'SBI',
    totalTests: 30,
    totalQuestions: 3000,
    totalHours: 30,
  },
  {
    id: 'IBPS Clerk',
    title: 'IBPS Clerk Mock Test 2026',
    shortCode: 'IBPS',
    totalTests: 25,
    totalQuestions: 2500,
    totalHours: 25,
  },
  {
    id: 'IBPS PO',
    title: 'IBPS PO Mock Test 2026',
    shortCode: 'IBPS',
    totalTests: 30,
    totalQuestions: 3000,
    totalHours: 30,
  },
  {
    id: 'IBPS RRB Clerk',
    title: 'IBPS RRB Clerk 2026',
    shortCode: 'RRB',
    totalTests: 25,
    totalQuestions: 2000,
    totalHours: 18,
  },
  {
    id: 'IBPS RRB PO',
    title: 'IBPS RRB PO 2026',
    shortCode: 'RRB',
    totalTests: 25,
    totalQuestions: 2000,
    totalHours: 18,
  },
];

export const EXAM_SUBJECTS: ExamSubject[] = [
  'English Language',
  'Quantitative Aptitude',
  'Reasoning Aptitude',
];

export const MOCK_CATEGORIES: MockTestCategory[] = [
  'Full Length Tests',
  'Sectional Test 2.0',
  'Bank Topic Test',
];

export const DIFFICULTY_LEVELS: QuestionDifficulty[] = [
  'Easy',
  'Moderate',
  'Hard',
];

export const CHAPTERS_BY_SUBJECT: Record<ExamSubject, string[]> = {
  'English Language': [
    'Word Usage & Contextual Vocabulary',
    'Reading Comprehension',
    'Cloze Test & Fillers',
    'Error Spotting & Phrase Replacement',
    'Para Jumbles (Sentence Rearrangement)',
  ],
  'Quantitative Aptitude': [
    'Missing & Wrong Number Series',
    'Quadratic Equations',
    'Simplification & Approximation',
    'Data Interpretation (Tabular & Bar)',
    'Arithmetic (Profit, Loss, SI & CI)',
    'Time, Work & Boat Streams',
  ],
  'Reasoning Aptitude': [
    'Circular & Linear Seating Arrangement',
    'Floor & Box Based Puzzles',
    'Syllogism (Only a Few)',
    'Coded Inequalities',
    'Blood Relations & Direction Sense',
  ],
};

function createNotebookHandwrittenSvg(
  heading: string,
  steps: string[],
  finalResult: string
): string {
  const stepElements = steps
    .map(
      (line, index) =>
        `<text x="58" y="${110 + index * 38}" font-family="'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive, sans-serif" font-size="17" fill="#1e3a8a">${line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</text>`
    )
    .join('');

  const rows = [76, 114, 152, 190, 228, 266, 304, 342]
    .map(
      (y) =>
        `<line x1="0" y1="${y}" x2="780" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="400" viewBox="0 0 780 400">
    <rect width="780" height="400" rx="10" fill="#fffef9" stroke="#cbd5e1" stroke-width="1.5"/>
    ${rows}
    <line x1="44" y1="0" x2="44" y2="400" stroke="#f87171" stroke-width="1.5"/>
    <text x="58" y="48" font-family="'Segoe Print', 'Bradley Hand', cursive, sans-serif" font-size="19" font-weight="bold" fill="#0f172a">${heading}</text>
    <line x1="58" y1="58" x2="520" y2="58" stroke="#005a9c" stroke-width="2" stroke-dasharray="5 3"/>
    ${stepElements}
    <rect x="58" y="320" width="520" height="46" rx="8" fill="#ecfdf5" stroke="#00a651" stroke-width="2"/>
    <text x="74" y="349" font-family="'Segoe Print', 'Bradley Hand', cursive, sans-serif" font-size="18" font-weight="bold" fill="#065f46">${finalResult}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'Q-101',
    questionText:
      'Direction: In the given questions, a word has been used in three ways. You need to observe and check which of the sentences has/have correctly used the given word, and mark that as your answer.\n\nBat\n\nI. The bat has inspired a whole genre of vampire and superhero stories.\nII. He was shocked to see the bat condition of his car.\nIII. The autographed bat is his most prized possession.',
    exam: 'SBI PO',
    subject: 'English Language',
    chapter: 'Word Usage & Contextual Vocabulary',
    difficulty: 'Easy',
    options: [
      'Only I',
      'Only I and III',
      'Only II and III',
      'All I, II and III',
      'None of these',
    ],
    correctOptionIndex: 1,
    handwrittenFileName: 'english_word_usage_bat.jpg',
    handwrittenSolutionImage: createNotebookHandwrittenSvg(
      'Handwritten Solution — Word Usage ("Bat")',
      [
        'Sentence I: "bat" (flying mammal) -> Grammatically & contextually CORRECT.',
        'Sentence II: "bat condition of his car" -> Incorrect spelling; should be "bad".',
        'Sentence III: "autographed bat" (cricket/baseball bat) -> CORRECT.',
        'Therefore, both Sentence I and Sentence III use "bat" properly.',
      ],
      'Ans: Option (B) — Only I and III are correct'
    ),
    solutionNote: 'In Sentence II, "bad condition" was misspelled as "bat condition".',
    createdAt: '16 Nov 2026',
  },
  {
    id: 'Q-102',
    questionText:
      'Find the wrong number in the given number series:\n14, 18, 27, 52, 101, 224, 391',
    exam: 'SBI PO',
    subject: 'Quantitative Aptitude',
    chapter: 'Missing & Wrong Number Series',
    difficulty: 'Moderate',
    options: ['27', '52', '101', '224', '391'],
    correctOptionIndex: 3,
    handwrittenFileName: 'handwritten_series_solution.jpg',
    handwrittenSolutionImage: createNotebookHandwrittenSvg(
      'Handwritten Note — Prime Square Difference Pattern',
      [
        'Given Series:   14      18      27      52      101     [224]     391',
        'Differences:        +4      +9     +25     +49     +121     +169',
        'Observe:            2²      3²      5²      7²      11²      13²  (Prime Numbers)',
        'Correct 6th Term = 101 + 11² = 101 + 121 = 222 (Instead of 224)',
        'Check Next Term = 222 + 13² = 222 + 169 = 391 (Matches)',
      ],
      'Correct Answer: Option (D) — 224 is the wrong number'
    ),
    solutionNote: 'Consecutive prime square differences: +2², +3², +5², +7², +11², +13².',
    createdAt: '16 Nov 2026',
  },
  {
    id: 'Q-103',
    questionText:
      'In the question, two equations I and II are given. Solve both equations to establish the correct relation between x and y:\nI. 6x² – 29x + 35 = 0\nII. 12y² – 37y + 28 = 0',
    exam: 'SBI PO',
    subject: 'Quantitative Aptitude',
    chapter: 'Quadratic Equations',
    difficulty: 'Easy',
    options: [
      'x > y',
      'x ≥ y',
      'x < y',
      'x ≤ y',
      'x = y or relationship cannot be established',
    ],
    correctOptionIndex: 0,
    handwrittenFileName: 'handwritten_quadratic_trick.jpg',
    handwrittenSolutionImage: createNotebookHandwrittenSvg(
      'Handwritten Note — Quadratic Root Comparison Shortcut',
      [
        'Eq I:  6x² - 29x + 35 = 0   (Product = 210, Sum = -29 => Factors: -15, -14)',
        '       x = 15/6 = +2.50   and   x = 14/6 = +2.33',
        'Eq II: 12y² - 37y + 28 = 0  (Product = 336, Sum = -37 => Factors: -21, -16)',
        '       y = 21/12 = +1.75  and   y = 16/12 = +1.33',
        'Since +2.33 > +1.75, both values of x are strictly greater than y.',
      ],
      'Correct Answer: Option (A) — x > y'
    ),
    solutionNote: 'Both roots of x (2.50, 2.33) are greater than both roots of y (1.75, 1.33).',
    createdAt: '16 Nov 2026',
  },
  {
    id: 'Q-104',
    questionText:
      'Statements:\nOnly a few commercial banks are scheduled banks.\nAll scheduled banks are clearing houses.\nNo clearing house is a cooperative society.\n\nConclusions:\nI. Some commercial banks are not cooperative societies.\nII. Some commercial banks are not scheduled banks.',
    exam: 'SBI PO',
    subject: 'Reasoning Aptitude',
    chapter: 'Syllogism (Only a Few)',
    difficulty: 'Moderate',
    options: [
      'Only Conclusion I follows',
      'Only Conclusion II follows',
      'Either Conclusion I or II follows',
      'Neither Conclusion I nor II follows',
      'Both Conclusions I and II follow',
    ],
    correctOptionIndex: 4,
    handwrittenFileName: 'handwritten_syllogism_venn.jpg',
    handwrittenSolutionImage: createNotebookHandwrittenSvg(
      'Handwritten Note — Venn Diagram for "Only a Few"',
      [
        '1. "Only a few Commercial (C) are Scheduled (S)":',
        '   => Some C are S  +  Some C are definitely NOT S (Conclusion II is TRUE)',
        '2. All S are inside Clearing House (CH), and CH × Cooperative = No overlap.',
        '3. The portion of C overlapping with S & CH can never be Cooperative.',
        '   => Some Commercial Banks are NOT Cooperative (Conclusion I is TRUE).',
      ],
      'Correct Answer: Option (E) — Both I and II follow'
    ),
    solutionNote: '"Only a few A are B" means both "Some A are B" and "Some A are not B".',
    createdAt: '16 Nov 2026',
  },
  {
    id: 'Q-105',
    questionText:
      'Eight officers P, Q, R, S, T, U, V, and W sit around a circular table facing the center. P sits third to the left of R. Only two persons sit between R and T. U sits second to the right of T. V is an immediate neighbor of R. Who sits directly opposite to P?',
    exam: 'SBI PO',
    subject: 'Reasoning Aptitude',
    chapter: 'Circular & Linear Seating Arrangement',
    difficulty: 'Hard',
    options: ['U', 'T', 'V', 'Q', 'W'],
    correctOptionIndex: 0,
    handwrittenFileName: 'handwritten_circle_arrangement.jpg',
    handwrittenSolutionImage: createNotebookHandwrittenSvg(
      'Handwritten Note — 8-Person Circular Arrangement',
      [
        'Draw 8 seats (1 to 8 anticlockwise facing center):',
        'Step 1: Place R at Seat 1. P is 3rd left of R => P is at Seat 6.',
        'Step 2: Two persons between R(1) and T => T must be at Seat 4.',
        'Step 3: U is 2nd right of T(4) => U is at Seat 2.',
        'In an 8-seat circle, Seat 6 (P) is directly opposite to Seat 2 (U).',
      ],
      'Correct Answer: Option (A) — U sits opposite to P'
    ),
    solutionNote: 'Seat 6 (P) and Seat 2 (U) face each other directly.',
    createdAt: '15 Nov 2026',
  },
];

export const INITIAL_CUSTOM_MOCKS: CustomMockTest[] = [
  {
    id: 'MOCK-1',
    testNumber: 1,
    title: 'SBI PO Mock Test (Pre)',
    tagLabel: 'Based on 4th Aug 2025 - Shift 1',
    tagType: 'pattern',
    isFree: true,
    exam: 'SBI PO',
    category: 'Full Length Tests',
    subjectScope: 'English, Quant & Reasoning',
    durationMinutes: 20,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    cutoffMarks: 3.25,
    questionIds: ['Q-101', 'Q-102', 'Q-103', 'Q-104', 'Q-105'],
    createdAt: '16 Nov 2026',
  },
  {
    id: 'MOCK-2',
    testNumber: 2,
    title: 'SBI PO Mock Test (Pre)',
    tagLabel: 'Exam Pattern Based',
    tagType: 'pattern',
    isFree: true,
    exam: 'SBI PO',
    category: 'Full Length Tests',
    subjectScope: 'Quantitative & Reasoning Booster',
    durationMinutes: 20,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    cutoffMarks: 2.5,
    questionIds: ['Q-102', 'Q-103', 'Q-104', 'Q-105'],
    createdAt: '16 Nov 2026',
  },
  {
    id: 'MOCK-3',
    testNumber: 3,
    title: 'SBI PO Mock Test (Pre)',
    tagLabel: 'Moderate',
    tagType: 'moderate',
    isFree: true,
    exam: 'SBI PO',
    category: 'Sectional Test 2.0',
    subjectScope: 'Quantitative Aptitude',
    durationMinutes: 15,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    cutoffMarks: 1.5,
    questionIds: ['Q-102', 'Q-103'],
    createdAt: '16 Nov 2026',
  },
  {
    id: 'MOCK-4',
    testNumber: 4,
    title: 'SBI PO Mock Test (Pre)',
    tagLabel: 'Easy',
    tagType: 'easy',
    isFree: true,
    exam: 'SBI PO',
    category: 'Bank Topic Test',
    subjectScope: 'Reasoning Seating & Syllogism',
    durationMinutes: 15,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    cutoffMarks: 1.5,
    questionIds: ['Q-104', 'Q-105'],
    createdAt: '15 Nov 2026',
  },
  {
    id: 'MOCK-5',
    testNumber: 1,
    title: 'IBPS PO Mock Test (Pre)',
    tagLabel: 'Exam Pattern Based',
    tagType: 'pattern',
    isFree: true,
    exam: 'IBPS PO',
    category: 'Full Length Tests',
    subjectScope: 'Full Prelims Tier-I',
    durationMinutes: 20,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    cutoffMarks: 3.0,
    questionIds: ['Q-101', 'Q-102', 'Q-103', 'Q-104', 'Q-105'],
    createdAt: '15 Nov 2026',
  },
  {
    id: 'MOCK-6',
    testNumber: 1,
    title: 'SBI Clerk Mock Test 2026',
    tagLabel: 'Easy',
    tagType: 'easy',
    isFree: true,
    exam: 'SBI Clerk',
    category: 'Full Length Tests',
    subjectScope: 'Junior Associates Prelims',
    durationMinutes: 20,
    positiveMarks: 1.0,
    negativeMarks: 0.25,
    cutoffMarks: 3.0,
    questionIds: ['Q-101', 'Q-102', 'Q-103', 'Q-104', 'Q-105'],
    createdAt: '15 Nov 2026',
  },
];
