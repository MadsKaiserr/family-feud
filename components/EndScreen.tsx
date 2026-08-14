"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";

interface Player {
  name: string;
  score: number;
}

interface EndScreenProps {
  players: [Player, Player];
}

// Deterministic pseudo-random spread (no Math.random) so confetti layout
// stays a pure function of the piece index.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: seeded(i, 1) * 100,
  delay: seeded(i, 2) * 2,
  duration: 2.5 + seeded(i, 3) * 2,
  color: ["#ffcf5c", "#d61f2c", "#1e40c4", "#ffffff"][i % 4],
  size: 6 + seeded(i, 4) * 8,
}));

export default function EndScreen({ players }: EndScreenProps) {
  const [p1, p2] = players;
  const winner = p1.score === p2.score ? null : p1.score > p2.score ? p1 : p2;

  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center gap-8 overflow-hidden px-4 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI.map((c) => (
          <span
            key={c.id}
            className="animate-confetti absolute top-0 rounded-sm"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.4,
              backgroundColor: c.color,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      <Logo small />
      <h2 className="font-display text-3xl text-white uppercase md:text-5xl">
        Spillet er slut!
      </h2>

      <div className="feud-panel z-10 flex w-full flex-col gap-6 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 gap-4">
          {[p1, p2].map((p) => (
            <motion.div
              key={p.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 ${
                winner === p
                  ? "border-[var(--feud-gold)] bg-white/10"
                  : "border-white/10"
              }`}
            >
              {winner === p && <span className="text-3xl">👑</span>}
              <span className="font-display text-lg text-[var(--feud-gold-light)] uppercase">
                {p.name}
              </span>
              <span className="font-display text-4xl text-white md:text-6xl">
                {p.score}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="font-display text-xl text-[var(--feud-gold)] uppercase">
          {winner ? `${winner.name} vinder!` : "Det blev uafgjort!"}
        </p>
      </div>
    </div>
  );
}
