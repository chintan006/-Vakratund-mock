import React from 'react';
import {
  ClipboardCheck,
  Layers,
  ListChecks,
  FilePlus2,
  PlusCircle,
  Image as ImageIcon,
  ChevronRight,
  Award,
  Target,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import {
  BankingExam,
  MockAttemptRecord,
  MockTestCategory,
  PortalView,
  QuestionItem,
} from '../../types/platform';
import { BANKING_EXAMS, EXAM_SUBJECTS } from '../../data/sampleBankingData';
import { BankExamEmblem } from '../common/SmartKeedaIcons';

interface SmartKeedaHomePageProps {
  questions: QuestionItem[];
  attempts?: MockAttemptRecord[];
  onSelectExamSeries: (exam: BankingExam, category?: MockTestCategory) => void;
  onNavigate: (view: PortalView, category?: MockTestCategory) => void;
  onInspectQuestionSolution: (q: QuestionItem) => void;
  onOpenAttemptAnalytics?: (attempt: MockAttemptRecord) => void;
}

export const SmartKeedaHomePage: React.FC<SmartKeedaHomePageProps> = ({
  questions,
  attempts = [],
  onSelectExamSeries,
  onNavigate,
  onInspectQuestionSolution,
  onOpenAttemptAnalytics,
}) => {
  const topFeatureCards = [
    {
      title: 'Full Length Mocks',
      icon: ClipboardCheck,
      iconBg: 'bg-[#6366F1]',
      onClick: () => onSelectExamSeries('SBI PO', 'Full Length Tests'),
    },
    {
      title: 'Sectional Tests',
      icon: Layers,
      iconBg: 'bg-[#10B981]',
      onClick: () => onSelectExamSeries('SBI PO', 'Sectional Test 2.0'),
    },
    {
      title: 'Topic Tests',
      icon: ListChecks,
      iconBg: 'bg-[#8B5CF6]',
      onClick: () => onSelectExamSeries('SBI PO', 'Bank Topic Test'),
    },
    {
      title: 'Create Custom Mock',
      icon: FilePlus2,
      iconBg: 'bg-[#0284C7]',
      onClick: () => onNavigate('create-mock'),
    },
    {
      title: 'Add Question + Photo',
      icon: PlusCircle,
      iconBg: 'bg-[#F59E0B]',
      onClick: () => onNavigate('add-question'),
    },
    {
      title: 'Handwritten Solutions',
      icon: ImageIcon,
      iconBg: 'bg-[#EC4899]',
      onClick: () => onNavigate('question-bank'),
    },
  ];

  const avgAccuracy =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((acc, a) => acc + a.accuracyPercent, 0) /
            attempts.length
        )
      : 0;
  const savedRevisionCount = questions.filter((q) => q.bookmarked).length;
  const handwrittenReadyCount = questions.filter((q) =>
    Boolean(q.handwrittenSolutionImage)
  ).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Section 1: Vakratund Home Feature Grid */}
      <section>
        <p className="text-[11px] font-extrabold tracking-wider text-[#E11D48]">
          VAKRATUND BANKING &amp; GOVT EXAM PREPARATION PLATFORM
        </p>
        <h1 className="mt-1 font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          One Platform, Complete Preparation.
        </h1>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topFeatureCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                type="button"
                onClick={card.onClick}
                className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 text-left shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs sm:h-11 sm:w-11 ${card.iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="truncate font-display text-sm font-bold text-slate-900">
                    {card.title}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 1.5: Personal Preparation Progress & Recent Attempts */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Tests Attempted</span>
          </div>
          <p className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums sm:text-xl">
            {attempts.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
            <Target className="h-4 w-4" />
            <span>Avg. Accuracy</span>
          </div>
          <p className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums sm:text-xl">
            {avgAccuracy}%
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600">
            <Award className="h-4 w-4" />
            <span>Handwritten Notes</span>
          </div>
          <p className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums sm:text-xl">
            {handwrittenReadyCount}/{questions.length}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('bookmarks')}
          className="rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-2xs hover:border-amber-400"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <Bookmark className="h-4 w-4" />
            <span>Saved for Revision</span>
          </div>
          <p className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums sm:text-xl">
            {savedRevisionCount} Ques.
          </p>
        </button>
      </section>

      {/* Recent Test Attempts Strip (Shown when user has attempted mocks) */}
      {attempts.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-display text-sm font-extrabold text-slate-900 sm:text-base">
              Recent Mock Test Attempts
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Click to view Solutions &amp; Analytics
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {attempts.slice(0, 3).map((att) => (
              <button
                key={att.id}
                type="button"
                onClick={() => onOpenAttemptAnalytics?.(att)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-[#005A9C] hover:bg-white"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-xs font-bold text-slate-900">
                    {att.mockTitle}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {att.attemptedAt} · Accuracy {att.accuracyPercent}%
                  </p>
                </div>
                <span className="ml-2 shrink-0 rounded-md bg-emerald-600 px-2 py-1 font-mono text-xs font-bold text-white tabular-nums">
                  {att.netScore}/{att.maxMarks}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Mock Test for Bank & Insurance Sky-Blue Hero Banner */}
      <section className="rounded-2xl border border-[#BAE6FD] bg-gradient-to-br from-[#E0F2FE]/80 via-[#F0F9FF] to-white p-5 shadow-2xs sm:p-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-lg font-extrabold text-slate-900 sm:text-2xl">
            Mock Test for Bank &amp; Insurance
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-700 sm:text-sm">
            Full Length Mock Test Series - 2026 (With Handwritten Notebook
            Solutions)
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Prepare smarter with full-length tests, sectional tests, and
            topic-wise quizzes featuring the official TCS iON examination
            simulator, smart post-test analytics, and uploaded handwritten
            solution sheets for every question.
          </p>
        </div>
      </section>

      {/* Section 3: Full Length Test Banking Exam Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1 rounded-full bg-[#E11D48]" />
          <h2 className="font-display text-base font-extrabold text-slate-900 sm:text-lg">
            Full Length Test
          </h2>
        </div>

        {/* Category Pill Switch */}
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-[#E11D48] bg-white px-5 py-1.5 text-xs font-bold text-slate-900 shadow-2xs">
            Banking Exams
          </span>
        </div>

        {/* 3-Column Bank Exam Cards Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {BANKING_EXAMS.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => onSelectExamSeries(exam.id, 'Full Length Tests')}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-2xs transition-all hover:border-[#005A9C] hover:shadow-sm sm:p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BankExamEmblem code={exam.shortCode} size="md" />
                <span className="truncate font-display text-xs font-bold text-slate-900 sm:text-sm">
                  {exam.title}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
            </button>
          ))}
        </div>
      </section>

      {/* Section 4: Recently Updated Questions */}
      <section className="space-y-4 pt-2">
        <h2 className="text-center font-display text-base font-extrabold text-slate-900 sm:text-lg">
          Recently Updated Questions (With Handwritten Solutions)
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {EXAM_SUBJECTS.map((subject) => {
            const subQuestions = questions
              .filter((q) => q.subject === subject)
              .slice(0, 3);

            return (
              <div
                key={subject}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5"
              >
                <div>
                  <div className="rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-900">
                    {subject}
                  </div>

                  <div className="mt-4 space-y-3">
                    {subQuestions.length === 0 ? (
                      <p className="py-2 text-xs text-slate-400">
                        No questions added in this section yet.
                      </p>
                    ) : (
                      subQuestions.map((q, idx) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => onInspectQuestionSolution(q)}
                          className="flex w-full items-center gap-3 text-left text-xs text-slate-700 hover:text-[#005A9C]"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-400 font-mono text-[11px] font-bold text-slate-800">
                            {idx + 1}
                          </span>
                          <span className="truncate font-medium">
                            {q.chapter} ({q.id})
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('question-bank')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-[#E11D48]"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>VIEW ALL QUESTIONS</span>
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
