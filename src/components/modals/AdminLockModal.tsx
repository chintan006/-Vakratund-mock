import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

const ADMIN_PIN = 'Chintan@2005';

export const AdminLockModal: React.FC<AdminLockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === ADMIN_PIN) {
      setInputValue('');
      setErrorText(null);
      onUnlockSuccess();
    } else {
      setErrorText('Incorrect admin password. Only Admin Chintan can access this.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#1E2336] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-500/20 text-amber-300">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-extrabold">
                Admin Access Required
              </h3>
              <p className="text-[11px] text-slate-300">
                Protected Mock Creation &amp; Customization Studio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setInputValue('');
              setErrorText(null);
              onClose();
            }}
            className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleVerify} className="space-y-4 p-6">
          <p className="text-xs leading-relaxed text-slate-600">
            Enter the administrator password to unlock <strong>Create Mock</strong>,{' '}
            <strong>Add Question</strong>, and mock customization controls.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Admin Password
            </label>
            <div className="relative mt-1.5 flex items-center">
              <input
                type={showSecret ? 'text' : 'password'}
                autoFocus
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorText) setErrorText(null);
                }}
                placeholder="Enter admin password..."
                className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 pl-3.5 pr-10 text-xs font-medium text-slate-900 focus:border-[#005A9C] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSecret((prev) => !prev)}
                className="absolute right-2.5 text-slate-400 hover:text-slate-700"
                aria-label="Toggle password visibility"
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errorText && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600">
                {errorText}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setErrorText(null);
                onClose();
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E11D48] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#BE123C]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Unlock Admin Mode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
