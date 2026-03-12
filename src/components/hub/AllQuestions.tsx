"use client";

import { useState } from "react";
import Image from "next/image";
import allQuestions from "@/data/questions.json";

type SectionFilter = "all" | "vehicle_controls" | "road_signs" | "rules";

const sectionLabels: Record<string, string> = {
  vehicle_controls: "Vehicle Controls",
  road_signs: "Road Signs",
  rules: "Rules of the Road",
};

const sectionColors: Record<string, string> = {
  vehicle_controls: "bg-purple-600/20 text-purple-400 border-purple-600/40",
  road_signs: "bg-blue-600/20 text-blue-400 border-blue-600/40",
  rules: "bg-green-600/20 text-green-400 border-green-600/40",
};

export default function AllQuestions() {
  const [filter, setFilter] = useState<SectionFilter>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = allQuestions.filter((q) => {
    const sectionMatch = filter === "all" || q.section === filter;
    const searchMatch = search === "" || q.question.toLowerCase().includes(search.toLowerCase());
    return sectionMatch && searchMatch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Section filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "vehicle_controls", "road_signs", "rules"] as SectionFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === s
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-600 text-slate-400 hover:text-white hover:border-slate-400"
              }`}
            >
              {s === "all" ? "All" : sectionLabels[s]}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? "question" : "questions"} found
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {filtered.map((q) => {
          const isOpen = expanded === q.id;
          return (
            <div
              key={q.id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : q.id)}
                className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-slate-700/40 transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                  {q.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${sectionColors[q.section]}`}>
                      {sectionLabels[q.section]}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-snug">{q.question}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-700">
                  <div className="flex gap-5 mt-4 items-start">
                    {/* Answer options */}
                    <div className="flex-1 space-y-2">
                      {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.correct;
                        const label = String.fromCharCode(65 + idx);
                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border text-sm ${
                              isCorrect
                                ? "bg-green-600/20 border-green-600/50 text-green-300"
                                : "bg-slate-700/40 border-slate-600/50 text-slate-400"
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isCorrect ? "bg-green-600 text-white" : "bg-slate-600 text-slate-300"
                            }`}>
                              {label}
                            </span>
                            <span className="leading-snug">{opt}</span>
                            {isCorrect && (
                              <svg className="w-4 h-4 text-green-400 flex-shrink-0 ml-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                      {/* Explanation */}
                      <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-xs text-slate-400 leading-relaxed">
                        <span className="font-medium text-slate-300">Explanation: </span>
                        {q.explanation}
                      </div>
                    </div>
                    {/* Sign image */}
                    {q.image && (
                      <div className="flex-shrink-0 bg-white rounded-xl p-2 shadow-lg">
                        <Image
                          src={q.image}
                          alt="Road sign"
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
