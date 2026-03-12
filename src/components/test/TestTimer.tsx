"use client";

import { useEffect, useState } from "react";

interface Props {
  totalSeconds: number;
  onExpire: () => void;
}

export default function TestTimer({ totalSeconds, onExpire }: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const isLow = remaining < 300; // under 5 minutes

  return (
    <span className={`font-mono font-bold ${isLow ? "text-red-400 animate-pulse" : "text-white"}`}>
      {mins}:{secs}
    </span>
  );
}
