"use client";

import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isEmailValid = emailRegex.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmailValid) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      if (res.status === 201) {
        setStatus("success");
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else {
        const data = await res.json();
        setErrorMsg(data.detail || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Unable to connect. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-green-400 font-medium">You&apos;re on the list!</p>
        <p className="text-sm text-slate-400 text-center">We&apos;ll notify you when DriveSync launches.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full bg-slate-700/50 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors ${
            email && !isEmailValid ? "border-red-500 focus:border-red-500" : "border-slate-600 focus:border-blue-500"
          }`}
        />
        {email && !isEmailValid && (
          <p className="text-red-400 text-xs mt-1">Please enter a valid email address.</p>
        )}
      </div>
      {status === "duplicate" && (
        <p className="text-yellow-400 text-xs">This email is already on the waitlist.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading" || !isEmailValid || !email}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {status === "loading" ? "Joining..." : "Join the Waitlist"}
      </button>
      <p className="text-xs text-slate-500 text-center">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
