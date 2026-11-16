import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  User,
  Sun,
  Moon,
} from 'lucide-react';
import {
  CustomMockTest,
  ExamSubject,
  QuestionItem,
} from '../../types/platform';
import {
  SmartLightbulbLogo,
  TcsIonStatus,
  TcsIonStatusBadge,
} from '../common/SmartKeedaIcons';

interface TcsIonSimulatorViewProps {
  mock: CustomMockTest;
  questions: QuestionItem[];
  themeMode?: 'light' | 'midnight';
  onToggleTheme?: () => void;
  onSubmitExam: (
    answers: Record<string, number | null>,
    timeSpentSeconds: number,
    questionTimeSeconds: Record<string, number>
  ) => void;
  onExitSimulator: () => void;
}

export const TcsIonSimulatorView: React.FC<TcsIonSimulatorViewProps> = ({
  mock,
  questions,
  themeMode = 'light',
  onToggleTheme,
  onSubmitExam,
  onExitSimulator,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number | null>
  >({});
  const [visitedMap, setVisitedMap] = useState<Record<string, boolean>>({});
  const [reviewMap, setReviewMap] = useState<Record<string, boolean>>({});
  const [questionTimeMap, setQuestionTimeMap] = useState<
    Record<string, number>
  >({});
  const [secondsLeft, setSecondsLeft] = useState(mock.durationMinutes * 60);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [fontScale, setFontScale] = useState<'sm' | 'base' | 'lg'>('base');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  const mockQuestions = useMemo(() => {
    const map = new Map(questions.map((q) => [q.id, q]));
    return mock.questionIds
      .map((id) => map.get(id))
      .filter((q): q is QuestionItem => Boolean(q));
  }, [mock, questions]);

  const currentQuestion = mockQuestions[currentIndex] || mockQuestions[0];

  // Mark current question as visited
  useEffect(() => {
    if (currentQuestion && !showInstructions) {
      setVisitedMap((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  }, [currentQuestion, showInstructions]);

  // Countdown timer & per-question time tracker
  useEffect(() => {
    if (showInstructions) return;
    const timer = window.setInterval(() => {
      if (currentQuestion) {
        setQuestionTimeMap((prev) => ({
          ...prev,
          [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
        }));
      }
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onSubmitExam(
            selectedAnswers,
            mock.durationMinutes * 60,
            questionTimeMap
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [
    showInstructions,
    mock.durationMinutes,
    onSubmitExam,
    selectedAnswers,
    currentQuestion,
    questionTimeMap,
  ]);

  if (!currentQuestion) return null;

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const rem = secs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0'
    )}:${String(rem).padStart(2, '0')}`;
  };

  const getQuestionStatus = (qId: string): TcsIonStatus => {
    const isAnswered =
      selectedAnswers[qId] !== undefined && selectedAnswers[qId] !== null;
    const isMarked = Boolean(reviewMap[qId]);
    const isVisited = Boolean(visitedMap[qId]);

    if (isAnswered && isMarked) return 'answered-review';
    if (!isAnswered && isMarked) return 'review';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  };

  // Compute Legend Counts
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let notVisitedCount = 0;
  let reviewCount = 0;
  let answeredReviewCount = 0;

  mockQuestions.forEach((q) => {
    const st = getQuestionStatus(q.id);
    if (st === 'answered') answeredCount++;
    else if (st === 'not-answered') notAnsweredCount++;
    else if (st === 'review') reviewCount++;
    else if (st === 'answered-review') answeredReviewCount++;
    else notVisitedCount++;
  });

  const handleSaveAndNext = () => {
    setReviewMap((prev) => ({ ...prev, [currentQuestion.id]: false }));
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    setReviewMap((prev) => ({ ...prev, [currentQuestion.id]: true }));
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: null }));
  };

  const handleFinalSubmit = () => {
    const elapsed = Math.max(1, mock.durationMinutes * 60 - secondsLeft);
    onSubmitExam(selectedAnswers, elapsed, questionTimeMap);
  };

  const sections: ExamSubject[] = [
    'English Language',
    'Quantitative Aptitude',
    'Reasoning Aptitude',
  ];

  // Official TCS iON Instructions View (Matches Screenshot 2)
  if (showInstructions) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <header className="border-b border-slate-300 py-2.5 text-center font-display text-sm font-bold text-[#1E3A8A]">
          {mock.title}
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 overflow-y-auto border-r border-slate-300">
            <div className="bg-[#B2EBF2] px-4 py-2 font-display text-sm font-bold text-slate-800">
              Instructions
            </div>

            <div className="space-y-4 p-6 text-xs leading-relaxed text-slate-800 sm:text-sm">
              <div className="flex justify-end">
                <label className="flex items-center gap-2 text-xs">
                  <span>View In :</span>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as 'English' | 'Hindi')
                    }
                    className="rounded border border-slate-300 px-2 py-1 text-xs"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </label>
              </div>

              <p className="font-bold">General Instructions:</p>
              <ol className="list-decimal space-y-2.5 pl-5">
                <li>
                  Total duration of examination is{' '}
                  <strong>{mock.durationMinutes} minutes</strong>.
                </li>
                <li>
                  The clock will be set at the server. The countdown timer in
                  the top right corner of screen will display the remaining time
                  available for you to complete the examination.
                </li>
                <li>
                  The Question Palette displayed on the right side of screen
                  will show the status of each question using one of the
                  following symbols:
                  <div className="my-3 space-y-2.5 pl-2">
                    <div className="flex items-center gap-3">
                      <TcsIonStatusBadge
                        status="not-visited"
                        label={1}
                        size="legend"
                      />
                      <span>You have not visited the question yet.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TcsIonStatusBadge
                        status="not-answered"
                        label={2}
                        size="legend"
                      />
                      <span>You have not answered the question.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TcsIonStatusBadge
                        status="answered"
                        label={3}
                        size="legend"
                      />
                      <span>You have answered the question.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TcsIonStatusBadge
                        status="review"
                        label={4}
                        size="legend"
                      />
                      <span>
                        You have NOT answered the question, but have marked the
                        question for review.
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TcsIonStatusBadge
                        status="answered-review"
                        label={5}
                        size="legend"
                      />
                      <span>
                        The question(s) &quot;Answered and Marked for
                        Review&quot; will be considered for evaluation.
                      </span>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Right Candidate Profile Column */}
          <aside className="flex w-full shrink-0 flex-col items-center border-t border-slate-200 p-6 lg:w-64 lg:border-t-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <User className="h-12 w-12" />
            </div>
            <p className="mt-3 font-display text-base font-bold text-slate-900">
              Chintan Chovatiya
            </p>
            <p className="text-xs text-slate-500">Roll No: 878081****[Chintan]</p>
          </aside>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-300 bg-white px-6 py-3">
          <button
            type="button"
            onClick={onExitSimulator}
            className="rounded border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowInstructions(false)}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      </div>
    );
  }

  const fontSizeClass =
    fontScale === 'lg'
      ? 'text-lg'
      : fontScale === 'sm'
      ? 'text-sm'
      : 'text-base';

  return (
    <div className="flex h-dvh w-full max-w-full flex-col overflow-hidden bg-white text-slate-900 select-none">
      {/* Row 1: Top Royal Blue Bar */}
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 bg-[#005A9C] px-2.5 text-white sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <SmartLightbulbLogo className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
          <span className="truncate font-display text-xs font-bold sm:text-sm">
            {mock.title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1 rounded border border-white/40 bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20 sm:px-2.5"
              title={
                themeMode === 'midnight'
                  ? 'Switch to Classic Light Theme'
                  : 'Switch to Midnight Focus High-Contrast Theme'
              }
            >
              {themeMode === 'midnight' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-300" />
                  <span className="hidden md:inline">Classic Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-sky-200" />
                  <span className="hidden md:inline">Midnight Focus</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowInstructions(true)}
            className="hidden rounded border border-white/40 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/10 sm:inline-block"
          >
            Instructions
          </button>

          <button
            type="button"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.().catch(() => {});
              } else {
                document.exitFullscreen?.().catch(() => {});
              }
            }}
            className="hidden h-8 w-8 items-center justify-center rounded border border-white/50 text-white hover:bg-white/10 sm:flex"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Font Size Controls (- T +) */}
          <div className="flex items-center gap-1 text-xs font-bold sm:gap-1.5 sm:text-sm">
            <button
              type="button"
              onClick={() => setFontScale('sm')}
              className="px-1 hover:text-sky-200"
              title="Decrease Font Size"
            >
              −
            </button>
            <span className="font-serif text-sm sm:text-base">T</span>
            <button
              type="button"
              onClick={() => setFontScale('lg')}
              className="px-1 hover:text-sky-200"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onExitSimulator}
            className="rounded bg-white px-2.5 py-1 text-[11px] font-bold text-[#005A9C] shadow-xs hover:bg-slate-100 sm:px-3.5 sm:py-1.5 sm:text-xs whitespace-nowrap"
          >
            Pause
          </button>
        </div>
      </header>

      {/* Row 2: Section Carousel & Time Left Row */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-300 bg-white text-xs sm:h-11 sm:text-sm">
        <div className="flex h-full min-w-0 flex-1 items-center border-r border-slate-300">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="flex h-full w-7 shrink-0 items-center justify-center border-r border-slate-300 text-slate-700 hover:bg-slate-100 sm:w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto px-2.5 font-medium text-slate-600 sm:px-3">
            <span className="truncate font-semibold text-slate-800">
              {mock.subjectScope}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => Math.min(mockQuestions.length - 1, i + 1))
            }
            className="flex h-full w-7 shrink-0 items-center justify-center border-l border-slate-300 text-slate-700 hover:bg-slate-100 sm:w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 px-2.5 sm:gap-2 sm:px-5">
          <span className="text-[11px] font-semibold text-slate-700 sm:text-xs">
            Time:
          </span>
          <span className="font-mono text-xs font-bold text-slate-900 tabular-nums sm:text-base">
            {formatTimer(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Row 3: Active Section Name & "View in English" Dropdown */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-300 bg-white px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-semibold text-slate-900">
            {currentQuestion.subject}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-700 sm:text-xs">View in</span>
          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value as 'English' | 'Hindi')
            }
            className="h-6 rounded border border-slate-400 bg-white px-1.5 text-[11px] font-medium text-slate-900 focus:outline-none sm:h-7 sm:px-2 sm:text-xs"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
      </div>

      {/* Main Middle Area: Question Viewport + Slide-Over / Side-by-Side TCS iON Palette */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-8 sm:py-5">
          <div className="max-w-3xl space-y-4 pb-10 sm:space-y-5">
            <p className="font-sans text-xs font-bold text-slate-900 sm:text-base">
              Question No. {currentIndex + 1} :
            </p>

            <div
              className={`whitespace-pre-line leading-relaxed text-slate-900 ${fontSizeClass}`}
            >
              {currentQuestion.questionText}
            </div>

            {/* 5 Radio Options */}
            <div className="space-y-3 pt-2 sm:space-y-4 sm:pt-3">
              {currentQuestion.options.map((optText, idx) => {
                const isSelected =
                  selectedAnswers[currentQuestion.id] === idx;
                return (
                  <label
                    key={idx}
                    onClick={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: idx,
                      }))
                    }
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 shrink-0 border-slate-400 text-[#005A9C] focus:ring-[#005A9C]"
                    />
                    <span className={`text-slate-900 ${fontSizeClass}`}>
                      {optText}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Backdrop for Question Palette */}
        {isPaletteOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
            onClick={() => setIsPaletteOpen(false)}
          />
        )}

        {/* Blue Edge Toggle Button (< / >) */}
        <button
          type="button"
          onClick={() => setIsPaletteOpen((v) => !v)}
          className={`fixed top-1/2 z-40 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-l bg-[#005A9C] text-white shadow-md transition-all lg:hidden ${
            isPaletteOpen ? 'right-[min(82vw,280px)]' : 'right-0'
          }`}
          aria-label="Toggle question palette"
        >
          {isPaletteOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Right TCS iON Question Palette Drawer */}
        <aside
          className={`fixed inset-y-0 right-0 z-30 flex w-[82vw] max-w-[280px] shrink-0 flex-col border-l border-slate-300 bg-white shadow-2xl transition-transform duration-200 lg:static lg:w-80 lg:max-w-none lg:translate-x-0 lg:shadow-none ${
            isPaletteOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Candidate Info Header */}
          <div className="border-b border-slate-300 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-600">
                <User className="h-7 w-7" />
              </div>
              <span className="font-display text-base font-bold text-slate-900">
                Chintan Chovatiya
              </span>
            </div>
          </div>

          <div className="border-b border-slate-300 px-4 py-1.5 text-center text-xs font-medium text-slate-800">
            Roll No: 878081****[Chintan]
          </div>

          {/* 5 TCS iON Status Legend Counts (Matches Screenshot 1) */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 border-b border-slate-300 px-3 py-3 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <TcsIonStatusBadge
                status="answered"
                label={answeredCount}
                size="legend"
              />
              <span>Answered</span>
            </div>

            <div className="flex items-center gap-2">
              <TcsIonStatusBadge
                status="not-answered"
                label={notAnsweredCount}
                size="legend"
              />
              <span>Not Answered</span>
            </div>

            <div className="flex items-center gap-2">
              <TcsIonStatusBadge
                status="not-visited"
                label={notVisitedCount}
                size="legend"
              />
              <span>Not Visited</span>
            </div>

            <div className="flex items-center gap-2">
              <TcsIonStatusBadge
                status="review"
                label={reviewCount}
                size="legend"
              />
              <span className="leading-tight">Mark For Review</span>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <TcsIonStatusBadge
                status="answered-review"
                label={answeredReviewCount}
                size="legend"
              />
              <span>Answered &amp; Mark for Review</span>
            </div>
          </div>

          {/* Section Title Bar in Royal Blue */}
          <div className="bg-[#005A9C] py-2 text-center font-display text-sm font-semibold text-white">
            {currentQuestion.subject || sections[0]}
          </div>

          {/* 4-Column Question Number Grid on Light Sky-Blue (#EBF5FB) */}
          <div className="flex-1 overflow-y-auto bg-[#EBF5FB] p-4">
            <div className="grid grid-cols-4 gap-3 place-items-center">
              {mockQuestions.map((q, idx) => (
                <TcsIonStatusBadge
                  key={q.id}
                  status={getQuestionStatus(q.id)}
                  label={idx + 1}
                  size="grid"
                  isCurrent={idx === currentIndex}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPaletteOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Sticky Action Footer (Matches Screenshot 4) */}
      <footer className="shrink-0 border-t border-slate-300 bg-[#F8FAFC]">
        {/* Upper Row: Mark for Review & Next | Clear Response */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-6">
          <button
            type="button"
            onClick={handleMarkForReviewAndNext}
            className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 sm:text-sm"
          >
            Mark for Review &amp; Next
          </button>

          <button
            type="button"
            onClick={handleClearResponse}
            className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 sm:text-sm"
          >
            Clear Response
          </button>
        </div>

        {/* Lower Split Bar: SUBMIT SECTION (Blue) | Save & Next (Green) */}
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="bg-[#6495ED] py-3 text-center font-display text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#4F83E2] sm:text-sm"
          >
            SUBMIT SECTION / TEST
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            className="bg-[#00A651] py-3 text-center font-display text-xs font-bold text-white transition-colors hover:bg-[#008C44] sm:text-sm"
          >
            Save &amp; Next
          </button>
        </div>
      </footer>
    </div>
  );
};
