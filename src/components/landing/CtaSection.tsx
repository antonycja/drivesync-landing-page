"use client";

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-950 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to get your licence?
        </h2>
        <p className="text-slate-300 mb-8">
          Start with a free mock test right now, or join the waitlist for the full DriveSync platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/mock-test"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start Free Mock Test
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-waitlist"))}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
