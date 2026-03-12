import { useState, useEffect, useCallback } from "react";

export interface TestAttempt {
  id: string;
  date: string;
  sections: {
    vehicle_controls: { correct: number; total: number };
    road_signs: { correct: number; total: number };
    rules: { correct: number; total: number };
  };
  passed: boolean;
  totalCorrect: number;
  totalQuestions: number;
}

const STORAGE_KEY = "k53_test_history";
const MAX_ATTEMPTS = 20;

function loadFromStorage(): TestAttempt[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TestAttempt[];
  } catch {
    return [];
  }
}

function saveToStorage(attempts: TestAttempt[]): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch {
    // localStorage may be disabled (private browsing, storage quota)
  }
}

/**
 * Persists K53 test history in localStorage.
 * Handles SSR gracefully — returns empty history on server.
 * Keeps a maximum of 20 attempts, dropping the oldest on overflow.
 */
export function useTestHistory() {
  const [history, setHistory] = useState<TestAttempt[]>([]);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setHistory(loadFromStorage());
  }, []);

  const addAttempt = useCallback((attempt: TestAttempt) => {
    setHistory((prev) => {
      const updated = [attempt, ...prev].slice(0, MAX_ATTEMPTS);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, []);

  return { history, addAttempt, clearHistory };
}
