const steps = [
  {
    step: "01",
    title: "Study",
    description: "Use the Learning Hub to master road signs, vehicle controls, and rules of the road with our topic guides and flash cards.",
  },
  {
    step: "02",
    title: "Practice",
    description: "Take full 64-question mock tests under real exam conditions. Review your results and identify weak spots.",
  },
  {
    step: "03",
    title: "Book Lessons",
    description: "Once ready, use DriveSync to book driving lessons. Our smart system matches you with the best instructor near you.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-slate-400 text-lg">Three steps to your licence</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0" style={{ width: "calc(100% - 3rem)" }} />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm mb-4">
                  {s.step}
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
