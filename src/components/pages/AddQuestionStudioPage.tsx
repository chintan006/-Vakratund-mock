import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  PenTool,
  RotateCcw,
} from 'lucide-react';
import {
  BankingExam,
  ExamSubject,
  QuestionDifficulty,
  QuestionItem,
} from '../../types/platform';
import {
  BANKING_EXAMS,
  CHAPTERS_BY_SUBJECT,
  DIFFICULTY_LEVELS,
  EXAM_SUBJECTS,
} from '../../data/sampleBankingData';
import { processHandwrittenImageFile } from '../../utils/imageCompressor';
import { HandwritingPadModal } from '../modals/HandwritingPadModal';

interface AddQuestionStudioPageProps {
  editingQuestion: QuestionItem | null;
  onSaveQuestion: (question: QuestionItem, isNew: boolean) => void;
  onCancel: () => void;
}

interface QuestionFormDraft {
  exam: BankingExam;
  subject: ExamSubject;
  chapter: string;
  customChapter: string;
  difficulty: QuestionDifficulty;
  questionText: string;
  options: [string, string, string, string, string];
  correctOptionIndex: number;
  handwrittenImage?: string;
  handwrittenFileName?: string;
  solutionNote: string;
  savedAt: string;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];
const DRAFT_STORAGE_KEY = 'vakratund_add_question_draft_v1';

