import React, { useState } from 'react';
import {
  Home,
  ChevronRight,
  FileText,
  BarChart2,
  Plus,
  Lock,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  BankingExam,
  CustomMockTest,
  MockAttemptRecord,
  MockTestCategory,
  PortalView,
  QuestionItem,
} from '../../types/platform';
import { BANKING_EXAMS } from '../../data/sampleBankingData';
import { BankExamEmblem } from '../common/SmartKeedaIcons';

interface ExamSeriesListPageProps {
  selectedExam: BankingExam;
  selectedCategory: MockTestCategory;
  onSelectExam: (exam: BankingExam) => void;
  mocks: CustomMockTest[];
  questions: QuestionItem[];
  attempts?: MockAttemptRecord[];
  onStartMockSimulator: (mock: CustomMockTest) => void;
  onOpenMockAnalyticsAndSolutions: (mock: CustomMockTest) => void;
  onCustomizeMock: (mock: CustomMockTest) => void;
  onNavigate: (view: PortalView) => void;
}

export const ExamSeriesListPage: React.FC<ExamSeriesListPageProps> = ({
  selectedExam,
  selectedCategory,
  onSelectExam,
  mocks,
  questions,
  attempts = [],
  onStartMockSimulator,
  onOpenMockAnalyticsAndSolutions,
  onCustomizeMock,
  onNavigate,
}) => {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'attempted' | 'unattempted'
  >('all');

  const examInfo =
    BANKING_EXAMS.find((e) => e.id === selectedExam) || BANKING_EXAMS[1];

  const examMocks = mocks.filter((m) => m.exam === selectedExam);
  const baseMocks = examMocks.length > 0 ? examMocks : mocks;

  const latestAttemptByMockId = React.useMemo(() => {
    const map = new Map<string, MockAttemptRecord>();
    attempts.forEach((att) => {
      if (!map.has(att.mockId)) {
        map.set(att.mockId, att);
      }
    });
    return map;
  }, [attempts]);

  const displayMocks = baseMocks.filter((m) => {
    const isAttempted = latestAttemptByMockId.has(m.id);
    if (statusFilter === 'attempted') return isAttempted;
    if (statusFilter === 'unattempted') return !isAttempted;
    return true;
  });

  const questionMap = React.useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );

  const renderTagPill = (mock: CustomMockTest) => {
    if (mock.tagType === 'easy') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#86EFAC] bg-[#F0FDF4] px-3 py-0.5 text-[11px] font-semibold text-[#15803D]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
          <span>Easy</span>
        </span>
      );
    }
    if (mock.tagType === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3 py-0.5 text-[11px] font-semibold text-[#D97706]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
          <span>Moderate</span>
        </span>
      );
    }
    if (mock.tagType === 'hard') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-0.5 text-[11px] font-semibold text-[#DC2626]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
          <span>Hard</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7DD3FC] bg-[#F0F9FF] px-3 py-0.5 text-[11px] font-semibold text-[#0284C7]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
        <span>{mock.tagLabel || 'Exam Pattern Based'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Quick Exam Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1 hover:text-slate-900"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{selectedCategory}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">
            {selectedExam} Mock Test (Pre)
          </span>
        </div>

        {/* Exam Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {BANKING_EXAMS.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => onSelectExam(ex.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                selectedExam === ex.id
                  ? 'bg-[#005A9C] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {ex.id}
            </button>
          ))}
        </div>
      </div>

      {/* Top Exam Summary Banner Card */}
      <section className="rounded-2xl border border-[#BAE6FD] bg-gradient-to-r from-[#E0F2FE]/70 via-[#F0F9FF] to-white p-4 shadow-2xs sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          {/* Left Exam Details */}
          <div className="space-y-2.5 min-w-0">
            <div className="flex items-center gap-3">
              <BankExamEmblem code={examInfo.shortCode} size="md" />
              <h1 className="truncate font-display text-lg font-extrabold text-slate-900 sm:text-2xl">
                {selectedExam} Mock Test (Pre)
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-600 sm:gap-4">
              <span>{baseMocks.length} Custom Tests</span>
              <span className="text-slate-300">|</span>
              <span>{questions.length} Curated Ques.</span>
              <span className="text-slate-300">|</span>
              <span>Handwritten Solutions</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
              <span className="font-bold text-[#16A34A]">
                • All Tests Unlocked
              </span>
              <span>• TCS iON Simulator</span>
              <span>• Handwritten Notebook Scans</span>
            </div>
          </div>

          {/* Right Custom Studio Action Box (Password Protected for Admin Only) */}
          <div className="w-full rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50/80 to-white p-3.5 shadow-xs lg:max-w-sm sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-display text-xs font-extrabold text-slate-900 sm:text-sm">
                {selectedExam} Admin Mock Studio
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                <Lock className="h-2.5 w-2.5" />
                <span>ADMIN ONLY</span>
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Protected by Admin password. Only Admin can create or modify mocks &amp; handwritten solutions.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('create-mock')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-2 text-xs font-bold text-white hover:bg-slate-800 whitespace-nowrap"
              >
                <Lock className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                <span className="truncate">Create / Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('add-question')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5 shrink-0 text-[#005A9C]" />
                <span className="truncate">Add Question</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Tabs Strip + Attempted Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs sm:px-4"
          >
            <FileText className="h-3.5 w-3.5 text-slate-700 sm:h-4 sm:w-4" />
            <span>My Tests ({baseMocks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('question-bank')}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 sm:px-3"
          >
            <BarChart2 className="h-3.5 w-3.5 text-slate-500 sm:h-4 sm:w-4" />
            <span>Handwritten Bank ({questions.length})</span>
          </button>
        </div>

        {/* All / Attempted / Unattempted Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'All Tests' },
              { id: 'attempted', label: 'Attempted' },
              { id: 'unattempted', label: 'Unattempted' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === f.id
                  ? 'bg-[#E11D48] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Header + Horizontal Numbered Mock Test Rows */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-[#E11D48]" />
          <h2 className="font-display text-sm font-extrabold text-slate-900 sm:text-base">
            {selectedExam} Mock Test (Pre) 2026 Series
          </h2>
        </div>

        <div className="space-y-3">
          {displayMocks.map((mock, index) => {
            const validQuestions = mock.questionIds
              .map((id) => questionMap.get(id))
              .filter((q): q is QuestionItem => Boolean(q));
            const totalMarks = validQuestions.length * mock.positiveMarks;
            const latestAttempt = latestAttemptByMockId.get(mock.id);

            return (
              <div
                key={mock.id}
                className="relative flex flex-col justify-between gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs sm:px-5 sm:py-4 lg:flex-row lg:items-center"
              >
                {/* Top-Left Green FREE Tag */}
                {mock.isFree && (
                  <span className="absolute -top-2 left-10 rounded bg-[#16A34A] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-2xs sm:left-12">
                    FREE
                  </span>
                )}

                {/* Left: Dark Number Circle + Title + Pattern/Difficulty Pill + Attempted Score */}
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#475569] font-sans text-xs font-bold text-white sm:h-8 sm:w-8">
                    {index + 1}
                  </span>

                  <span className="font-display text-xs font-bold text-slate-900 sm:text-sm">
                    {mock.title}
                  </span>

                  {renderTagPill(mock)}

                  {latestAttempt && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>
                        Score: {latestAttempt.netScore}/{latestAttempt.maxMarks}
                      </span>
                    </span>
                  )}
                </div>

                {/* Center: Questions | Marks | Mins */}
                <div className="flex w-full items-center justify-around rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-700 sm:w-auto sm:justify-start sm:gap-5 sm:bg-transparent sm:p-0">
                  <div>
                    <p className="font-mono font-bold text-slate-900 tabular-nums">
                      {validQuestions.length}
                    </p>
                    <p className="text-[10px] text-slate-500 sm:text-[11px]">
                      Questions
                    </p>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />

                  <div>
                    <p className="font-mono font-bold text-slate-900 tabular-nums">
                      {totalMarks}
                    </p>
                    <p className="text-[10px] text-slate-500 sm:text-[11px]">
                      Marks
                    </p>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />

                  <div>
                    <p className="font-mono font-bold text-slate-900 tabular-nums">
                      {mock.durationMinutes}
                    </p>
                    <p className="text-[10px] text-slate-500 sm:text-[11px]">
                      Mins
                    </p>
                  </div>
                </div>

                {/* Right: Green "Start Test / Re-Attempt" + "Solutions" + Protected Admin Customize */}
                <div className="flex w-full items-center gap-2 lg:w-auto lg:shrink-0">
                  <button
                    type="button"
                    onClick={() => onStartMockSimulator(mock)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3 py-2 text-center text-xs font-bold text-white shadow-2xs transition-colors hover:bg-[#166534] lg:flex-initial lg:px-5 whitespace-nowrap"
                  >
                    {latestAttempt && <RotateCcw className="h-3.5 w-3.5" />}
                    <span>{latestAttempt ? 'Re-Attempt' : 'Start Test'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenMockAnalyticsAndSolutions(mock)}
                    className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-center text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 lg:flex-initial lg:px-3.5 whitespace-nowrap"
                  >
                    Solutions
                  </button>

                  <button
                    type="button"
                    onClick={() => onCustomizeMock(mock)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300"
                    title="Admin Only: Customize or Delete Mock Test (Password Required)"
                    aria-label={`Customize ${mock.title}`}
                  >
                    <Lock className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
