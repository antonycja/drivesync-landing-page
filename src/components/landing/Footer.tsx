import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-semibold">DriveSync</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/mock-test" className="hover:text-white transition-colors">Mock Test</Link>
            <Link href="/learning-hub" className="hover:text-white transition-colors">Learning Hub</Link>
          </nav>
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} DriveSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
