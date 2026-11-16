import React, { useRef, useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { QuestionItem } from '../../types/platform';
import { processHandwrittenImageFile } from '../../utils/imageCompressor';

interface HandwrittenSolutionLightboxProps {
  question: QuestionItem | null;
  onClose: () => void;
  onUpdateHandwrittenImage: (
    questionId: string,
    dataUrl: string,
    fileName: string
  ) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export const HandwrittenSolutionLightbox: React.FC<
  HandwrittenSolutionLightboxProps
> = ({ question, onClose, onUpdateHandwrittenImage }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!question) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { dataUrl, fileName } = await processHandwrittenImageFile(file);
      onUpdateHandwrittenImage(question.id, dataUrl, fileName);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {question.id}
              </span>
              <span aria-hidden="true">·</span>
              <span>{question.exam}</span>
              <span aria-hidden="true">·</span>
              <span>{question.subject}</span>
              <span aria-hidden="true">·</span>
              <span>{question.chapter}</span>
            </div>
            <h2
              id="lightbox-title"
              className="mt-0.5 font-display text-base font-bold text-slate-900 dark:text-slate-100"
            >
              Handwritten Solution Sheet
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
            >
              <Upload className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>
                {isUploading
                  ? 'Uploading...'
                  : question.handwrittenSolutionImage
                  ? 'Replace Handwritten Photo'
                  : 'Upload Handwritten Photo'}
              </span>
            </button>

            {question.handwrittenSolutionImage && (
              <button
                type="button"
                onClick={() => setIsZoomed((z) => !z)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                title={isZoomed ? 'Fit to screen' : 'Zoom in'}
                aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
              >
                {isZoomed ? (
                  <ZoomOut className="h-4 w-4" />
                ) : (
                  <ZoomIn className="h-4 w-4" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Close solution viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Question Context Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900 dark:text-slate-100">
              {question.questionText}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-200/80 pt-3 text-xs dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Correct Answer: Option (
                  {OPTION_LABELS[question.correctOptionIndex]}) —{' '}
                  {question.options[question.correctOptionIndex]}
                </span>
              </span>
            </div>
          </div>

          {/* Handwritten Image Canvas */}
          {question.handwrittenSolutionImage ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex justify-center">
                <img
                  src={question.handwrittenSolutionImage}
                  alt={`Handwritten solution for ${question.id}`}
                  referrerPolicy="no-referrer"
                  className={`rounded-lg bg-white shadow-sm transition-all ${
                    isZoomed
                      ? 'max-w-none w-[1100px]'
                      : 'max-h-[480px] w-auto object-contain'
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center dark:border-slate-700 dark:bg-slate-950/50">
              <ImageIcon className="h-10 w-10 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Handwritten Solution Image Uploaded Yet
              </p>
              <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                Upload a photo or screenshot of your notebook / iPad calculation
                for this question.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Handwritten Solution Photo</span>
              </button>
            </div>
          )}

          {question.solutionNote && (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong className="font-semibold text-slate-900 dark:text-slate-200">
                Quick Note:
              </strong>{' '}
              {question.solutionNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
