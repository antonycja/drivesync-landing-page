import Hero from "@/components/landing/Hero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import CtaSection from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      {/* Stats bar */}
      <div className="bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">64</span> questions per test
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">60</span> minute timer
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">Code 8 / 10 / 14</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">100%</span> free mock tests
            </span>
          </div>
        </div>
      </div>
      <FeaturesSection />
      <HowItWorks />
      {/* CTA section */}
      <CtaSection />
      <Footer />
    </div>
  );
}
