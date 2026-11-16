import React, { useState, useRef } from 'react';
import {
  Search,
  LayoutGrid,
  FileText,
  Layers,
  BookOpen,
  PlusCircle,
  FilePlus2,
  Menu,
  X,
  Image as ImageIcon,
  Bookmark,
  Download,
  Upload,
  Lock,
  Unlock,
  Sun,
  Moon,
} from 'lucide-react';
import { MockTestCategory, PortalView } from '../../types/platform';
import { VakratundLogo } from '../common/SmartKeedaIcons';

interface SmartKeedaShellProps {
  activeView: PortalView;
  activeCategory: MockTestCategory;
  onNavigate: (view: PortalView, category?: MockTestCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  questionCount: number;
  bookmarkedCount: number;
  mockCount: number;
  isAdminUnlocked: boolean;
  onLockAdmin: () => void;
  themeMode: 'light' | 'midnight';
  onToggleTheme: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  children: React.ReactNode;
}

export const SmartKeedaShell: React.FC<SmartKeedaShellProps> = ({
  activeView,
  activeCategory,
  onNavigate,
  searchQuery,
  onSearchChange,
  questionCount,
  bookmarkedCount,
  mockCount,
  isAdminUnlocked,
  onLockAdmin,
  themeMode,
  onToggleTheme,
  onExportBackup,
  onImportBackup,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleNav = (view: PortalView, cat?: MockTestCategory) => {
    onNavigate(view, cat);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-[#F8FAFC] text-slate-900">
      {/* Top Sticky Header (Fits 100% on Mobile & Full Desktop Screen) */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 shadow-2xs sm:h-16 sm:gap-4 sm:px-6">
        {/* Left: Mobile Menu + Vakratund Brand Lockup */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 sm:h-9 sm:w-9 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex min-w-0 items-center gap-2 text-left group"
          >
            <VakratundLogo className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105 sm:h-9 sm:w-9" />
            <div className="min-w-0 leading-none">
              <span className="block truncate font-display text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                Vakratund
              </span>
              <span className="hidden text-[10px] font-semibold text-amber-700 xs:block sm:block">
                Banking &amp; Govt Exam Prep
              </span>
            </div>
          </button>
        </div>

        {/* Center: Rounded Search Input */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search mock tests, topics, or questions..."
              aria-label="Search mock tests or questions"
              className="h-10 w-full rounded-full border border-slate-300 bg-slate-50 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 shadow-inner focus:border-[#005A9C] focus:bg-white focus:outline-none"
            />
            <Search className="pointer-events-none absolute right-3.5 h-4 w-4 text-slate-600" />
          </div>
        </div>

        {/* Right: Theme Switcher + Primary Actions + Candidate Avatar "C" */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 px-2 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100 sm:h-9 sm:px-2.5 whitespace-nowrap"
            title={
              themeMode === 'midnight'
                ? 'Switch to Classic Light Theme'
                : 'Switch to Midnight Focus High-Contrast Theme'
            }
          >
            {themeMode === 'midnight' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden xl:inline">Classic Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden xl:inline">Midnight Focus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('create-mock')}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-[#E11D48] px-2.5 text-[11px] font-bold text-white shadow-xs transition-colors hover:bg-[#BE123C] sm:h-9 sm:gap-1.5 sm:px-3.5 sm:text-xs whitespace-nowrap"
            title={
              isAdminUnlocked
                ? 'Create or Customize Mock Test (Admin Unlocked)'
                : 'Admin Password Required to Create Mock'
            }
          >
            {isAdminUnlocked ? (
              <FilePlus2 className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Lock className="h-3 w-3 shrink-0 text-amber-200 sm:h-3.5 sm:w-3.5" />
            )}
            <span>Create Mock</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('add-question')}
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap"
            title={
              isAdminUnlocked
                ? 'Add Question (Admin Unlocked)'
                : 'Admin Password Required to Add Question'
            }
          >
            {isAdminUnlocked ? (
              <PlusCircle className="h-3.5 w-3.5 text-[#005A9C]" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span>Add Question</span>
          </button>

          {isAdminUnlocked && (
            <button
              type="button"
              onClick={onLockAdmin}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 text-[11px] font-bold text-amber-900 hover:bg-amber-100 sm:h-9 sm:px-2.5 sm:text-xs whitespace-nowrap"
              title="Lock Admin Mode"
            >
              <Unlock className="h-3.5 w-3.5 text-amber-700" />
              <span className="hidden md:inline">Lock</span>
            </button>
          )}

          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EA580C] font-display text-xs font-bold text-white shadow-2xs sm:h-8 sm:w-8"
            title="Chintan Chovatiya"
          >
            C
          </div>
        </div>
      </header>

      {/* Main Body Layout: Full-Width Left Sidebar + Right Viewport */}
      <div className="flex w-full flex-1">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-40 flex w-64 max-w-[82vw] shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white py-4 transition-transform duration-200 sm:top-16 lg:static lg:w-60 lg:max-w-none lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Mobile Search Input inside Drawer */}
            <div className="mb-3 px-3 md:hidden">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search mocks or questions..."
                  className="h-9 w-full rounded-lg border border-slate-300 bg-slate-50 pl-3 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:border-[#005A9C] focus:bg-white focus:outline-none"
                />
                <Search className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>

            {/* Dashboard Link */}
            <div className="px-3">
              <button
                type="button"
                onClick={() => handleNav('home')}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  activeView === 'home'
                    ? 'bg-[#FFE4E6] text-[#E11D48]'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* MOCK TEST Section */}
            <div className="mt-5">
              <p className="px-6 text-[10px] font-bold tracking-wider text-slate-400">
                MOCK TEST SERIES
              </p>
              <div className="mt-2 space-y-1 px-3">
                <button
                  type="button"
                  onClick={() => handleNav('exam-series', 'Full Length Tests')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'exam-series' &&
                    activeCategory === 'Full Length Tests'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span>Full Length Tests</span>
                  </span>
                  <span className="font-mono text-[11px] opacity-75">
                    {mockCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('exam-series', 'Bank Topic Test')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'exam-series' &&
                    activeCategory === 'Bank Topic Test'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>Bank Topic Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('exam-series', 'Sectional Test 2.0')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'exam-series' &&
                    activeCategory === 'Sectional Test 2.0'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="h-4 w-4 shrink-0" />
                  <span>Sectional Test 2.0</span>
                </button>
              </div>
            </div>

            {/* PRACTICE & CUSTOM MOCK ZONE */}
            <div className="mt-6">
              <p className="px-6 text-[10px] font-bold tracking-wider text-slate-400">
                MY MOCK &amp; SOLUTION STUDIO
              </p>
              <div className="mt-2 space-y-1 px-3">
                <button
                  type="button"
                  onClick={() => handleNav('question-bank')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'question-bank'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 shrink-0" />
                    <span>Handwritten Bank</span>
                  </span>
                  <span className="rounded bg-[#16A34A] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {questionCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('bookmarks')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'bookmarks'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Bookmark className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>Saved / Revision</span>
                  </span>
                  <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {bookmarkedCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('create-mock')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'create-mock'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FilePlus2 className="h-4 w-4 shrink-0" />
                    <span>Create Custom Mock</span>
                  </span>
                  {!isAdminUnlocked && (
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('add-question')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeView === 'add-question'
                      ? 'bg-[#FFE4E6] text-[#E11D48]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <PlusCircle className="h-4 w-4 shrink-0" />
                    <span>Add Question + Photo</span>
                  </span>
                  {!isAdminUnlocked && (
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Backup & Restore Footer */}
          <div className="mt-8 border-t border-slate-200 px-4 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Data Backup &amp; Sync
            </p>
            <input
              ref={backupInputRef}
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImportBackup(file);
                e.target.value = '';
              }}
              className="hidden"
            />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={onExportBackup}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                title="Download all questions, mocks, and handwritten images as a JSON backup"
              >
                <Download className="h-3 w-3 text-[#005A9C]" />
                <span>Backup</span>
              </button>
              <button
                type="button"
                onClick={() => backupInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                title="Restore questions and mocks from a JSON backup file"
              >
                <Upload className="h-3 w-3 text-emerald-600" />
                <span>Restore</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport (Full Width, Mobile Bottom Nav Padding) */}
        <main className="min-w-0 flex-1 overflow-x-hidden p-3 pb-20 sm:p-5 lg:p-7 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Fits Mobile Screen Perfectly) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-slate-200 bg-white px-1 shadow-lg lg:hidden">
        <button
          type="button"
          onClick={() => handleNav('home')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold ${
            activeView === 'home' ? 'text-[#E11D48]' : 'text-slate-600'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleNav('exam-series', 'Full Length Tests')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold ${
            activeView === 'exam-series' ? 'text-[#E11D48]' : 'text-slate-600'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Mock Tests</span>
        </button>

        <button
          type="button"
          onClick={() => handleNav('question-bank')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold ${
            activeView === 'question-bank' ? 'text-[#E11D48]' : 'text-slate-600'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Solutions</span>
        </button>

        <button
          type="button"
          onClick={() => handleNav('bookmarks')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold ${
            activeView === 'bookmarks' ? 'text-[#E11D48]' : 'text-slate-600'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Saved</span>
        </button>

        <button
          type="button"
          onClick={() => handleNav('create-mock')}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold ${
            activeView === 'create-mock' || activeView === 'add-question'
              ? 'text-[#E11D48]'
              : 'text-slate-600'
          }`}
        >
          <Lock className="h-4 w-4 text-amber-600" />
          <span>Admin</span>
        </button>
      </nav>
    </div>
  );
};
