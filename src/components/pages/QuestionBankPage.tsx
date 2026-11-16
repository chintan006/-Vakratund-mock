import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  Image as ImageIcon,
  Upload,
  Pencil,
  Trash2,
  CheckCircle2,
  Eye,
  Bookmark,
  PenTool,
} from 'lucide-react';
import {
  BankingExam,
  ExamSubject,
  QuestionItem,
} from '../../types/platform';
import {
  BANKING_EXAMS,
  EXAM_SUBJECTS,
} from '../../data/sampleBankingData';
import { processHandwrittenImageFile } from '../../utils/imageCompressor';

interface QuestionBankPageProps {
  questions: QuestionItem[];
  bookmarkedOnly?: boolean;
  onOpenAddQuestion: () => void;
  onEditQuestion: (question: QuestionItem) => void;
  onDeleteQuestion: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenHandwrittenLightbox: (question: QuestionItem) => void;
  onOpenDrawingPad: (question: QuestionItem) => void;
  onQuickUploadHandwritten: (
    questionId: string,
    dataUrl: string,
    fileName: string
  ) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({
  questions,
  bookmarkedOnly = false,
  onOpenAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onToggleBookmark,
  onOpenHandwrittenLightbox,
  onOpenDrawingPad,
  onQuickUploadHandwritten,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<'ALL' | BankingExam>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | ExamSubject>(
    'ALL'
  );
  const [uploadingQuestionId, setUploadingQuestionId] = useState<string | null>(
    null
  );
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (bookmarkedOnly && !q.bookmarked) return false;

      const matchesSearch =
        !searchQuery.trim() ||
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExam = selectedExam === 'ALL' || q.exam === selectedExam;
      const matchesSubject =
        selectedSubject === 'ALL' || q.subject === selectedSubject;

      return matchesSearch && matchesExam && matchesSubject;
    });
  }, [questions, bookmarkedOnly, searchQuery, selectedExam, selectedSubject]);

  const triggerQuickUpload = (questionId: string) => {
    setUploadingQuestionId(questionId);
    quickFileInputRef.current?.click();
  };

  const handleQuickFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingQuestionId) return;
    try {
      const { dataUrl, fileName } = await processHandwrittenImageFile(file);
      onQuickUploadHandwritten(uploadingQuestionId, dataUrl, fileName);
    } finally {
      setUploadingQuestionId(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={quickFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleQuickFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#E11D48]" />
            <h1 className="font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
              {bookmarkedOnly
                ? 'Saved Questions & Handwritten Revision Vault'
                : 'Handwritten Question & Solution Bank'}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            {bookmarkedOnly
              ? 'Quickly revise your starred questions alongside your handwritten notebook solutions.'
              : 'Upload photos or draw handwritten solutions on the live notebook pad for every question.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddQuestion}
          className="inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-[#166534] whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question + Handwritten Solution</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by question text, chapter, or ID..."
            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-[#005A9C] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedExam}
            onChange={(e) =>
              setSelectedExam(e.target.value as 'ALL' | BankingExam)
            }
            className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Exams</option>
            {BANKING_EXAMS.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.id}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(e.target.value as 'ALL' | ExamSubject)
            }
            className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Sections</option>
            {EXAM_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-amber-500" />
          <h3 className="mt-3 font-display text-base font-bold text-slate-900">
            {bookmarkedOnly
              ? 'No Saved Revision Questions Yet'
              : 'No Matching Questions Found'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {bookmarkedOnly
              ? 'Click the "Save" bookmark button on any question card or inside Test Analysis to pin tricky questions here.'
              : 'Try clearing your search filter or add a new question.'}
          </p>
        </div>
      ) : (
        /* Question Cards */
        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <article
              key={q.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-mono font-bold text-[#005A9C]">
                    {q.id}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-slate-900">{q.exam}</span>
                  <span>·</span>
                  <span>{q.subject}</span>
                  <span>·</span>
                  <span>{q.chapter}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(q.id)}
                    className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      q.bookmarked
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Bookmark question for quick revision"
                  >
                    <Bookmark
                      className={`h-3 w-3 ${
                        q.bookmarked ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                    />
                    <span>{q.bookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditQuestion(q)}
                    className="inline-flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteQuestion(q.id)}
                    className="inline-flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                <div className="space-y-3 lg:col-span-7">
                  <p className="whitespace-pre-line text-xs leading-relaxed text-slate-900 sm:text-sm">
                    {q.questionText}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {q.options.map((opt, idx) => {
                      const isCorrect = q.correctOptionIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
                            isCorrect
                              ? 'border-[#16A34A] bg-[#F0FDF4] font-bold text-[#14532D]'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          } ${idx === 4 ? 'sm:col-span-2' : ''}`}
                        >
                          <span className="font-mono font-bold">
                            ({OPTION_LABELS[idx]})
                          </span>
                          <span className="truncate">{opt}</span>
                          {isCorrect && (
                            <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 Cols: Handwritten Photo Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 lg:col-span-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Handwritten Solution
                    </span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onOpenDrawingPad(q)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                      >
                        <PenTool className="h-3 w-3" />
                        <span>Draw Pad</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerQuickUpload(q.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#005A9C] hover:underline"
                      >
                        <Upload className="h-3 w-3" />
                        <span>
                          {q.handwrittenSolutionImage
                            ? 'Upload Photo'
                            : 'Upload Photo'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {q.handwrittenSolutionImage ? (
                    <div className="mt-2.5 space-y-2">
                      <div
                        onClick={() => onOpenHandwrittenLightbox(q)}
                        className="flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5"
                      >
                        <img
                          src={q.handwrittenSolutionImage}
                          alt={`Handwritten solution for ${q.id}`}
                          referrerPolicy="no-referrer"
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenHandwrittenLightbox(q)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#005A9C]" />
                        <span>Open Full Solution Sheet</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-6 text-center">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => triggerQuickUpload(q.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166534]"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenDrawingPad(q)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                        >
                          <PenTool className="h-3.5 w-3.5 text-amber-700" />
                          <span>Draw on Pad</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
