"use client";

import { useState } from "react";
import type { TestAttempt } from "@/hooks/useTestHistory";

interface Props {
  attempt: TestAttempt;
  onClose: () => void;
}

interface CompactPayload {
  d: string;
  vc: [number, number];
  rs: [number, number];
  rul: [number, number];
  p: boolean;
}

function buildShareLink(attempt: TestAttempt): string {
  const compact: CompactPayload = {
    d: attempt.date,
    vc: [attempt.sections.vehicle_controls.correct, attempt.sections.vehicle_controls.total],
    rs: [attempt.sections.road_signs.correct, attempt.sections.road_signs.total],
    rul: [attempt.sections.rules.correct, attempt.sections.rules.total],
    p: attempt.passed,
  };
  const encoded = btoa(JSON.stringify(compact));
  return `${window.location.origin}/mock-test?r=${encoded}`;
}

function buildShareText(attempt: TestAttempt): string {
  const scorePct = Math.round((attempt.totalCorrect / attempt.totalQuestions) * 100);
  const vc = attempt.sections.vehicle_controls;
  const rs = attempt.sections.road_signs;
  const rul = attempt.sections.rules;
  const vcPassed = vc.correct >= 6;
  const rsPassed = rs.correct >= 22;
  const rulPassed = rul.correct >= 22;
  return (
    `I scored ${attempt.totalCorrect}/${attempt.totalQuestions} (${scorePct}%) on the K53 mock test! ` +
    `Vehicle Controls: ${vc.correct}/${vc.total} ${vcPassed ? "✓" : "✗"}, ` +
    `Road Signs: ${rs.correct}/${rs.total} ${rsPassed ? "✓" : "✗"}, ` +
    `Rules: ${rul.correct}/${rul.total} ${rulPassed ? "✓" : "✗"}`
  );
}

function pct(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export default function ShareModal({ attempt, onClose }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const scorePct = pct(attempt.totalCorrect, attempt.totalQuestions);
  const vc = attempt.sections.vehicle_controls;
  const rs = attempt.sections.road_signs;
  const rul = attempt.sections.rules;
  const vcPassed = vc.correct >= 6;
  const rsPassed = rs.correct >= 22;
  const rulPassed = rul.correct >= 22;

  const handleCopyLink = async () => {
    try {
      const link = buildShareLink(attempt);
      await navigator.clipboard.writeText(link);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // Clipboard API may be unavailable — silently fail
    }
  };

  const handleShare = async () => {
    const shareText = buildShareText(attempt);
    const shareUrl = buildShareLink(attempt);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My K53 Result",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // Clipboard also unavailable — nothing to do
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-white font-semibold text-lg">Share Result</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Result Card Preview */}
        <div className="p-5">
          <div className={`rounded-xl overflow-hidden border ${attempt.passed ? "border-green-600/40" : "border-red-600/40"}`}>
            {/* Card Header */}
            <div className={`px-5 py-4 ${attempt.passed ? "bg-green-600/20" : "bg-red-600/20"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
                    {attempt.passed ? "PASSED" : "FAILED"}
                  </div>
                  <div className="text-slate-300 text-sm mt-0.5">K53 Mock Test</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{scorePct}%</div>
                  <div className="text-slate-400 text-sm">{attempt.totalCorrect}/{attempt.totalQuestions}</div>
                </div>
              </div>
            </div>

            {/* Card Body — Section Breakdown */}
            <div className="bg-slate-900 px-5 py-4 space-y-3">
              {[
                { label: "Vehicle Controls", correct: vc.correct, total: vc.total, passed: vcPassed },
                { label: "Road Signs", correct: rs.correct, total: rs.total, passed: rsPassed },
                { label: "Rules of the Road", correct: rul.correct, total: rul.total, passed: rulPassed },
              ].map(({ label, correct, total, passed: sectionPassed }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{correct}/{total}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sectionPassed ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                      {sectionPassed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="bg-slate-800/50 px-5 py-3 border-t border-slate-700/50">
              <span className="text-xs text-slate-500">DriveSync K53 Practice</span>
            </div>
          </div>
        </div>

        {/* Share Actions */}
        <div className="px-5 pb-5 flex flex-col gap-3">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {copyState === "copied" ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share via...
          </button>
        </div>
      </div>
    </div>
  );
}
