import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, RotateCcw, Check, PenTool } from 'lucide-react';

interface HandwritingPadModalProps {
  questionTitle?: string;
  chapterName?: string;
  onSaveDrawing: (dataUrl: string, fileName: string) => void;
  onClose: () => void;
}

const PEN_COLORS = [
  { id: 'blue', label: 'Ink Blue', color: '#1e3a8a' },
  { id: 'black', label: 'Jet Black', color: '#0f172a' },
  { id: 'red', label: 'Marker Red', color: '#dc2626' },
  { id: 'green', label: 'Emerald', color: '#15803d' },
];

export const HandwritingPadModal: React.FC<HandwritingPadModalProps> = ({
  questionTitle,
  chapterName,
  onSaveDrawing,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1e3a8a');
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const drawNotebookBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Warm ruled notebook paper background
    ctx.fillStyle = '#fffdf7';
    ctx.fillRect(0, 0, width, height);

    // Horizontal ruled lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 60; y < height; y += 34) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Left red double margin line
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, height);
    ctx.moveTo(68, 0);
    ctx.lineTo(68, height);
    ctx.stroke();

    // Header watermark
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px sans-serif';
    ctx.fillText(
      `VAKRATUND HANDWRITTEN SOLUTION PAD${chapterName ? ` • ${chapterName.toUpperCase()}` : ''}`,
      82,
      36
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawNotebookBackground(ctx, canvas.width, canvas.height);
  }, [chapterName]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#fffdf7' : penColor;
    ctx.lineWidth = isEraser ? 22 : penSize;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawNotebookBackground(ctx, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString().slice(0, 10);
    onSaveDrawing(dataUrl, `vakratund-handwritten-${timestamp}.png`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-4 py-3 bg-[#1E2336] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <PenTool className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">
                Vakratund Live Notebook — Draw Handwritten Solution
              </h3>
              {questionTitle && (
                <p className="text-[11px] text-slate-300 truncate">{questionTitle}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Pad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawing Toolbar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Ink Color:</span>
            {PEN_COLORS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setPenColor(item.color);
                  setIsEraser(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                  !isEraser && penColor === item.color
                    ? 'bg-white border-slate-800 text-slate-900 shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsEraser(!isEraser)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                isEraser
                  ? 'bg-amber-100 border-amber-500 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              Eraser
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Stroke:</span>
            {[2, 3.5, 5.5].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setPenSize(size);
                  setIsEraser(false);
                }}
                className={`px-2 py-1 rounded text-xs font-semibold border ${
                  !isEraser && penSize === size
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {size === 2 ? 'Fine' : size === 3.5 ? 'Medium' : 'Bold'}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Page
            </button>
          </div>
        </div>

        {/* Notebook Canvas Area */}
        <div className="flex-1 overflow-auto bg-slate-200/70 p-3 sm:p-5 flex items-center justify-center">
          <div className="w-full max-w-[860px] bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={900}
              height={540}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-auto touch-none cursor-crosshair block"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Use mouse, stylus, or finger to write step-by-step calculation tricks directly on the notebook sheet.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Save Handwritten Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
