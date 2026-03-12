"use client";

import { useState } from "react";
import SignsGlossary from "@/components/hub/SignsGlossary";
import TopicGuides from "@/components/hub/TopicGuides";
import PracticeMode from "@/components/hub/PracticeMode";
import AllQuestions from "@/components/hub/AllQuestions";

type Tab = "signs" | "guides" | "practice" | "questions";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "signs", label: "Signs Glossary", icon: "🚦" },
  { id: "guides", label: "Topic Guides", icon: "📖" },
  { id: "practice", label: "Quick Practice", icon: "⚡" },
  { id: "questions", label: "All Questions", icon: "📋" },
];

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>("signs");

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Learning Hub</h1>
          <p className="text-slate-400 text-sm">Master road signs, rules, and vehicle controls before your test</p>
        </div>
        {/* Tabs — scroll horizontally on small screens */}
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "signs" && <SignsGlossary />}
        {activeTab === "guides" && <TopicGuides />}
        {activeTab === "practice" && <PracticeMode />}
        {activeTab === "questions" && <AllQuestions />}
      </div>
    </div>
  );
}
