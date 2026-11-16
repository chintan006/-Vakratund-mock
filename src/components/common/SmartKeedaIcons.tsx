import React from 'react';

/**
 * Custom Vakratund Brand Crest Logo:
 * Auspicious saffron-crimson rounded crest with a stylized golden-white
 * Vakratund ("V" + sacred curved trunk / wisdom nib) and tilak bindu.
 */
export const VakratundLogo: React.FC<{ className?: string }> = ({
  className = 'h-9 w-9',
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="vakratundBg"
        x1="4"
        y1="4"
        x2="44"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EA580C" />
        <stop offset="0.55" stopColor="#E11D48" />
        <stop offset="1" stopColor="#9F1239" />
      </linearGradient>
    </defs>
    {/* Shield Base */}
    <rect
      x="3"
      y="3"
      width="42"
      height="42"
      rx="12"
      fill="url(#vakratundBg)"
    />
    {/* Subtle Inner Gold Rim */}
    <rect
      x="5.5"
      y="5.5"
      width="37"
      height="37"
      rx="9.5"
      stroke="#FDE68A"
      strokeOpacity="0.45"
      strokeWidth="1.2"
    />
    {/* Sacred Tilak & Bindu at Top Center */}
    <path
      d="M19.5 12.5C21 14 27 14 28.5 12.5"
      stroke="#FEF08A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="9.5" r="1.8" fill="#FEF08A" />
    {/* Stylized Vakratund "V" + Graceful Curved Trunk */}
    <path
      d="M14.5 17.5L22.2 31.5C23.3 33.5 25.8 34.5 28.2 33.8C30.8 33.1 32.2 30.5 31.2 28.4C30.3 26.6 28.1 26.5 27.4 28.1C26.9 29.2 27.6 30.4 28.8 30.5"
      stroke="#FFFFFF"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.5 17.5L26.2 29.5"
      stroke="#FDE047"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const SmartLightbulbLogo = VakratundLogo;

/**
 * Bank Exam Emblem (SBI keyhole circle, IBPS emblem, RRB emblem)
 */
export const BankExamEmblem: React.FC<{
  code: 'SBI' | 'IBPS' | 'RRB';
  size?: 'sm' | 'md' | 'lg';
}> = ({ code, size = 'md' }) => {
  const dim =
    size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';

  if (code === 'SBI') {
    return (
      <div
        className={`${dim} relative flex shrink-0 items-center justify-center rounded-full bg-[#0066B3] shadow-2xs`}
      >
        <div className="h-3.5 w-3.5 rounded-full bg-white" />
        <div className="absolute bottom-0 h-4 w-1.5 bg-white" />
      </div>
    );
  }

  if (code === 'IBPS') {
    return (
      <div
        className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-[#E0F2FE] text-[#0284C7] font-display text-xs font-extrabold border border-[#BAE6FD]`}
      >
        IBPS
      </div>
    );
  }

  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-slate-800 text-white font-display text-xs font-extrabold border border-slate-600`}
    >
      RRB
    </div>
  );
};

export type TcsIonStatus =
  | 'answered'
  | 'not-answered'
  | 'not-visited'
  | 'review'
  | 'answered-review';

/**
 * Official TCS iON Simulator Palette Button & Legend Badge
 */
export const TcsIonStatusBadge: React.FC<{
  status: TcsIonStatus;
  label: string | number;
  size?: 'legend' | 'grid';
  isCurrent?: boolean;
  onClick?: () => void;
}> = ({ status, label, size = 'grid', isCurrent = false, onClick }) => {
  const isGrid = size === 'grid';
  const boxClass = isGrid ? 'h-11 w-12 text-sm' : 'h-8 w-9 text-xs';

  if (status === 'answered') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex shrink-0 items-center justify-center font-sans font-semibold text-white transition-transform active:scale-95 ${boxClass} ${
          isCurrent ? 'ring-2 ring-[#005A9C] ring-offset-1' : ''
        }`}
      >
        <svg
          viewBox="0 0 48 42"
          className="absolute inset-0 h-full w-full drop-shadow-2xs"
        >
          <polygon
            points="24,2 46,15 40,40 8,40 2,15"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
          />
        </svg>
        <span className="relative z-10">{label}</span>
      </button>
    );
  }

  if (status === 'not-answered') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex shrink-0 items-center justify-center font-sans font-semibold text-white transition-transform active:scale-95 ${boxClass} ${
          isCurrent ? 'ring-2 ring-[#005A9C] ring-offset-1' : ''
        }`}
      >
        <svg
          viewBox="0 0 48 42"
          className="absolute inset-0 h-full w-full drop-shadow-2xs"
        >
          <polygon
            points="2,3 46,3 46,27 24,40 2,27"
            fill="#E64A19"
            stroke="#BF360C"
            strokeWidth="2"
          />
        </svg>
        <span className="relative z-10">{label}</span>
      </button>
    );
  }

  if (status === 'review' || status === 'answered-review') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-[#6A4C93] border-2 border-[#4A3267] font-sans font-semibold text-white shadow-xs transition-transform active:scale-95 ${
          isGrid ? 'h-11 w-11 text-sm' : 'h-8 w-8 text-xs'
        } ${isCurrent ? 'ring-2 ring-[#005A9C] ring-offset-1' : ''}`}
      >
        <span>{label}</span>
        {status === 'answered-review' && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4CAF50] text-[9px] font-bold text-white ring-1 ring-white">
            ✓
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center justify-center rounded-xs border border-slate-400 bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] font-sans font-medium text-slate-900 shadow-xs transition-transform hover:from-white hover:to-slate-200 active:scale-95 ${
        isGrid ? 'h-11 w-12 text-sm' : 'h-8 w-9 text-xs'
      } ${isCurrent ? 'ring-2 ring-[#005A9C] ring-offset-1' : ''}`}
    >
      {label}
    </button>
  );
};
