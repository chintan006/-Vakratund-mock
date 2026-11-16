import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  Grid,
  Target,
  Award,
  Upload,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  RotateCcw,
  XCircle,
  Bookmark,
  PenTool,
  Sun,
  Moon,
  Printer,
  Clock,
} from 'lucide-react';
import {
  CustomMockTest,
  ExamSubject,
  QuestionItem,
} from '../../types/platform';
import { VakratundLogo } from '../common/SmartKeedaIcons';
import { processHandwrittenImageFile } from '../../utils/imageCompressor';

interface SmartAnalyticsAndSolutionsViewProps {
  mock: CustomMockTest;
  questions: QuestionItem[];
  userAnswers: Record<string, number | null>;
  timeSpentSeconds: number;
  questionTimeSeconds?: Record<string, number>;
  initialTab?: 'overview' | 'solution';
  themeMode?: 'light' | 'midnight';
  onToggleTheme?: () => void;
  onBackToSeries: () => void;
  onRetakeMock: () => void;
  onUpdateHandwrittenImage: (
    questionId: string,
    dataUrl: string,
    fileName: string
  ) => void;
  onToggleBookmark?: (questionId: string) => void;
  onOpenDrawingPad?: (question: QuestionItem) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export const SmartAnalyticsAndSolutionsView: React.FC<
  SmartAnalyticsAndSolutionsViewProps
> = ({
  mock,
  questions,
  userAnswers,
  timeSpentSeconds,
  questionTimeSeconds = {},
  initialTab = 'solution',
  themeMode = 'light',
  onToggleTheme,
  onBackToSeries,
  onRetakeMock,
  onUpdateHandwrittenImage,
  onToggleBookmark,
  onOpenDrawingPad,
}) => {
  const [activeTab, setActiveTab] = useState<'solution' | 'overview'>(
    initialTab
  );
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [zoomHandwriting, setZoomHandwriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockQuestions = useMemo(() => {
    const map = new Map(questions.map((q) => [q.id, q]));
    return mock.questionIds
      .map((id) => map.get(id))
      .filter((q): q is QuestionItem => Boolean(q));
  }, [mock, questions]);

  // Overall & Sectional Calculations
  const sections: ExamSubject[] = [
    'English Language',
    'Quantitative Aptitude',
    'Reasoning Aptitude',
  ];

  let totalCorrect = 0;
  let totalWrong = 0;
  let totalUnattempted = 0;

  mockQuestions.forEach((q) => {
    const ans = userAnswers[q.id];
    if (ans === undefined || ans === null) totalUnattempted++;
    else if (ans === q.correctOptionIndex) totalCorrect++;
    else totalWrong++;
  });

  const maxMarks = mockQuestions.length * mock.positiveMarks;
  const rawScore =
    totalCorrect * mock.positiveMarks - totalWrong * mock.negativeMarks;
  const netScore = Number(rawScore.toFixed(2));
  const attemptedCount = totalCorrect + totalWrong;
  const accuracyPercent =
    attemptedCount > 0 ? Math.round((totalCorrect / attemptedCount) * 100) : 0;
  const scorePercent =
    maxMarks > 0 ? Math.max(0, Math.round((netScore / maxMarks) * 100)) : 0;
  const percentile =
    netScore <= 0
      ? '0.44%'
      : `${Math.min(99.8, Math.max(12.4, scorePercent * 0.96 + 8)).toFixed(
          2
        )}%`;

  const currentQuestion =
    mockQuestions[selectedQuestionIdx] || mockQuestions[0];

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentQuestion) return;
    const { dataUrl, fileName } = await processHandwrittenImageFile(file);
    onUpdateHandwrittenImage(currentQuestion.id, dataUrl, fileName);
    e.target.value = '';
  };

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-hidden bg-white text-slate-900">
      {/* Top Vakratund Test Analysis Header */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 shadow-2xs sm:h-16 sm:px-6">
        <button
          type="button"
          onClick={onBackToSeries}
          className="flex min-w-0 items-center gap-2 text-left hover:opacity-80 sm:gap-2.5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-400 text-slate-700">
            <ChevronLeft className="h-4 w-4" />
          </span>
          <div className="min-w-0 leading-tight">
            <span className="block truncate text-[10px] font-medium text-slate-500">
              {mock.category}
            </span>
            <span className="block truncate font-display text-xs font-bold text-slate-900 sm:text-sm">
              {mock.title}
            </span>
          </div>
        </button>

        {/* Center Logo (Visible on Tablet/Desktop to keep mobile header uncluttered) */}
        <div className="hidden flex-col items-center sm:flex">
          <div className="flex items-center gap-2">
            <VakratundLogo className="h-7 w-7" />
            <div className="leading-none">
              <span className="block font-display text-sm font-extrabold text-slate-900">
                Vakratund
              </span>
              <span className="block text-[9px] font-semibold text-amber-700">
                Banking &amp; Govt Exam Prep
              </span>
            </div>
          </div>
          <span className="mt-0.5 text-[10px] font-semibold text-slate-500">
            Test Analysis &amp; Handwritten Solutions
          </span>
        </div>

        {/* Right Theme Toggle + Print PDF + Re-Attempt + Avatar */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-2 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:px-2.5"
              title={
                themeMode === 'midnight'
                  ? 'Switch to Classic Light'
                  : 'Switch to Midnight Focus'
              }
            >
              {themeMode === 'midnight' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden md:inline">Classic Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="hidden md:inline">Midnight Focus</span>
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            title="Print or Save Solution Sheet as PDF"
          >
            <Printer className="h-3.5 w-3.5 text-[#005A9C]" />
            <span className="hidden lg:inline">Print / PDF</span>
          </button>
          <button
            type="button"
            onClick={onRetakeMock}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:px-3"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Re-Attempt</span>
          </button>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EA580C] font-display text-xs font-bold text-white sm:h-8 sm:w-8">
            C
          </div>
        </div>
      </header>

      {/* Soft Pink-to-White Greeting & 5 KPI Cards Banner */}
      <section className="bg-gradient-to-b from-[#FFF1F2]/90 via-[#FFF9FA] to-white px-4 pt-6 pb-4 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-display text-lg font-extrabold text-slate-900 sm:text-xl">
            Hi Chintan Chovatiya
          </h1>
          <p className="mt-0.5 text-sm font-semibold text-slate-600">
            Your Score: {netScore}/{maxMarks}
          </p>
          <p className="text-[11px] text-slate-400">
            Time Taken: {Math.max(1, timeSpentSeconds)} Secs
          </p>

          {/* 5 KPI Cards Row */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-600">
                <Flag className="h-3.5 w-3.5" />
                <span>Cut Off Marks:</span>
              </div>
              <p className="mt-1 font-mono text-sm font-extrabold text-slate-900 tabular-nums sm:text-base">
                {mock.cutoffMarks}/{maxMarks}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Your Marks:</span>
              </div>
              <p className="mt-1 font-mono text-sm font-extrabold text-slate-900 tabular-nums sm:text-base">
                {netScore}/{maxMarks}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-sky-600">
                <Grid className="h-3.5 w-3.5" />
                <span>Percentage:</span>
              </div>
              <p className="mt-1 font-mono text-sm font-extrabold text-slate-900 tabular-nums sm:text-base">
                {scorePercent}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                <Target className="h-3.5 w-3.5" />
                <span>Accuracy:</span>
              </div>
              <p className="mt-1 font-mono text-sm font-extrabold text-slate-900 tabular-nums sm:text-base">
                {accuracyPercent}%
              </p>
            </div>

            <div className="col-span-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs sm:col-span-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-rose-600">
                <Award className="h-3.5 w-3.5" />
                <span>Percentile:</span>
              </div>
              <p className="mt-1 font-mono text-sm font-extrabold text-slate-900 tabular-nums sm:text-base">
                {percentile}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs (Solution | Overview) with Red Active Underline */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 px-4">
          <button
            type="button"
            onClick={() => setActiveTab('solution')}
            className={`relative py-3.5 text-xs font-bold transition-colors sm:text-sm ${
              activeTab === 'solution'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Solution (Handwritten Notes)</span>
            {activeTab === 'solution' && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E11D48]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`relative py-3.5 text-xs font-bold transition-colors sm:text-sm ${
              activeTab === 'overview'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Overview &amp; Marks Analysis</span>
            {activeTab === 'overview' && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E11D48]" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
        {activeTab === 'overview' ? (
          /* OVERVIEW TAB: SUMMARY TABLE + MARKS ANALYSIS BAR CHART */
          <div className="space-y-10">
            <section>
              <h2 className="text-center font-display text-sm font-bold tracking-wider text-slate-700 uppercase">
                SUMMARY
              </h2>

              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-[#D8E6F3] text-slate-800">
                      <th className="py-3 pl-4 pr-3 font-bold">Section</th>
                      <th className="px-3 py-3 text-center font-bold">
                        No. of Ques.
                      </th>
                      <th className="px-3 py-3 text-center font-bold">
                        <div className="flex items-center justify-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-xs bg-[#16A34A]" />
                            Correct
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-xs bg-[#EF4444]" />
                            Incorrect
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-xs bg-slate-300" />
                            Unattempted
                          </span>
                        </div>
                      </th>
                      <th className="px-3 py-3 text-center font-bold">
                        Cut off
                      </th>
                      <th className="py-3 pl-3 pr-4 text-center font-bold">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {sections.map((sec) => {
                      const secQs = mockQuestions.filter(
                        (q) => q.subject === sec
                      );
                      const count = secQs.length;
                      let c = 0;
                      let w = 0;
                      secQs.forEach((q) => {
                        const ans = userAnswers[q.id];
                        if (ans !== undefined && ans !== null) {
                          if (ans === q.correctOptionIndex) c++;
                          else w++;
                        }
                      });
                      const u = count - c - w;
                      const secScore =
                        c * mock.positiveMarks - w * mock.negativeMarks;

                      return (
                        <tr key={sec}>
                          <td className="py-3.5 pl-4 pr-3 font-medium text-slate-800">
                            {sec}
                          </td>
                          <td className="px-3 py-3.5 text-center font-mono tabular-nums">
                            {count}
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="mx-auto flex h-3.5 w-44 overflow-hidden rounded-full bg-slate-200 text-[9px] font-bold text-white">
                              {c > 0 && (
                                <div
                                  style={{ width: `${(c / Math.max(1, count)) * 100}%` }}
                                  className="flex items-center justify-center bg-[#16A34A]"
                                >
                                  {c}
                                </div>
                              )}
                              {w > 0 && (
                                <div
                                  style={{ width: `${(w / Math.max(1, count)) * 100}%` }}
                                  className="flex items-center justify-center bg-[#EF4444]"
                                >
                                  {w}
                                </div>
                              )}
                              {u > 0 && (
                                <div
                                  style={{ width: `${(u / Math.max(1, count)) * 100}%` }}
                                  className="flex items-center justify-center bg-slate-400"
                                >
                                  {u}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center font-mono tabular-nums">
                            1.0
                          </td>
                          <td className="py-3.5 pl-3 pr-4 text-center font-mono font-bold tabular-nums">
                            {secScore.toFixed(2)}/{count}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Overall Row */}
                    <tr className="bg-slate-50 font-bold">
                      <td className="py-3.5 pl-4 pr-3 text-slate-900">
                        Overall
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono tabular-nums">
                        {mockQuestions.length}
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono text-[11px] text-slate-700">
                        {totalCorrect} Correct · {totalWrong} Wrong ·{' '}
                        {totalUnattempted} Skipped
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono tabular-nums">
                        {mock.cutoffMarks}
                      </td>
                      <td className="py-3.5 pl-3 pr-4 text-center font-mono tabular-nums">
                        {netScore}/{maxMarks} ({scorePercent}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Marks Analysis Bar Chart */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-6">
              <h3 className="text-center font-display text-sm font-bold text-slate-800">
                Marks Analysis (Topper vs Cut Off vs You)
              </h3>

              <div className="mt-6 grid grid-cols-4 gap-4 border-b border-slate-200 pb-4 pt-6 items-end h-52">
                {[...sections, 'Overall'].map((label) => {
                  const isOverall = label === 'Overall';
                  const cutBarHeight = isOverall ? '55%' : '25%';
                  const topperBarHeight = isOverall ? '92%' : '80%';
                  const userBarHeight = `${Math.max(8, scorePercent)}%`;

                  return (
                    <div
                      key={label}
                      className="flex h-full flex-col items-center justify-end"
                    >
                      <div className="flex h-full w-full items-end justify-center gap-1.5 sm:gap-3">
                        <div
                          style={{ height: cutBarHeight }}
                          className="w-4 rounded-t bg-[#EF4444] sm:w-6"
                          title="Cut off"
                        />
                        <div
                          style={{ height: topperBarHeight }}
                          className="w-4 rounded-t bg-[#3B82F6] sm:w-6"
                          title="Topper"
                        />
                        <div
                          style={{ height: userBarHeight }}
                          className="w-4 rounded-t bg-[#84CC16] sm:w-6"
                          title="You"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 grid grid-cols-4 text-center text-[11px] font-medium text-slate-700">
                <span>English Language</span>
                <span>Quantitative Aptitude</span>
                <span>Reasoning Aptitude</span>
                <span>Overall</span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-6 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-[#EF4444]" />
                  <span>Cut off</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-[#3B82F6]" />
                  <span>Topper</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-[#84CC16]" />
                  <span>You</span>
                </span>
              </div>
            </section>
          </div>
        ) : (
          /* SOLUTION TAB: QUESTION + HANDWRITTEN SOLUTION PHOTO VIEWER */
          <div className="space-y-6">
            {/* Question Number Selector Bar + Prev/Next Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center gap-2">
                {mockQuestions.map((q, idx) => {
                  const chosen = userAnswers[q.id];
                  const isAnswered = chosen !== undefined && chosen !== null;
                  const isRight =
                    isAnswered && chosen === q.correctOptionIndex;

                  let pillClass =
                    'bg-white text-slate-700 border border-slate-300';
                  if (isAnswered) {
                    pillClass = isRight
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-[#EF4444] text-white border-[#EF4444]';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedQuestionIdx(idx)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${pillClass} ${
                        idx === selectedQuestionIdx
                          ? 'ring-2 ring-[#005A9C] ring-offset-2'
                          : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selectedQuestionIdx === 0}
                  onClick={() =>
                    setSelectedQuestionIdx((i) => Math.max(0, i - 1))
                  }
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  disabled={selectedQuestionIdx === mockQuestions.length - 1}
                  onClick={() =>
                    setSelectedQuestionIdx((i) =>
                      Math.min(mockQuestions.length - 1, i + 1)
                    )
                  }
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Question & Options Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Question No. {selectedQuestionIdx + 1} ({currentQuestion.id})
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                    <Clock className="h-3 w-3 text-[#005A9C]" />
                    <span>
                      {questionTimeSeconds[currentQuestion.id] || 3}s spent
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span>
                    {currentQuestion.exam} · {currentQuestion.chapter}
                  </span>
                  {onToggleBookmark && (
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(currentQuestion.id)}
                      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-bold transition-colors ${
                        currentQuestion.bookmarked
                          ? 'border-amber-400 bg-amber-50 text-amber-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${
                          currentQuestion.bookmarked
                            ? 'fill-amber-500 text-amber-500'
                            : ''
                        }`}
                      />
                      <span>
                        {currentQuestion.bookmarked ? 'Saved' : 'Save for Revision'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-900 sm:text-base">
                {currentQuestion.questionText}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {currentQuestion.options.map((optText, idx) => {
                  const isCorrect = currentQuestion.correctOptionIndex === idx;
                  const isChosen = userAnswers[currentQuestion.id] === idx;

                  let style = 'border-slate-200 bg-slate-50 text-slate-800';
                  if (isCorrect) {
                    style =
                      'border-[#16A34A] bg-[#F0FDF4] font-semibold text-[#14532D]';
                  } else if (isChosen && !isCorrect) {
                    style =
                      'border-[#EF4444] bg-[#FEF2F2] font-semibold text-[#7F1D1D]';
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm ${style} ${
                        idx === 4 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold">
                          ({OPTION_LABELS[idx]})
                        </span>
                        <span>{optText}</span>
                      </div>

                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A]">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Correct</span>
                        </span>
                      )}
                      {isChosen && !isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EF4444]">
                          <XCircle className="h-4 w-4" />
                          <span>Your Choice</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Handwritten Solution Image Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#16A34A]">
                    HANDWRITTEN NOTEBOOK SOLUTION
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Handwritten Calculation for Question{' '}
                    {selectedQuestionIdx + 1}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadFile}
                    className="hidden"
                  />
                  {onOpenDrawingPad && (
                    <button
                      type="button"
                      onClick={() => onOpenDrawingPad(currentQuestion)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
                    >
                      <PenTool className="h-3.5 w-3.5 text-amber-700" />
                      <span>Draw on Notebook Pad</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#005A9C] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#00487C]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>
                      {currentQuestion.handwrittenSolutionImage
                        ? 'Replace Handwritten Photo'
                        : 'Upload Handwritten Photo'}
                    </span>
                  </button>

                  {currentQuestion.handwrittenSolutionImage && (
                    <button
                      type="button"
                      onClick={() => setZoomHandwriting((z) => !z)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                      title="Toggle Zoom"
                    >
                      {zoomHandwriting ? (
                        <ZoomOut className="h-4 w-4" />
                      ) : (
                        <ZoomIn className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {currentQuestion.handwrittenSolutionImage ? (
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex justify-center">
                    <img
                      src={currentQuestion.handwrittenSolutionImage}
                      alt={`Handwritten solution for ${currentQuestion.id}`}
                      referrerPolicy="no-referrer"
                      className={`rounded-lg bg-white object-contain shadow-2xs ${
                        zoomHandwriting
                          ? 'max-w-none w-[1050px]'
                          : 'max-h-[480px] w-full'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                  <ImageIcon className="h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-bold text-slate-800">
                    No Handwritten Solution Uploaded Yet
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Upload a photo or scan of your handwritten solution for this
                    question.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803D]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Handwritten Solution Photo</span>
                  </button>
                </div>
              )}

              {currentQuestion.solutionNote && (
                <p className="mt-3 text-xs text-slate-600">
                  <strong className="font-bold text-slate-900">
                    Key Note:
                  </strong>{' '}
                  {currentQuestion.solutionNote}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
