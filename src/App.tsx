/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  BankingExam,
  CustomMockTest,
  MockAttemptRecord,
  MockTestCategory,
  PortalView,
  QuestionItem,
} from './types/platform';
import {
  INITIAL_CUSTOM_MOCKS,
  INITIAL_QUESTIONS,
} from './data/sampleBankingData';
import { SmartKeedaShell } from './components/layout/SmartKeedaShell';
import { SmartKeedaHomePage } from './components/pages/SmartKeedaHomePage';
import { ExamSeriesListPage } from './components/pages/ExamSeriesListPage';
import { QuestionBankPage } from './components/pages/QuestionBankPage';
import { CreateMockPage } from './components/pages/CreateMockPage';
import { AddQuestionStudioPage } from './components/pages/AddQuestionStudioPage';
import { TcsIonSimulatorView } from './components/exam/TcsIonSimulatorView';
import { SmartAnalyticsAndSolutionsView } from './components/exam/SmartAnalyticsAndSolutionsView';
import { HandwrittenSolutionLightbox } from './components/modals/HandwrittenSolutionLightbox';
import { HandwritingPadModal } from './components/modals/HandwritingPadModal';
import { AdminLockModal } from './components/modals/AdminLockModal';

const STORAGE_KEYS = {
  QUESTIONS: 'smartkeeda_custom_questions_v4',
  MOCKS: 'smartkeeda_custom_mocks_v4',
  ATTEMPTS: 'vakratund_attempt_history_v1',
  THEME: 'vakratund_theme_mode_v1',
};

