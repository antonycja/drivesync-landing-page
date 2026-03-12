"use client";

import { useState } from "react";
import Image from "next/image";
import signsData from "@/data/signs.json";

type Category = "all" | "regulatory" | "warning" | "information";

const categoryBadge: Record<string, string> = {
  regulatory: "border-red-500/50 text-red-400 bg-red-500/10",
  warning: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  information: "border-blue-500/50 text-blue-400 bg-blue-500/10",
};

const categoryBorder: Record<string, string> = {
  regulatory: "border-red-800/50 hover:border-red-600/60",
  warning: "border-yellow-800/50 hover:border-yellow-600/60",
  information: "border-blue-800/50 hover:border-blue-600/60",
};

const categoryLabels: Record<string, string> = {
  regulatory: "Regulatory",
  warning: "Warning",
  information: "Information",
};

export default function SignsGlossary() {
  const [filter, setFilter] = useState<Category>("all");

  const filtered = filter === "all" ? signsData : signsData.filter((s) => s.category === filter);

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "regulatory", "warning", "information"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === cat
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-slate-600 text-slate-400 hover:text-white hover:border-slate-400"
            }`}
          >
            {cat === "all" ? `All Signs (${signsData.length})` : `${categoryLabels[cat]} (${signsData.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Signs grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((sign) => (
          <div
            key={sign.code}
            className={`bg-slate-800 border rounded-xl p-4 transition-colors ${categoryBorder[sign.category] || "border-slate-700"}`}
          >
            {/* Sign image */}
            <div className="flex items-center justify-center h-28 bg-slate-700/30 rounded-lg mb-3">
              {sign.image ? (
                <Image
                  src={sign.image}
                  alt={sign.name}
                  width={100}
                  height={100}
                  className="object-contain max-h-24"
                />
              ) : (
                <div className="text-slate-500 text-xs text-center px-2">No image</div>
              )}
            </div>
            {/* Info */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-mono font-bold text-white text-xs">{sign.code}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${categoryBadge[sign.category]}`}>
                {categoryLabels[sign.category]}
              </span>
            </div>
            <h3 className="text-white font-medium text-sm mb-1.5 leading-tight">{sign.name}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{sign.meaning}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">No signs in this category.</div>
      )}
    </div>
  );
}
