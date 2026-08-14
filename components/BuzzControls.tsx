"use client";

interface BuzzControlsProps {
  onWrong: () => void;
  onNext: () => void;
  onReset: () => void;
  isLastQuestion: boolean;
  wrongDisabled: boolean;
}

export default function BuzzControls({
  onWrong,
  onNext,
  onReset,
  isLastQuestion,
  wrongDisabled,
}: BuzzControlsProps) {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onWrong}
          disabled={wrongDisabled}
          className="font-display w-full rounded-xl border-2 border-[var(--feud-gold)] bg-gradient-to-b from-[var(--feud-red)] to-[var(--feud-red-dark)] px-8 py-3 text-xl text-white uppercase shadow-lg transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          ✕ Forkert
          <span className="ml-2 rounded border border-white/30 bg-black/20 px-1.5 py-0.5 text-xs normal-case text-white/70">
            T
          </span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="font-display w-full rounded-xl border-2 border-[var(--feud-gold)] bg-gradient-to-b from-[var(--feud-gold)] to-[#a8791f] px-8 py-3 text-xl text-[var(--feud-navy-dark)] uppercase shadow-lg transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
        >
          ⟳ Ny chance
          <span className="ml-2 rounded border border-black/20 bg-black/10 px-1.5 py-0.5 text-xs normal-case text-[var(--feud-navy-dark)]/70">
            R
          </span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="font-display w-full rounded-xl border-2 border-[var(--feud-gold)] bg-gradient-to-b from-[var(--feud-blue)] to-[var(--feud-navy)] px-8 py-3 text-xl text-white uppercase shadow-lg transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
        >
          {isLastQuestion ? "Afslut spillet →" : "Næste spørgsmål →"}
          <span className="ml-2 rounded border border-white/30 bg-black/20 px-1.5 py-0.5 text-xs normal-case text-white/70">
            N
          </span>
        </button>
      </div>
    </div>
  );
}
