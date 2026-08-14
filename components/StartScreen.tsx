"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";

interface StartScreenProps {
  soundOn: boolean;
  onToggleSound: () => void;
  onStart: () => void;
}

export default function StartScreen({
  soundOn,
  onToggleSound,
  onStart,
}: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex w-full max-w-2xl flex-col items-center gap-8 px-4 py-10 text-center"
    >
      <button
        type="button"
        onClick={onToggleSound}
        className="absolute top-0 right-4 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/70 hover:bg-white/10"
      >
        {soundOn ? "🔊 Lyd til" : "🔇 Lyd fra"}
      </button>

      <Logo />
      <p className="font-display text-lg text-[var(--feud-gold-light)] uppercase md:text-2xl">
        Familie Duel
      </p>

      <div className="feud-panel flex w-full flex-col gap-6 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-center gap-4">
          <span className="font-display rounded-lg border-2 border-[var(--feud-gold)] bg-white/10 px-6 py-3 text-xl text-[var(--feud-gold-light)] uppercase md:text-2xl">
            Kai
          </span>
          <span className="font-display text-white/40">vs</span>
          <span className="font-display rounded-lg border-2 border-[var(--feud-gold)] bg-white/10 px-6 py-3 text-xl text-[var(--feud-gold-light)] uppercase md:text-2xl">
            Slotte
          </span>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="font-display mx-auto w-full max-w-xs rounded-xl border-2 border-[var(--feud-gold)] bg-gradient-to-b from-[var(--feud-red)] to-[var(--feud-red-dark)] px-8 py-4 text-2xl text-white uppercase shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Start
        </button>
      </div>
    </motion.div>
  );
}