export const AddQuestionStudioPage: React.FC<AddQuestionStudioPageProps> = ({
  editingQuestion,
  onSaveQuestion,
  onCancel,
}) => {
  const [exam, setExam] = useState<BankingExam>('SBI PO');
  const [subject, setSubject] = useState<ExamSubject>('Quantitative Aptitude');
  const [chapter, setChapter] = useState<string>(
    CHAPTERS_BY_SUBJECT['Quantitative Aptitude'][0]
  );
  const [customChapter, setCustomChapter] = useState<string>('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('Moderate');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<[string, string, string, string, string]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [handwrittenImage, setHandwrittenImage] = useState<string | undefined>(
    undefined
  );
  const [handwrittenFileName, setHandwrittenFileName] = useState<
    string | undefined
  >(undefined);
  const [solutionNote, setSolutionNote] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep latest form state in a ref for the 5-second auto-save interval
  const formStateRef = useRef({
    exam,
    subject,
    chapter,
    customChapter,
    difficulty,
    questionText,
    options,
    correctOptionIndex,
    handwrittenImage,
    handwrittenFileName,
    solutionNote,
  });

  useEffect(() => {
    formStateRef.current = {
      exam,
      subject,
      chapter,
      customChapter,
      difficulty,
      questionText,
      options,
      correctOptionIndex,
      handwrittenImage,
      handwrittenFileName,
      solutionNote,
    };
  }, [
    exam,
    subject,
    chapter,
    customChapter,
    difficulty,
    questionText,
    options,
    correctOptionIndex,
    handwrittenImage,
    handwrittenFileName,
    solutionNote,
  ]);

  // Load editing question or restore saved draft from localStorage
  useEffect(() => {
    if (editingQuestion) {
      setExam(editingQuestion.exam);
      setSubject(editingQuestion.subject);
      const presetChapters = CHAPTERS_BY_SUBJECT[editingQuestion.subject];
      if (presetChapters.includes(editingQuestion.chapter)) {
        setChapter(editingQuestion.chapter);
        setCustomChapter('');
      } else {
        setChapter('CUSTOM');
        setCustomChapter(editingQuestion.chapter);
      }
      setDifficulty(editingQuestion.difficulty);
      setQuestionText(editingQuestion.questionText);
      setOptions([...editingQuestion.options]);
      setCorrectOptionIndex(editingQuestion.correctOptionIndex);
      setHandwrittenImage(editingQuestion.handwrittenSolutionImage);
      setHandwrittenFileName(editingQuestion.handwrittenFileName);
      setSolutionNote(editingQuestion.solutionNote || '');
      setLastAutoSavedAt(null);
    } else {
      let restored = false;
      try {
        const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (rawDraft) {
          const draft = JSON.parse(rawDraft) as Partial<QuestionFormDraft>;
          if (draft && typeof draft === 'object') {
            if (draft.exam) setExam(draft.exam);
            if (draft.subject) setSubject(draft.subject);
            if (draft.chapter) setChapter(draft.chapter);
            if (typeof draft.customChapter === 'string') {
              setCustomChapter(draft.customChapter);
            }
            if (draft.difficulty) setDifficulty(draft.difficulty);
            if (typeof draft.questionText === 'string') {
              setQuestionText(draft.questionText);
            }
            if (Array.isArray(draft.options) && draft.options.length === 5) {
              setOptions(
                draft.options as [string, string, string, string, string]
              );
            }
            if (typeof draft.correctOptionIndex === 'number') {
              setCorrectOptionIndex(draft.correctOptionIndex);
            }
            setHandwrittenImage(draft.handwrittenImage);
            setHandwrittenFileName(draft.handwrittenFileName);
            setSolutionNote(draft.solutionNote || '');
            if (draft.savedAt) {
              setLastAutoSavedAt(`Draft restored (${draft.savedAt})`);
            }
            restored = true;
          }
        }
      } catch {
        // Ignore corrupted draft data
      }

      if (!restored) {
        setExam('SBI PO');
        setSubject('Quantitative Aptitude');
        setChapter(CHAPTERS_BY_SUBJECT['Quantitative Aptitude'][0]);
        setCustomChapter('');
        setDifficulty('Moderate');
        setQuestionText('');
        setOptions(['', '', '', '', '']);
        setCorrectOptionIndex(0);
        setHandwrittenImage(undefined);
        setHandwrittenFileName(undefined);
        setSolutionNote('');
        setLastAutoSavedAt(null);
      }
    }
    setUploadError(null);
  }, [editingQuestion]);

  // Auto-save form state to localStorage every 5 seconds during question creation
  useEffect(() => {
    if (editingQuestion) return;

    const intervalId = window.setInterval(() => {
      const current = formStateRef.current;
      const timeLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const payload: QuestionFormDraft = {
        ...current,
        savedAt: timeLabel,
      };

      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        setLastAutoSavedAt(`Auto-saved at ${timeLabel}`);
      } catch {
        // If image exceeds storage quota, save text fields without image
        try {
          const fallbackPayload: QuestionFormDraft = {
            ...current,
            handwrittenImage: undefined,
            savedAt: timeLabel,
          };
          localStorage.setItem(
            DRAFT_STORAGE_KEY,
            JSON.stringify(fallbackPayload)
          );
          setLastAutoSavedAt(`Auto-saved text at ${timeLabel}`);
        } catch {
          // Ignore quota errors
        }
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [editingQuestion]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setExam('SBI PO');
    setSubject('Quantitative Aptitude');
    setChapter(CHAPTERS_BY_SUBJECT['Quantitative Aptitude'][0]);
    setCustomChapter('');
    setDifficulty('Moderate');
    setQuestionText('');
    setOptions(['', '', '', '', '']);
    setCorrectOptionIndex(0);
    setHandwrittenImage(undefined);
    setHandwrittenFileName(undefined);
    setSolutionNote('');
    setLastAutoSavedAt('Draft cleared');
  };

  const handleSubjectChange = (nextSub: ExamSubject) => {
    setSubject(nextSub);
    setChapter(CHAPTERS_BY_SUBJECT[nextSub][0]);
  };

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options] as [string, string, string, string, string];
    next[idx] = val;
    setOptions(next);
  };

  const handleImageFile = async (file: File) => {
    setUploadError(null);
    try {
      const { dataUrl, fileName } = await processHandwrittenImageFile(file);
      setHandwrittenImage(dataUrl);
      setHandwrittenFileName(fileName);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Could not process image file.'
      );
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          await handleImageFile(file);
          break;
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedChapter =
      chapter === 'CUSTOM'
        ? customChapter.trim() || 'General Chapter'
        : chapter;

    const filledOptions: [string, string, string, string, string] = [
      options[0].trim() || 'Option A',
      options[1].trim() || 'Option B',
      options[2].trim() || 'Option C',
      options[3].trim() || 'Option D',
      options[4].trim() || 'None of these',
    ];

    const saved: QuestionItem = {
      id:
        editingQuestion?.id ||
        `Q-${Math.floor(106 + Math.random() * 890)}`,
      questionText: questionText.trim(),
      exam,
      subject,
      chapter: resolvedChapter,
      difficulty,
      options: filledOptions,
      correctOptionIndex,
      handwrittenSolutionImage: handwrittenImage,
      handwrittenFileName,
      solutionNote: solutionNote.trim() || undefined,
      createdAt:
        editingQuestion?.createdAt ||
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    };

    if (!editingQuestion) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore storage error
      }
    }

    onSaveQuestion(saved, !editingQuestion);
  };

  return (
    <div onPaste={handlePaste} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A9C] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Question Bank</span>
          </button>
          <h1 className="mt-1 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
            {editingQuestion
              ? `Edit Question (${editingQuestion.id}) & Handwritten Solution`
              : 'Add Question & Upload Handwritten Solution Photo'}
          </h1>
        </div>

        {!editingQuestion && (
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lastAutoSavedAt || 'Auto-saving every 5s'}</span>
            </span>
            <button
              type="button"
              onClick={handleClearDraft}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              title="Reset form and clear saved draft"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Draft</span>
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
      >
        {/* Left 7 Columns: Question & Options */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-7">
          <h2 className="font-display text-sm font-extrabold text-slate-900">
            1. Question Details &amp; 5 Options
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Target Exam
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value as BankingExam)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-900"
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
                Section
              </label>
              <select
                value={subject}
                onChange={(e) =>
                  handleSubjectChange(e.target.value as ExamSubject)
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-900"
              >
                {EXAM_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Chapter Name
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-900"
              >
                {CHAPTERS_BY_SUBJECT[subject].map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
                <option value="CUSTOM">+ Custom Chapter Name...</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as QuestionDifficulty)
                }
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-900"
              >
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {chapter === 'CUSTOM' && (
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Custom Chapter Name
              </label>
              <input
                type="text"
                required
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                placeholder="Enter chapter name..."
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Question Statement
            </label>
            <textarea
              rows={4}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter complete banking question statement..."
              className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                5 Options (Click A–E to mark the Correct Answer)
              </label>
              <span className="text-xs font-bold text-[#16A34A]">
                Correct Answer: Option ({OPTION_LABELS[correctOptionIndex]})
              </span>
            </div>

            {options.map((opt, idx) => {
              const isCorrect = correctOptionIndex === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 rounded-xl border p-2 ${
                    isCorrect
                      ? 'border-[#16A34A] bg-[#F0FDF4]'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectOptionIndex(idx)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isCorrect
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    {OPTION_LABELS[idx]}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Enter Option (${OPTION_LABELS[idx]})...`}
                    className="h-8 flex-1 bg-transparent px-2 text-xs font-medium text-slate-900 focus:outline-none sm:text-sm"
                  />
                  {isCorrect && (
                    <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-[#16A34A]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Handwritten Solution Image Uploader */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-sm font-extrabold text-slate-900">
                2. Attach Handwritten Solution
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Upload notebook photo, paste (Ctrl+V), or draw live
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDrawingPad(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
            >
              <PenTool className="h-3.5 w-3.5 text-amber-700" />
              <span>Open Notebook Pad</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
              e.target.value = '';
            }}
            className="hidden"
          />

          {handwrittenImage ? (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Handwritten Solution Attached</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDrawingPad(true)}
                    className="rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-100"
                  >
                    Redraw
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Replace Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHandwrittenImage(undefined);
                      setHandwrittenFileName(undefined);
                    }}
                    className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
                <img
                  src={handwrittenImage}
                  alt="Uploaded handwritten solution preview"
                  referrerPolicy="no-referrer"
                  className="max-h-72 w-auto object-contain"
                />
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageFile(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                isDragging
                  ? 'border-[#005A9C] bg-[#F0F9FF]'
                  : 'border-slate-300 bg-slate-50 hover:border-[#005A9C]'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#005A9C]">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900">
                Click to Upload Handwritten Solution Image
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Drag &amp; drop JPG / PNG / WEBP or press Ctrl+V to paste
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#005A9C] px-4 py-2 text-xs font-bold text-white">
                <Upload className="h-3.5 w-3.5" />
                <span>Choose Handwritten Photo</span>
              </span>
            </div>
          )}

          {uploadError && (
            <p className="text-xs font-semibold text-red-600">{uploadError}</p>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Short Key Hint / Note (Optional)
            </label>
            <input
              type="text"
              value={solutionNote}
              onChange={(e) => setSolutionNote(e.target.value)}
              placeholder="e.g., Prime square difference +2², +3², +5²..."
              className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#166534]"
            >
              <Save className="h-4 w-4" />
              <span>
                {editingQuestion ? 'Update Question' : 'Save Question'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {showDrawingPad && (
        <HandwritingPadModal
          questionTitle={questionText || 'New Banking Question'}
          chapterName={chapter === 'CUSTOM' ? customChapter : chapter}
          onSaveDrawing={(dataUrl, fileName) => {
            setHandwrittenImage(dataUrl);
            setHandwrittenFileName(fileName);
          }}
          onClose={() => setShowDrawingPad(false)}
        />
      )}
    </div>
  );
};
