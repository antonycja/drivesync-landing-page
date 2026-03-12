"use client";

import { useState, useCallback } from "react";
import allQuestions from "@/data/questions.json";
import QuestionCard from "@/components/test/QuestionCard";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeMode() {
  const [questions] = useState(() => shuffle(allQuestions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);

  const q = questions[index];

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswered((a) => a + 1);
    if (idx === q.correct) setCorrect((c) => c + 1);
  }, [selected, q]);

  const next = () => {
    setSelected(null);
    setIndex((i) => (i + 1) % questions.length);
  };

  const prev = () => {
    setSelected(null);
    setIndex((i) => (i - 1 + questions.length) % questions.length);
  };

  const pct = Math.round((answered / questions.length) * 100);

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-slate-400">{answered} answered · {correct} correct</span>
        <span className="text-slate-400">{index + 1} / {questions.length}</span>
      </div>
      {/* Progress */}
      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-6">
        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 min-h-96">
        <QuestionCard
          question={q}
          selected={selected}
          onSelect={handleSelect}
          showResult={selected !== null}
        />
        <div className="mt-6 flex gap-3">
          <button
            onClick={prev}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={next}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}
