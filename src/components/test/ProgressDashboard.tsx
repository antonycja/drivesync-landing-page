"use client";

import { useState } from "react";
import type { TestAttempt } from "@/hooks/useTestHistory";

interface Props {
  history: TestAttempt[];
  onClear: () => void;
  onBack: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function pct(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/** Counts consecutive passing attempts from the most recent going backwards */
function calcStreak(history: TestAttempt[]): number {
  let streak = 0;
  for (const attempt of history) {
    if (attempt.passed) streak++;
    else break;
  }
  return streak;
}

export default function ProgressDashboard({ history, onClear, onBack }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    onClear();
    setConfirmClear(false);
  };

  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No attempts yet</h2>
          <p className="text-slate-400 mb-8">No attempts yet — take your first test!</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Take a Test
          </button>
        </div>
      </div>
    );
  }

  // Stats calculations
  const totalAttempts = history.length;
  const bestScore = Math.max(...history.map((a) => pct(a.totalCorrect, a.totalQuestions)));
  const passCount = history.filter((a) => a.passed).length;
  const passRate = Math.round((passCount / totalAttempts) * 100);
  const streak = calcStreak(history);

  // Section averages across all history
  const sectionTotals = {
    vehicle_controls: { correct: 0, total: 0 },
    road_signs: { correct: 0, total: 0 },
    rules: { correct: 0, total: 0 },
  };
  for (const attempt of history) {
    for (const key of ["vehicle_controls", "road_signs", "rules"] as const) {
      sectionTotals[key].correct += attempt.sections[key].correct;
      sectionTotals[key].total += attempt.sections[key].total;
    }
  }

  // Last 10 for the chart (history is newest-first, chart shows oldest-first)
  const chartAttempts = [...history].slice(0, 10).reverse();
  const maxChartScore = 100; // percentage-based

  // Last 10 for recent list (already newest-first)
  const recentAttempts = history.slice(0, 10);

  const sectionPassMarks: Record<string, number> = {
    vehicle_controls: 6,
    road_signs: 22,
    rules: 22,
  };
  const sectionLabels: Record<string, string> = {
    vehicle_controls: "Vehicle Controls",
    road_signs: "Road Signs",
    rules: "Rules of the Road",
  };
  const sectionShort: Record<string, string> = {
    vehicle_controls: "VC",
    road_signs: "RS",
    rules: "RR",
  };

  return (
    <div className="flex-1 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-lg font-semibold text-white">My Progress</h1>
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Attempts", value: totalAttempts.toString() },
            { label: "Best Score", value: `${bestScore}%` },
            { label: "Pass Rate", value: `${passRate}%` },
            { label: "Current Streak", value: streak.toString(), suffix: streak === 1 ? "pass" : "passes" },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              {suffix && <div className="text-xs text-slate-500">{suffix}</div>}
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Score Trend Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-5">
            Score Trend (last {chartAttempts.length})
          </h2>
          <div className="flex items-end gap-1.5 h-28">
            {chartAttempts.map((attempt, i) => {
              const score = pct(attempt.totalCorrect, attempt.totalQuestions);
              const heightPct = (score / maxChartScore) * 100;
              return (
                <div key={attempt.id} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div className="w-full flex items-end" style={{ height: "80px" }}>
                    <div
                      className={`w-full rounded-t transition-all ${attempt.passed ? "bg-green-500" : "bg-red-500"}`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                      title={`${score}% — ${attempt.passed ? "PASS" : "FAIL"}`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 text-center leading-tight truncate w-full text-center">
                    {formatDate(attempt.date)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />Pass</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />Fail</span>
          </div>
        </div>

        {/* Section Averages */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-5">Section Averages</h2>
          <div className="space-y-4">
            {(["vehicle_controls", "road_signs", "rules"] as const).map((key) => {
              const { correct, total } = sectionTotals[key];
              const avgPct = pct(correct, total);
              const passThresholdPct = Math.round((sectionPassMarks[key] / (total / history.length)) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-slate-300">{sectionLabels[key]}</span>
                    <span className="text-sm font-medium text-white">{avgPct}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 relative">
                    <div
                      className={`h-2 rounded-full transition-all ${avgPct >= passThresholdPct ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${avgPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Pass threshold: {passThresholdPct}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Attempts */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Recent Attempts</h2>
          <div className="space-y-3">
            {recentAttempts.map((attempt) => {
              return (
                <div
                  key={attempt.id}
                  className="flex items-start sm:items-center justify-between gap-3 py-3 border-b border-slate-700 last:border-0 flex-col sm:flex-row"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                        attempt.passed
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {attempt.passed ? "PASS" : "FAIL"}
                    </span>
                    <div>
                      <div className="text-sm text-white font-medium">
                        {attempt.totalCorrect}/{attempt.totalQuestions}
                        <span className="text-slate-400 font-normal ml-1.5">
                          ({pct(attempt.totalCorrect, attempt.totalQuestions)}%)
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{formatDate(attempt.date)}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(["vehicle_controls", "road_signs", "rules"] as const).map((key) => {
                      const { correct, total } = attempt.sections[key];
                      const sectionPassed = correct >= sectionPassMarks[key];
                      return (
                        <span
                          key={key}
                          className={`${sectionPassed ? "text-green-400" : "text-red-400"}`}
                        >
                          {sectionShort[key]}: {correct}/{total} {sectionPassed ? "✓" : "✗"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Clear all history?</h3>
            <p className="text-slate-400 text-sm mb-5">
              This will permanently delete all {totalAttempts} attempt{totalAttempts !== 1 ? "s" : ""}. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-lg text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
