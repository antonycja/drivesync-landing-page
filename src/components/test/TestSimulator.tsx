"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import allQuestions from "@/data/questions.json";
import QuestionCard from "./QuestionCard";
import TestTimer from "./TestTimer";
import ReviewModal from "./ReviewModal";
import ResultsScreen from "./ResultsScreen";
import ProgressDashboard from "./ProgressDashboard";
import ShareModal from "./ShareModal";
import Link from "next/link";
import { useTestHistory } from "@/hooks/useTestHistory";
import { useTestContext } from "@/context/TestContext";
import type { TestAttempt } from "@/hooks/useTestHistory";

type State = "idle" | "in_progress" | "review" | "results";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  const bySection: Record<string, typeof allQuestions> = {};
  allQuestions.forEach((q) => {
    if (!bySection[q.section]) bySection[q.section] = [];
    bySection[q.section].push(q);
  });
  const controls = shuffleArray(bySection["vehicle_controls"] || []).slice(0, 8);
  const signs = shuffleArray(bySection["road_signs"] || []).slice(0, 28);
  const rules = shuffleArray(bySection["rules"] || []).slice(0, 28);
  return shuffleArray([...controls, ...signs, ...rules]);
}

/** Builds a TestAttempt from the completed question/answer set */
function buildAttempt(
  questions: typeof allQuestions,
  answers: (number | null)[]
): TestAttempt {
  const sectionData = {
    vehicle_controls: { correct: 0, total: 0 },
    road_signs: { correct: 0, total: 0 },
    rules: { correct: 0, total: 0 },
  };

  questions.forEach((q, i) => {
    const key = q.section as keyof typeof sectionData;
    if (key in sectionData) {
      sectionData[key].total++;
      if (answers[i] === q.correct) sectionData[key].correct++;
    }
  });

  const totalCorrect = Object.values(sectionData).reduce((s, r) => s + r.correct, 0);
  const totalQuestions = questions.length;

  const vcPassed = sectionData.vehicle_controls.correct >= 6;
  const rsPassed = sectionData.road_signs.correct >= 22;
  const rulPassed = sectionData.rules.correct >= 22;

  return {
    id: Date.now().toString(36),
    date: new Date().toISOString(),
    sections: sectionData,
    passed: vcPassed && rsPassed && rulPassed,
    totalCorrect,
    totalQuestions,
  };
}

const TOTAL_TIME = 60 * 60; // 60 minutes

