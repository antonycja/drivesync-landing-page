import Image from "next/image";

interface Question {
  id: number;
  section: string;
  question: string;
  options: string[];
  correct: number;
  image: string | null;
  explanation: string;
}

interface Props {
  question: Question;
  selected: number | null;
  onSelect: (idx: number) => void;
  showResult?: boolean;
}

const sectionLabels: Record<string, string> = {
  vehicle_controls: "Vehicle Controls",
  road_signs: "Road Signs",
  rules: "Rules of the Road",
};

export default function QuestionCard({ question, selected, onSelect, showResult }: Props) {
  return (
    <div>
      <div className="mb-3 text-xs text-slate-400 uppercase tracking-wide">
        {sectionLabels[question.section] || question.section}
      </div>
      <div className="flex gap-6 items-start mb-6">
        <p className="text-white text-base md:text-lg leading-relaxed flex-1">
          {question.question}
        </p>
        {question.image && (
          <div className="flex-shrink-0">
            <Image
              src={question.image}
              alt="Road sign"
              width={100}
              height={100}
              className="rounded-lg object-contain bg-white p-1"
            />
          </div>
        )}
      </div>
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          let style = "bg-slate-700 hover:bg-slate-600 border-slate-600 text-white cursor-pointer";
          if (selected === idx) {
            if (showResult) {
              style = idx === question.correct
                ? "bg-green-600 border-green-500 text-white cursor-default"
                : "bg-red-600 border-red-500 text-white cursor-default";
            } else {
              style = "bg-slate-500 border-slate-400 text-white cursor-pointer";
            }
          } else if (showResult && idx === question.correct) {
            style = "bg-green-700/40 border-green-600 text-green-300 cursor-default";
          }

          const label = String.fromCharCode(65 + idx); // A, B, C
          return (
            <button
              key={idx}
              onClick={() => !showResult && onSelect(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left ${style}`}
            >
              <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                {label}
              </span>
              <span className="text-sm leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>
      {showResult && selected !== null && (
        <div className="mt-4 p-3 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700">
          <span className="font-medium text-slate-200">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
