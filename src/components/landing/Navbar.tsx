"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTestContext } from "@/context/TestContext";


const links = [
  { href: "/mock-test", label: "Mock Test" },
  { href: "/learning-hub", label: "Learning Hub" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isTestActive } = useTestContext();

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleTestActiveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("⚠️ Test in Progress\n\nYou cannot navigate away while taking a test. Please complete the test first.");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          {isTestActive ? (
            <button
              onClick={handleTestActiveClick}
              className="flex items-center gap-2 flex-shrink-0 cursor-not-allowed opacity-50"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">DriveSync</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">DriveSync</span>
            </Link>
          )}

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return isTestActive ? (
                <button
                  key={href}
                  onClick={handleTestActiveClick}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-400/50 cursor-not-allowed"
                >
                  {label}
                </button>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-white bg-slate-800"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => isTestActive ? handleTestActiveClick : window.dispatchEvent(new CustomEvent("open-waitlist"))}
              disabled={isTestActive}
              className={`hidden sm:block text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isTestActive
                  ? "bg-slate-700/50 cursor-not-allowed opacity-50"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              Join the Waitlist
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              disabled={isTestActive}
              aria-label="Toggle menu"
              className={`sm:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                isTestActive
                  ? "text-slate-400/50 cursor-not-allowed"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className="absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return isTestActive ? (
                <button
                  key={href}
                  onClick={handleTestActiveClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors text-slate-400/50 cursor-not-allowed"
                >
                  {label}
                </button>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => { 
                  if (isTestActive) {
                    handleTestActiveClick;
                  } else {
                    setMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("open-waitlist"));
                  }
                }}
                disabled={isTestActive}
                className={`flex items-center justify-center w-full font-semibold py-3 rounded-xl transition-colors ${
                  isTestActive
                    ? "bg-slate-700/50 text-slate-400/50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