export default function App() {
  const [activeView, setActiveView] = useState<PortalView>('home');
  const [selectedExam, setSelectedExam] = useState<BankingExam>('SBI PO');
  const [selectedCategory, setSelectedCategory] =
    useState<MockTestCategory>('Full Length Tests');
  const [searchQuery, setSearchQuery] = useState('');

  // Classic Light vs Midnight Focus High-Contrast Theme
  const [themeMode, setThemeMode] = useState<'light' | 'midnight'>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === 'midnight' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch {
      // Ignore storage error
    }
    return 'light';
  });

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'midnight' : 'light'));
  };

  // Admin Lock State (Protected by Chintan@2005; auto-locks whenever leaving Admin Studio)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState<boolean>(false);
  const pendingAdminActionRef = useRef<(() => void) | null>(null);

  const requireAdminAccess = (
    action: () => void,
    keepUnlockedForStudio = false
  ) => {
    if (isAdminUnlocked) {
      action();
      if (!keepUnlockedForStudio) {
        setIsAdminUnlocked(false);
      }
    } else {
      pendingAdminActionRef.current = () => {
        setIsAdminUnlocked(keepUnlockedForStudio);
        action();
      };
      setIsLockModalOpen(true);
    }
  };

  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial questions
    }
    return INITIAL_QUESTIONS;
  });

  const [mocks, setMocks] = useState<CustomMockTest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOCKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial mocks
    }
    return INITIAL_CUSTOM_MOCKS;
  });

  const [attempts, setAttempts] = useState<MockAttemptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(
    null
  );
  const [editingMock, setEditingMock] = useState<CustomMockTest | null>(null);
  const [lightboxQuestionId, setLightboxQuestionId] = useState<string | null>(
    null
  );
  const [drawingPadQuestionId, setDrawingPadQuestionId] = useState<
    string | null
  >(null);

  // Active Mock for Simulator or Analytics/Solutions
  const [activeMock, setActiveMock] = useState<CustomMockTest | null>(null);
  const [lastAttemptAnswers, setLastAttemptAnswers] = useState<
    Record<string, number | null>
  >({});
  const [lastAttemptSeconds, setLastAttemptSeconds] = useState<number>(15);
  const [lastQuestionTimes, setLastQuestionTimes] = useState<
    Record<string, number>
  >({});
  const [analyticsInitialTab, setAnalyticsInitialTab] = useState<
    'overview' | 'solution'
  >('overview');

  // Apply Classic Light or Midnight Focus High-Contrast Theme
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'midnight') {
      root.classList.add('midnight-focus', 'dark');
    } else {
      root.classList.remove('midnight-focus', 'dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    } catch {
      // Ignore storage error
    }
  }, [themeMode]);

  // Automatically re-lock Admin Mode whenever leaving 'create-mock' or 'add-question'
  useEffect(() => {
    if (activeView !== 'create-mock' && activeView !== 'add-question') {
      setIsAdminUnlocked(false);
    }
  }, [activeView]);

  // Persist Questions (with handwritten solution photos)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch {
      // Ignore storage quota errors
    }
  }, [questions]);

  // Persist Custom Mocks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOCKS, JSON.stringify(mocks));
    } catch {
      // Ignore storage quota errors
    }
  }, [mocks]);

  // Persist Attempt History
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch {
      // Ignore storage quota errors
    }
  }, [attempts]);

  const handleNavigate = (view: PortalView, category?: MockTestCategory) => {
    if (view === 'create-mock' || view === 'add-question') {
      requireAdminAccess(() => {
        if (category) {
          setSelectedCategory(category);
        }
        if (view === 'create-mock') {
          setEditingQuestion(null);
          setEditingMock(null);
        }
        setActiveView(view);
      }, true);
      return;
    }

    if (category) {
      setSelectedCategory(category);
    }
    setEditingQuestion(null);
    setEditingMock(null);
    setIsAdminUnlocked(false);
    setActiveView(view);
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setEditingQuestion(null);
    setEditingMock(null);
    if (activeView === 'create-mock' || activeView === 'add-question') {
      setActiveView('exam-series');
    }
  };

  const handleSelectExamSeries = (
    exam: BankingExam,
    category: MockTestCategory = 'Full Length Tests'
  ) => {
    setSelectedExam(exam);
    setSelectedCategory(category);
    setIsAdminUnlocked(false);
    setActiveView('exam-series');
  };

  const handleSaveQuestion = (saved: QuestionItem, isNew: boolean) => {
    if (isNew) {
      setQuestions((prev) => [saved, ...prev]);
    } else {
      setQuestions((prev) =>
        prev.map((q) => (q.id === saved.id ? saved : q))
      );
    }
    setEditingQuestion(null);
    setIsAdminUnlocked(false);
    setActiveView('question-bank');
  };

  const handleDeleteQuestion = (id: string) => {
    requireAdminAccess(() => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }, false);
  };

  const handleToggleBookmark = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, bookmarked: !q.bookmarked } : q
      )
    );
  };

  const handleUpdateHandwrittenImage = (
    questionId: string,
    dataUrl: string,
    fileName: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              handwrittenSolutionImage: dataUrl,
              handwrittenFileName: fileName,
            }
          : q
      )
    );
  };

  const handleProtectedUpdateHandwrittenImage = (
    questionId: string,
    dataUrl: string,
    fileName: string
  ) => {
    requireAdminAccess(() => {
      handleUpdateHandwrittenImage(questionId, dataUrl, fileName);
    }, false);
  };

  const handleSaveMock = (savedMock: CustomMockTest, isExisting: boolean) => {
    if (isExisting) {
      setMocks((prev) =>
        prev.map((m) => (m.id === savedMock.id ? savedMock : m))
      );
    } else {
      setMocks((prev) => [savedMock, ...prev]);
    }
    setEditingMock(null);
    setSelectedExam(savedMock.exam);
    setSelectedCategory(savedMock.category);
    setIsAdminUnlocked(false);
    setActiveView('exam-series');
  };

  const handleDeleteMock = (id: string) => {
    requireAdminAccess(() => {
      setMocks((prev) => prev.filter((m) => m.id !== id));
      if (editingMock?.id === id) {
        setEditingMock(null);
      }
    }, activeView === 'create-mock');
  };

  const handleCustomizeMock = (mock: CustomMockTest) => {
    requireAdminAccess(() => {
      setEditingMock(mock);
      setActiveView('create-mock');
    }, true);
  };

  const handleRecordExamSubmit = (
    mock: CustomMockTest,
    answers: Record<string, number | null>,
    elapsedSecs: number,
    questionTimeSeconds: Record<string, number>
  ) => {
    const qMap = new Map(questions.map((q) => [q.id, q]));
    const validQs = mock.questionIds
      .map((id) => qMap.get(id))
      .filter((q): q is QuestionItem => Boolean(q));

    let correct = 0;
    let wrong = 0;
    validQs.forEach((q) => {
      const ans = answers[q.id];
      if (ans !== undefined && ans !== null) {
        if (ans === q.correctOptionIndex) correct++;
        else wrong++;
      }
    });

    const maxMarks = validQs.length * mock.positiveMarks;
    const rawScore = correct * mock.positiveMarks - wrong * mock.negativeMarks;
    const netScore = Number(rawScore.toFixed(2));
    const attemptedCount = correct + wrong;
    const accuracyPercent =
      attemptedCount > 0 ? Math.round((correct / attemptedCount) * 100) : 0;

    const record: MockAttemptRecord = {
      id: `ATT-${Date.now()}`,
      mockId: mock.id,
      mockTitle: mock.title,
      exam: mock.exam,
      answers,
      questionTimeSeconds,
      totalTimeSeconds: elapsedSecs,
      netScore,
      maxMarks,
      accuracyPercent,
      attemptedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    setAttempts((prev) => [record, ...prev]);
    setLastAttemptAnswers(answers);
    setLastAttemptSeconds(elapsedSecs);
    setLastQuestionTimes(questionTimeSeconds);
    setAnalyticsInitialTab('overview');
    setActiveView('analytics');
  };

  const handleExportBackup = () => {
    const payload = {
      platform: 'Vakratund Banking Exam Platform',
      exportedAt: new Date().toISOString(),
      questions,
      mocks,
      attempts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vakratund-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (file: File) => {
    requireAdminAccess(() => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            setQuestions(parsed.questions);
          }
          if (Array.isArray(parsed.mocks) && parsed.mocks.length > 0) {
            setMocks(parsed.mocks);
          }
          if (Array.isArray(parsed.attempts)) {
            setAttempts(parsed.attempts);
          }
        } catch {
          // Ignore invalid backup file
        }
      };
      reader.readAsText(file);
    }, false);
  };

  const drawingPadQuestion =
    questions.find((q) => q.id === drawingPadQuestionId) || null;

  // Dedicated Full-Screen TCS iON Simulator View
  if (activeView === 'simulator' && activeMock) {
    return (
      <TcsIonSimulatorView
        mock={activeMock}
        questions={questions}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onSubmitExam={(answers, elapsedSecs, questionTimes) =>
          handleRecordExamSubmit(activeMock, answers, elapsedSecs, questionTimes)
        }
        onExitSimulator={() => setActiveView('exam-series')}
      />
    );
  }

  // Dedicated Full-Screen Post-Test Smart Analytics & Handwritten Solution View
  if (activeView === 'analytics' && activeMock) {
    return (
      <>
        <SmartAnalyticsAndSolutionsView
          mock={activeMock}
          questions={questions}
          userAnswers={lastAttemptAnswers}
          timeSpentSeconds={lastAttemptSeconds}
          questionTimeSeconds={lastQuestionTimes}
          initialTab={analyticsInitialTab}
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          onBackToSeries={() => setActiveView('exam-series')}
          onRetakeMock={() => {
            setLastAttemptAnswers({});
            setLastQuestionTimes({});
            setActiveView('simulator');
          }}
          onUpdateHandwrittenImage={handleProtectedUpdateHandwrittenImage}
          onToggleBookmark={handleToggleBookmark}
          onOpenDrawingPad={(q) =>
            requireAdminAccess(() => {
              setDrawingPadQuestionId(q.id);
            }, false)
          }
        />
        {drawingPadQuestion && (
          <HandwritingPadModal
            questionTitle={drawingPadQuestion.questionText}
            chapterName={drawingPadQuestion.chapter}
            onSaveDrawing={(dataUrl, fileName) =>
              handleUpdateHandwrittenImage(
                drawingPadQuestion.id,
                dataUrl,
                fileName
              )
            }
            onClose={() => setDrawingPadQuestionId(null)}
          />
        )}
        <AdminLockModal
          isOpen={isLockModalOpen}
          onClose={() => {
            setIsLockModalOpen(false);
            pendingAdminActionRef.current = null;
          }}
          onUnlockSuccess={() => {
            setIsLockModalOpen(false);
            const pending = pendingAdminActionRef.current;
            pendingAdminActionRef.current = null;
            if (pending) {
              pending();
            }
          }}
        />
      </>
    );
  }

  const inspectedQuestion =
    questions.find((q) => q.id === lightboxQuestionId) || null;

  const bookmarkedCount = questions.filter((q) => q.bookmarked).length;

  return (
    <SmartKeedaShell
      activeView={activeView}
      activeCategory={selectedCategory}
      onNavigate={handleNavigate}
      searchQuery={searchQuery}
      onSearchChange={(q) => {
        setSearchQuery(q);
        if (q.trim() && activeView === 'home') {
          setActiveView('exam-series');
        }
      }}
      questionCount={questions.length}
      bookmarkedCount={bookmarkedCount}
      mockCount={mocks.length}
      isAdminUnlocked={isAdminUnlocked}
      onLockAdmin={handleLockAdmin}
      themeMode={themeMode}
      onToggleTheme={handleToggleTheme}
      onExportBackup={handleExportBackup}
      onImportBackup={handleImportBackup}
    >
      {activeView === 'home' && (
        <SmartKeedaHomePage
          questions={questions}
          attempts={attempts}
          onSelectExamSeries={handleSelectExamSeries}
          onNavigate={handleNavigate}
          onInspectQuestionSolution={(q) => setLightboxQuestionId(q.id)}
          onOpenAttemptAnalytics={(att) => {
            const targetMock =
              mocks.find((m) => m.id === att.mockId) || mocks[0];
            if (targetMock) {
              setActiveMock(targetMock);
              setLastAttemptAnswers(att.answers);
              setLastAttemptSeconds(att.totalTimeSeconds);
              setLastQuestionTimes(att.questionTimeSeconds || {});
              setAnalyticsInitialTab('solution');
              setActiveView('analytics');
            }
          }}
        />
      )}

      {activeView === 'exam-series' && (
        <ExamSeriesListPage
          selectedExam={selectedExam}
          selectedCategory={selectedCategory}
          onSelectExam={setSelectedExam}
          mocks={mocks}
          questions={questions}
          attempts={attempts}
          onStartMockSimulator={(mock) => {
            setActiveMock(mock);
            setLastAttemptAnswers({});
            setLastQuestionTimes({});
            setActiveView('simulator');
          }}
          onOpenMockAnalyticsAndSolutions={(mock) => {
            const latestAtt = attempts.find((a) => a.mockId === mock.id);
            setActiveMock(mock);
            setLastAttemptAnswers(latestAtt?.answers || {});
            setLastAttemptSeconds(latestAtt?.totalTimeSeconds || 15);
            setLastQuestionTimes(latestAtt?.questionTimeSeconds || {});
            setAnalyticsInitialTab('solution');
            setActiveView('analytics');
          }}
          onCustomizeMock={handleCustomizeMock}
          onNavigate={handleNavigate}
        />
      )}

      {(activeView === 'question-bank' || activeView === 'bookmarks') && (
        <QuestionBankPage
          questions={questions}
          bookmarkedOnly={activeView === 'bookmarks'}
          onOpenAddQuestion={() =>
            requireAdminAccess(() => {
              setEditingQuestion(null);
              setActiveView('add-question');
            }, true)
          }
          onEditQuestion={(q) =>
            requireAdminAccess(() => {
              setEditingQuestion(q);
              setActiveView('add-question');
            }, true)
          }
          onDeleteQuestion={handleDeleteQuestion}
          onToggleBookmark={handleToggleBookmark}
          onOpenHandwrittenLightbox={(q) => setLightboxQuestionId(q.id)}
          onOpenDrawingPad={(q) =>
            requireAdminAccess(() => {
              setDrawingPadQuestionId(q.id);
            }, false)
          }
          onQuickUploadHandwritten={handleProtectedUpdateHandwrittenImage}
        />
      )}

      {activeView === 'create-mock' && (
        <CreateMockPage
          questions={questions}
          mocks={mocks}
          defaultExam={selectedExam}
          initialEditingMock={editingMock}
          onSaveMock={handleSaveMock}
          onDeleteMock={handleDeleteMock}
          onOpenAddQuestion={() =>
            requireAdminAccess(() => {
              setEditingQuestion(null);
              setActiveView('add-question');
            }, true)
          }
          onLockAndExit={handleLockAdmin}
        />
      )}

      {activeView === 'add-question' && (
        <AddQuestionStudioPage
          editingQuestion={editingQuestion}
          onSaveQuestion={handleSaveQuestion}
          onCancel={() => {
            setEditingQuestion(null);
            setIsAdminUnlocked(false);
            setActiveView('question-bank');
          }}
        />
      )}

      {/* Handwritten Solution Lightbox */}
      <HandwrittenSolutionLightbox
        question={inspectedQuestion}
        onClose={() => setLightboxQuestionId(null)}
        onUpdateHandwrittenImage={handleProtectedUpdateHandwrittenImage}
      />

      {/* Interactive Live Notebook Drawing Pad Modal */}
      {drawingPadQuestion && (
        <HandwritingPadModal
          questionTitle={drawingPadQuestion.questionText}
          chapterName={drawingPadQuestion.chapter}
          onSaveDrawing={(dataUrl, fileName) =>
            handleUpdateHandwrittenImage(
              drawingPadQuestion.id,
              dataUrl,
              fileName
            )
          }
          onClose={() => setDrawingPadQuestionId(null)}
        />
      )}

      {/* Admin Password Lock Modal */}
      <AdminLockModal
        isOpen={isLockModalOpen}
        onClose={() => {
          setIsLockModalOpen(false);
          pendingAdminActionRef.current = null;
        }}
        onUnlockSuccess={() => {
          setIsLockModalOpen(false);
          const pending = pendingAdminActionRef.current;
          pendingAdminActionRef.current = null;
          if (pending) {
            pending();
          }
        }}
      />
    </SmartKeedaShell>
  );
}
