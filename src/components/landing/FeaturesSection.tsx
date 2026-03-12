"use client";

import Link from "next/link";

const features = [
  {
    title: "64-Question Mock Tests",
    description: "Full K53 simulation with 60-minute timer, section pass marks, and detailed results breakdown.",
    href: "/mock-test",
    cta: "Start Test",
    color: "blue",
    anchor: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Learning Hub",
    description: "Road signs glossary, topic study guides, and timed flash-card practice — all in one place.",
    href: "/learning-hub",
    cta: "Start Learning",
    color: "purple",
    anchor: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Smart Lesson Booking",
    description: "DriveSync automatically matches you with the best instructor based on location and preferences.",
    href: "/#waitlist",
    cta: "Join Waitlist",
    color: "green",
    anchor: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-600/20 text-blue-400",
  purple: "bg-purple-600/20 text-purple-400",
  green: "bg-green-600/20 text-green-400",
};

const ctaClass = "text-sm font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors";

const Arrow = () => (
  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to pass
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From test prep to lesson booking, DriveSync covers your entire journey to getting licensed.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">{f.description}</p>
              {f.anchor ? (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-waitlist"))}
                  className={ctaClass}
                >
                  {f.cta}
                  <Arrow />
                </button>
              ) : (
                <Link href={f.href} className={ctaClass}>
                  {f.cta}
                  <Arrow />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
