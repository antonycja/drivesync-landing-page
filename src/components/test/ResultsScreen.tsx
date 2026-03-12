"use client";

import Link from "next/link";
import type { TestAttempt } from "@/hooks/useTestHistory";

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
  questions: Question[];
  answers: (number | null)[];
  onRetry: () => void;
  attempt: TestAttempt;
  onShare: (attempt: TestAttempt) => void;
}

const PASS_MARKS: Record<string, { pass: number; total: number; label: string }> = {
  vehicle_controls: { pass: 6, total: 8, label: "Vehicle Controls" },
  road_signs: { pass: 22, total: 28, label: "Road Signs" },
  rules: { pass: 22, total: 28, label: "Rules of the Road" },
};

export default function ResultsScreen({ questions, answers, onRetry, attempt, onShare }: Props) {
  const sectionResults: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, i) => {
    if (!sectionResults[q.section]) sectionResults[q.section] = { correct: 0, total: 0 };
    sectionResults[q.section].total++;
    if (answers[i] === q.correct) sectionResults[q.section].correct++;
  });

  const totalCorrect = Object.values(sectionResults).reduce((s, r) => s + r.correct, 0);
  const totalQuestions = questions.length;

  const allSectionsPassed = Object.entries(sectionResults).every(([section, result]) => {
    const mark = PASS_MARKS[section];
    if (!mark) return true;
    return result.correct >= mark.pass;
  });

  const overallPassed = allSectionsPassed;

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${overallPassed ? "bg-green-600/20" : "bg-red-600/20"}`}>
            {overallPassed ? (
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${overallPassed ? "text-green-400" : "text-red-400"}`}>
            {overallPassed ? "You Passed!" : "Not Yet"}
          </h1>
          <p className="text-slate-400">
            {totalCorrect} / {totalQuestions} correct ({Math.round((totalCorrect / totalQuestions) * 100)}%)
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Section Results</h2>
          {Object.entries(sectionResults).map(([section, result]) => {
            const mark = PASS_MARKS[section];
            const passed = mark ? result.correct >= mark.pass : true;
            const label = mark?.label || section;
            const pct = Math.round((result.correct / result.total) * 100);
            return (
              <div key={section}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{result.correct}/{result.total}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${passed ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                      {passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${passed ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {mark && (
                  <p className="text-xs text-slate-500 mt-1">Pass mark: {mark.pass}/{mark.total}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mb-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/learning-hub"
            className="flex-1 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium py-3 rounded-xl transition-colors text-center"
          >
            Study Hub
          </Link>
        </div>

        <button
          onClick={() => onShare(attempt)}
          className="w-full flex items-center justify-center gap-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-medium py-3 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </button>
      </div>
    </div>
  );
}
