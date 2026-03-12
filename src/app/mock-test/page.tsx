"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TestSimulator from "@/components/test/TestSimulator";
import Link from "next/link";

interface CompactPayload {
  d: string;
  vc: [number, number];
  rs: [number, number];
  rul: [number, number];
  p: boolean;
}

function decodeSharedResult(encoded: string): CompactPayload | null {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json) as CompactPayload;
    // Basic shape validation
    if (
      typeof data.d !== "string" ||
      !Array.isArray(data.vc) ||
      !Array.isArray(data.rs) ||
      !Array.isArray(data.rul) ||
      typeof data.p !== "boolean"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function pct(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

interface SharedResultViewProps {
  data: CompactPayload;
}

function SharedResultView({ data }: SharedResultViewProps) {
  const vcCorrect = data.vc[0];
  const vcTotal = data.vc[1];
  const rsCorrect = data.rs[0];
  const rsTotal = data.rs[1];
  const rulCorrect = data.rul[0];
  const rulTotal = data.rul[1];

  const totalCorrect = vcCorrect + rsCorrect + rulCorrect;
  const totalQuestions = vcTotal + rsTotal + rulTotal;
  const scorePct = pct(totalCorrect, totalQuestions);

  const vcPassed = vcCorrect >= 6;
  const rsPassed = rsCorrect >= 22;
  const rulPassed = rulCorrect >= 22;

  const sections = [
    { label: "Vehicle Controls", correct: vcCorrect, total: vcTotal, passed: vcPassed, passmark: 6 },
    { label: "Road Signs", correct: rsCorrect, total: rsTotal, passed: rsPassed, passmark: 22 },
    { label: "Rules of the Road", correct: rulCorrect, total: rulTotal, passed: rulPassed, passmark: 22 },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        {/* Shared result label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-slate-400 text-sm">Shared K53 Result</span>
        </div>

        {/* Result Card */}
        <div className={`rounded-2xl overflow-hidden border mb-6 ${data.p ? "border-green-600/40" : "border-red-600/40"}`}>
          {/* Card Header */}
          <div className={`px-6 py-5 ${data.p ? "bg-green-600/20" : "bg-red-600/20"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${data.p ? "text-green-400" : "text-red-400"}`}>
                  {data.p ? "PASSED" : "FAILED"}
                </div>
                <div className="text-slate-300 text-sm mt-0.5">K53 Mock Test · {formatDate(data.d)}</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">{scorePct}%</div>
                <div className="text-slate-400 text-sm">{totalCorrect}/{totalQuestions}</div>
              </div>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="bg-slate-800 px-6 py-5 space-y-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wide">Section Results</h2>
            {sections.map(({ label, correct, total, passed, passmark }) => {
              const sectionPct = pct(correct, total);
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-300">{correct}/{total}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${passed ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                        {passed ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${sectionPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Pass mark: {passmark}/{total}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-800/50 px-6 py-3 border-t border-slate-700/50">
            <span className="text-xs text-slate-500">DriveSync K53 Practice</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/mock-test"
          className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-center"
        >
          Take the Test
        </Link>
        <Link
          href="/"
          className="block mt-3 text-sm text-center text-slate-500 hover:text-slate-300 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function MockTestPageInner() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("r");

  if (encoded) {
    const data = decodeSharedResult(encoded);
    if (data) {
      return <SharedResultView data={data} />;
    }
    // Invalid encoded data — fall through to normal test
  }

  return <TestSimulator />;
}

export default function MockTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    }>
      <MockTestPageInner />
    </Suspense>
  );
}
