"use client";

import { motion } from "framer-motion";

interface ScorePanelProps {
  name: string;
  score: number;
  isActive: boolean;
  badge?: string;
  onBuzz: () => void;
  onAdjust: (delta: number) => void;
}

export default function ScorePanel({
  name,
  score,
  isActive,
  badge,
  onBuzz,
  onAdjust,
}: ScorePanelProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onBuzz}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onBuzz();
        }
      }}
      className={`feud-panel relative flex w-full cursor-pointer flex-col items-center gap-1 rounded-xl px-4 py-3 transition-transform md:px-6 md:py-4 ${
        isActive ? "animate-glow-pulse scale-[1.03]" : "hover:scale-[1.01]"
      }`}
    >
      {isActive && badge && (
        <span className="font-display absolute -top-3 rounded-full bg-[var(--feud-gold)] px-3 py-0.5 text-[10px] text-[var(--feud-navy-dark)] uppercase md:text-xs">
          {badge}
        </span>
      )}
      <span className="font-display max-w-full truncate text-sm text-[var(--feud-gold-light)] uppercase md:text-lg">
        {name}
      </span>
      <motion.span
        key={score}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="font-display text-4xl text-white md:text-6xl"
      >
        {score}
      </motion.span>
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdjust(-10);
          }}
          className="cursor-pointer rounded bg-white/10 px-2 py-0.5 text-xs text-white/70 hover:bg-white/20"
        >
          -10
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdjust(10);
          }}
          className="cursor-pointer rounded bg-white/10 px-2 py-0.5 text-xs text-white/70 hover:bg-white/20"
        >
          +10
        </button>
      </div>
    </div>
  );
}
