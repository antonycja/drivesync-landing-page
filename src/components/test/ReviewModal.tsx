"use client";

interface Props {
  total: number;
  answers: (number | null)[];
  flagged: Set<number>;
  current: number;
  onGoTo: (idx: number) => void;
  onClose: () => void;
  onEndTest: () => void;
}

export default function ReviewModal({ total, answers, flagged, current, onGoTo, onClose, onEndTest }: Props) {
  const answeredCount = answers.filter((a) => a !== null).length;
  const unansweredCount = total - answeredCount;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Review Questions</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {answeredCount}/{total} answered
              {unansweredCount > 0 && <span className="text-yellow-400 ml-2">· {unansweredCount} unanswered</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: total }, (_, i) => {
              let style = "bg-slate-700 text-slate-300 hover:bg-slate-600";
              if (answers[i] !== null) style = "bg-slate-500 text-white hover:bg-slate-400";
              if (flagged.has(i)) style = "bg-yellow-600 text-white hover:bg-yellow-500";
              if (i === current) style += " ring-2 ring-blue-400";
              return (
                <button
                  key={i}
                  onClick={() => { onGoTo(i); onClose(); }}
                  className={`h-9 rounded-lg text-xs font-medium transition-colors ${style}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-700" /> Not answered</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-500" /> Answered</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-600" /> Flagged</span>
          </div>
        </div>
        <div className="p-5 border-t border-slate-700 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-2.5 rounded-lg text-sm transition-colors">
            Continue Test
          </button>
          <button
            onClick={onEndTest}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            End Test
          </button>
        </div>
      </div>
    </div>
  );
}