export default function TestSimulator() {
  const [state, setState] = useState<State>("idle");
  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [viewingProgress, setViewingProgress] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(null);
  const [shareAttempt, setShareAttempt] = useState<TestAttempt | null>(null);
  const timerKey = useRef(0);
  const { setTestActive } = useTestContext();

  // Stable refs so handleExpire (a memoized callback) always sees fresh state
  const questionsRef = useRef(questions);
  const answersRef = useRef(answers);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  const { history, addAttempt, clearHistory } = useTestHistory();

  // Update test context when state changes
  useEffect(() => {
    setTestActive(state === "in_progress");
  }, [state, setTestActive]);

  // Prevent navigation away during active test
  useEffect(() => {
    if (state !== "in_progress") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("⚠️ Warning: Do not switch tabs during the test. Your progress will be saved.");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [state]);

  const startTest = useCallback(() => {
    const qs = pickQuestions();
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setFlagged(new Set());
    setCurrent(0);
    setCurrentAttempt(null);
    timerKey.current += 1;
    setState("in_progress");
  }, []);

  const finishTest = useCallback(
    (qs: typeof allQuestions, ans: (number | null)[]) => {
      const attempt = buildAttempt(qs, ans);
      setCurrentAttempt(attempt);
      addAttempt(attempt);
      setState("results");
    },
    [addAttempt]
  );

  const handleExpire = useCallback(() => {
    finishTest(questionsRef.current, answersRef.current);
  }, [finishTest]);

  const endTest = () => {
    setShowEndConfirm(false);
    setShowReview(false);
    finishTest(questions, answers);
  };

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(current)) next.delete(current);
      else next.add(current);
      return next;
    });
  };

  // Progress view
  if (viewingProgress) {
    return (
      <div className="flex-1 flex flex-col">
        <ProgressDashboard
          history={history}
          onClear={clearHistory}
          onBack={() => setViewingProgress(false)}
        />
        {shareAttempt && (
          <ShareModal attempt={shareAttempt} onClose={() => setShareAttempt(null)} />
        )}
      </div>
    );
  }

  if (state === "idle") {
    const lastAttempt = history[0] ?? null;

    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">K53 Mock Test</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            64 questions · 60 minute timer · Code 8/10/14<br />
            You need to pass all three sections to pass the test.
          </p>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-8 text-left space-y-2 text-sm text-slate-300">
            <div className="flex justify-between"><span>Vehicle Controls</span><span>8 questions · pass 6/8</span></div>
            <div className="flex justify-between"><span>Road Signs</span><span>28 questions · pass 22/28</span></div>
            <div className="flex justify-between"><span>Rules of the Road</span><span>28 questions · pass 22/28</span></div>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-lg mb-3"
          >
            Start Test
          </button>

          <button
            onClick={() => setViewingProgress(true)}
            className="w-full flex items-center justify-center gap-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-medium py-3 rounded-xl transition-colors mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            My Progress
            {history.length > 0 && (
              <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>

          {lastAttempt && (
            <p className="text-xs text-slate-500 mb-4">
              Last attempt: {lastAttempt.totalCorrect}/{lastAttempt.totalQuestions}{" "}
              <span className={lastAttempt.passed ? "text-green-400" : "text-red-400"}>
                ({lastAttempt.passed ? "PASS" : "FAIL"})
              </span>
            </p>
          )}

          <Link href="/" className="block mt-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (state === "results" && currentAttempt) {
    return (
      <>
        <ResultsScreen
          questions={questions}
          answers={answers}
          onRetry={startTest}
          attempt={currentAttempt}
          onShare={(a) => setShareAttempt(a)}
        />
        {shareAttempt && (
          <ShareModal attempt={shareAttempt} onClose={() => setShareAttempt(null)} />
        )}
      </>
    );
  }

  const q = questions[current];
  const sectionLabels: Record<string, string> = {
    vehicle_controls: "Vehicle Controls",
    road_signs: "Road Signs",
    rules: "Rules of the Road",
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="font-medium text-white">Q {current + 1} of {questions.length}</span>
            <span className="hidden sm:block text-slate-500">|</span>
            <span className="hidden sm:block">{sectionLabels[q.section]}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <TestTimer key={timerKey.current} totalSeconds={TOTAL_TIME} onExpire={handleExpire} />
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mt-2">
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <QuestionCard
            question={q}
            selected={answers[current]}
            onSelect={handleAnswer}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800 border-t border-slate-700 px-3 sm:px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Flag button */}
            <button
              onClick={toggleFlag}
              title={flagged.has(current) ? "Unflag" : "Flag for review"}
              className={`flex items-center gap-1 px-2 sm:px-3 py-2 text-xs rounded-lg border transition-colors ${flagged.has(current) ? "bg-yellow-600/20 border-yellow-500 text-yellow-400" : "border-slate-600 text-slate-400 hover:text-white"}`}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill={flagged.has(current) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span className="hidden sm:inline">{flagged.has(current) ? "Flagged" : "Flag"}</span>
            </button>

            {/* Review button */}
            <button
              onClick={() => setShowReview(true)}
              title="Review all questions"
              className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs border border-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
              </svg>
              <span className="hidden sm:inline">Review</span>
            </button>

            {/* End test button */}
            <button
              onClick={() => setShowEndConfirm(true)}
              title="End test"
              className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs bg-red-700/20 border border-red-700 text-red-400 hover:bg-red-700/40 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12H9m0 0l4-4m-4 4l4 4M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              <span className="hidden sm:inline">End</span>
            </button>
          </div>

          <button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            disabled={current === questions.length - 1}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden xs:inline sm:inline">Next</span>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <ReviewModal
          total={questions.length}
          answers={answers}
          flagged={flagged}
          current={current}
          onGoTo={setCurrent}
          onClose={() => setShowReview(false)}
          onEndTest={endTest}
        />
      )}

      {/* End Test Confirmation */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">End the test?</h3>
            <p className="text-slate-400 text-sm mb-5">
              {answers.filter((a) => a !== null).length} of {questions.length} questions answered.
              You can&apos;t go back after ending.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 border border-slate-600 text-slate-300 py-2.5 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={endTest}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                End Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
