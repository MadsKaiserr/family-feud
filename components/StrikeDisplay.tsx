"use client";

interface StrikeDisplayProps {
  strikes: number;
  onSetStrikes: (n: number) => void;
}

export default function StrikeDisplay({
  strikes,
  onSetStrikes,
}: StrikeDisplayProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 rounded-xl p-2 md:gap-4 ${
        strikes > 0 ? "animate-flash-bg" : ""
      }`}
    >
      {[0, 1].map((i) => {
        const lit = i < strikes;
        return (
          <button
            key={i}
            type="button"
            disabled={!lit}
            onClick={() => onSetStrikes(i)}
            title={
              lit ? "Klik for at fortryde denne og efterfølgende fejl" : undefined
            }
            className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 transition-colors md:h-16 md:w-16 ${
              lit
                ? "cursor-pointer border-[var(--feud-gold)] bg-[var(--feud-red-dark)]"
                : "border-white/15 bg-white/5"
            }`}
          >
            {lit && (
              <span className="animate-strike-pop font-display text-3xl text-white md:text-4xl">
                X
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
