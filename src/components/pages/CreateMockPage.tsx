import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  CheckCircle2,
  Image as ImageIcon,
  FilePlus2,
  Pencil,
  Trash2,
  ShieldCheck,
  RotateCcw,
  Lock,
} from 'lucide-react';
import {
  BankingExam,
  CustomMockTest,
  ExamSubject,
  MockTestCategory,
  QuestionItem,
} from '../../types/platform';
import {
  BANKING_EXAMS,
  EXAM_SUBJECTS,
  MOCK_CATEGORIES,
} from '../../data/sampleBankingData';

interface CreateMockPageProps {
  questions: QuestionItem[];
  mocks: CustomMockTest[];
  defaultExam: BankingExam;
  initialEditingMock?: CustomMockTest | null;
  onSaveMock: (mock: CustomMockTest, isExisting: boolean) => void;
  onDeleteMock: (id: string) => void;
  onOpenAddQuestion: () => void;
  onLockAndExit: () => void;
}

export const CreateMockPage: React.FC<CreateMockPageProps> = ({
  questions,
  mocks,
  defaultExam,
  initialEditingMock = null,
  onSaveMock,
  onDeleteMock,
  onOpenAddQuestion,
  onLockAndExit,
}) => {
  const [editingMockId, setEditingMockId] = useState<string | null>(
    initialEditingMock?.id || null
  );
  const [title, setTitle] = useState(
    initialEditingMock?.title || `${defaultExam} Mock Test (Pre)`
  );
  const [exam, setExam] = useState<BankingExam>(
    initialEditingMock?.exam || defaultExam
  );
  const [category, setCategory] = useState<MockTestCategory>(
    initialEditingMock?.category || 'Full Length Tests'
  );
  const [tagType, setTagType] = useState<
    'pattern' | 'easy' | 'moderate' | 'hard'
  >(initialEditingMock?.tagType || 'pattern');
  const [tagLabel, setTagLabel] = useState(
    initialEditingMock?.tagLabel || 'Exam Pattern Based'
  );
  const [durationMinutes, setDurationMinutes] = useState(
    initialEditingMock?.durationMinutes || 20
  );
  const [positiveMarks, setPositiveMarks] = useState(
    initialEditingMock?.positiveMarks || 1.0
  );
  const [negativeMarks, setNegativeMarks] = useState(
    initialEditingMock?.negativeMarks ?? 0.25
  );
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    initialEditingMock?.questionIds || questions.map((q) => q.id)
  );
  const [filterSubject, setFilterSubject] = useState<'ALL' | ExamSubject>(
    'ALL'
  );

  useEffect(() => {
    if (initialEditingMock) {
      setEditingMockId(initialEditingMock.id);
      setTitle(initialEditingMock.title);
      setExam(initialEditingMock.exam);
      setCategory(initialEditingMock.category);
      setTagType(initialEditingMock.tagType);
      setTagLabel(initialEditingMock.tagLabel);
      setDurationMinutes(initialEditingMock.durationMinutes);
      setPositiveMarks(initialEditingMock.positiveMarks);
      setNegativeMarks(initialEditingMock.negativeMarks);
      setSelectedQuestionIds(initialEditingMock.questionIds);
    }
  }, [initialEditingMock]);

  const handleLoadMockForEdit = (mock: CustomMockTest) => {
    setEditingMockId(mock.id);
    setTitle(mock.title);
    setExam(mock.exam);
    setCategory(mock.category);
    setTagType(mock.tagType);
    setTagLabel(mock.tagLabel);
    setDurationMinutes(mock.durationMinutes);
    setPositiveMarks(mock.positiveMarks);
    setNegativeMarks(mock.negativeMarks);
    setSelectedQuestionIds(mock.questionIds);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToNewMock = () => {
    setEditingMockId(null);
    setTitle(`${defaultExam} Mock Test (Pre)`);
    setExam(defaultExam);
    setCategory('Full Length Tests');
    setTagType('pattern');
    setTagLabel('Exam Pattern Based');
    setDurationMinutes(20);
    setPositiveMarks(1.0);
    setNegativeMarks(0.25);
    setSelectedQuestionIds(questions.map((q) => q.id));
  };

  const filteredQuestions = useMemo(() => {
    if (filterSubject === 'ALL') return questions;
    return questions.filter((q) => q.subject === filterSubject);
  }, [questions, filterSubject]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredQuestions.map((q) => q.id);
    const allSelected = filteredIds.every((id) =>
      selectedQuestionIds.includes(id)
    );
    if (allSelected) {
      setSelectedQuestionIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedQuestionIds((prev) =>
        Array.from(new Set([...prev, ...filteredIds]))
      );
    }
  };

  const handleCreateOrUpdateMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestionIds.length === 0) return;

    const existingMock = mocks.find((m) => m.id === editingMockId);

    const savedMock: CustomMockTest = {
      id: editingMockId || `MOCK-${Math.floor(100 + Math.random() * 899)}`,
      testNumber: existingMock?.testNumber || 1,
      title: title.trim() || `${exam} Mock Test (Pre)`,
      tagLabel:
        tagType === 'pattern'
          ? tagLabel.trim() || 'Exam Pattern Based'
          : tagType.charAt(0).toUpperCase() + tagType.slice(1),
      tagType,
      isFree: true,
      exam,
      category,
      subjectScope: 'English, Quant & Reasoning',
      durationMinutes: Math.max(1, durationMinutes),
      positiveMarks: Number(positiveMarks) || 1.0,
      negativeMarks: Number(negativeMarks) >= 0 ? Number(negativeMarks) : 0.25,
      cutoffMarks: Number(
        (selectedQuestionIds.length * (Number(positiveMarks) || 1) * 0.55).toFixed(2)
      ),
      questionIds: selectedQuestionIds,
      createdAt:
        existingMock?.createdAt ||
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    };

    onSaveMock(savedMock, Boolean(editingMockId));
  };

  return (
    <div className="space-y-8">
      {/* Admin Security Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/90 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-extrabold text-amber-950">
              Admin Protected Mock Studio (Auto-Locks on Exit)
            </p>
            <p className="text-[11px] text-amber-800">
              As soon as you save or leave this page, Admin Mode automatically locks again so no one else can modify mocks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLockAndExit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800"
        >
          <Lock className="h-3.5 w-3.5 text-amber-300" />
          <span>Lock &amp; Exit Studio</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#E11D48]" />
            <h1 className="font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
              {editingMockId
                ? `Customize Mock Test (${editingMockId})`
                : 'Create Your Own Custom Mock Test'}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Configure your test row for the Vakratund Test Series list and pick
            questions with handwritten solutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {editingMockId && (
            <button
              type="button"
              onClick={handleResetToNewMock}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Switch to New Mock</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAddQuestion}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4 text-[#005A9C]" />
            <span>Add New Question + Handwritten Photo</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleCreateOrUpdateMock}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
      >
        {/* Left 5 Columns: Mock Settings */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-5">
          <h2 className="font-display text-sm font-extrabold text-slate-900">
            1. {editingMockId ? 'Edit Mock Configuration' : 'Mock Test Configuration'}
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Target Banking Exam
            </label>
            <select
              value={exam}
              onChange={(e) => {
                const nextExam = e.target.value as BankingExam;
                setExam(nextExam);
                if (!editingMockId) {
                  setTitle(`${nextExam} Mock Test (Pre)`);
                }
              }}
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
            >
              {BANKING_EXAMS.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Mock Test Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., SBI PO Mock Test (Pre)"
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-medium text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Test Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as MockTestCategory)
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-medium text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
              >
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(parseInt(e.target.value, 10) || 20)
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 font-mono text-xs font-bold text-slate-900 tabular-nums focus:border-[#005A9C] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Marks per Correct
              </label>
              <input
                type="number"
                step="0.25"
                min={0.25}
                value={positiveMarks}
                onChange={(e) =>
                  setPositiveMarks(parseFloat(e.target.value) || 1.0)
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 font-mono text-xs font-bold text-slate-900 tabular-nums focus:border-[#005A9C] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Negative Marks
              </label>
              <input
                type="number"
                step="0.05"
                min={0}
                value={negativeMarks}
                onChange={(e) =>
                  setNegativeMarks(parseFloat(e.target.value) || 0)
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 font-mono text-xs font-bold text-slate-900 tabular-nums focus:border-[#005A9C] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Badge Style
              </label>
              <select
                value={tagType}
                onChange={(e) =>
                  setTagType(
                    e.target.value as 'pattern' | 'easy' | 'moderate' | 'hard'
                  )
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-medium text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
              >
                <option value="pattern">Blue Pattern Tag</option>
                <option value="easy">Easy (Green)</option>
                <option value="moderate">Moderate (Amber)</option>
                <option value="hard">Hard (Red)</option>
              </select>
            </div>

            {tagType === 'pattern' && (
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Pattern Badge Text
                </label>
                <input
                  type="text"
                  value={tagLabel}
                  onChange={(e) => setTagLabel(e.target.value)}
                  placeholder="Exam Pattern Based"
                  className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-medium text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={selectedQuestionIds.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#15803D] px-5 py-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#166534] disabled:opacity-50"
          >
            <FilePlus2 className="h-4 w-4" />
            <span>
              {editingMockId
                ? `Save Mock Changes & Lock (${selectedQuestionIds.length} Ques.)`
                : `Publish Mock Test & Lock (${selectedQuestionIds.length} Ques.)`}
            </span>
          </button>
        </div>

        {/* Right 7 Columns: Question Picker */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-display text-sm font-extrabold text-slate-900">
                2. Select Questions from Bank ({selectedQuestionIds.length}{' '}
                Selected)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterSubject}
                onChange={(e) =>
                  setFilterSubject(e.target.value as 'ALL' | ExamSubject)
                }
                aria-label="Filter questions by subject"
                className="h-8 rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-medium text-slate-700"
              >
                <option value="ALL">All Sections</option>
                {EXAM_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-bold text-[#005A9C] hover:bg-slate-50"
              >
                Toggle All
              </button>
            </div>
          </div>

          <div className="max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
            {filteredQuestions.map((q) => {
              const isSelected = selectedQuestionIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => toggleQuestion(q.id)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                    isSelected
                      ? 'border-[#005A9C] bg-[#F0F9FF]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 text-[#005A9C]">
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span>
                        <strong className="font-mono text-slate-900">
                          {q.id}
                        </strong>{' '}
                        · {q.subject} · {q.chapter}
                      </span>

                      {q.handwrittenSolutionImage ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Handwritten Solution</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>No photo yet</span>
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-900">
                      {q.questionText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* Section 3: Existing Mock Tests Manager (Edit / Customize / Delete) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-display text-base font-extrabold text-slate-900">
              3. Manage &amp; Customize Existing Mock Tests ({mocks.length})
            </h2>
            <p className="text-xs text-slate-500">
              Only Admin can edit or delete existing mock tests from this protected panel.
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-200">
          {mocks.map((m, idx) => {
            const isBeingEdited = editingMockId === m.id;
            return (
              <div
                key={m.id}
                className={`flex flex-wrap items-center justify-between gap-3 py-3.5 px-3 rounded-lg ${
                  isBeingEdited ? 'bg-sky-50 border border-sky-200' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 font-mono text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-slate-900 truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.exam} · {m.category} · {m.questionIds.length} Ques ·{' '}
                      {m.durationMinutes} Mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadMockForEdit(m)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#005A9C] hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>{isBeingEdited ? 'Editing Now' : 'Customize'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteMock(m.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
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
