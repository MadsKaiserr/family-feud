"use client";

import { motion } from "framer-motion";
import type { Answer } from "@/lib/types";

interface AnswerTileProps {
  index: number;
  answer: Answer;
  revealed: boolean;
  onToggle: () => void;
}

export default function AnswerTile({
  index,
  answer,
  revealed,
  onToggle,
}: AnswerTileProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative w-full cursor-pointer rounded-lg [perspective:1200px] focus:outline-none"
      aria-label={revealed ? `${answer.text}, ${answer.points} point` : `Svar ${index + 1}, skjult`}
    >
      <motion.div
        className="grid w-full rounded-lg shadow-lg [transform-style:preserve-3d]"
        animate={{ rotateX: revealed ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="feud-tile-hidden col-start-1 row-start-1 flex min-h-16 items-center rounded-lg px-4 [backface-visibility:hidden] md:min-h-20 md:px-6">
          <span className="font-display text-2xl text-[var(--feud-gold)] md:text-3xl">
            {index + 1}
          </span>
        </div>

        <div
          className="feud-tile-revealed col-start-1 row-start-1 flex min-h-16 items-center justify-between gap-3 rounded-lg px-4 py-2 [backface-visibility:hidden] md:min-h-20 md:px-6"
          style={{ transform: "rotateX(180deg)" }}
        >
          <span className="font-display min-w-0 flex-1 text-lg leading-tight break-words tracking-wide text-[var(--feud-navy-dark)] uppercase md:text-2xl">
            {answer.text}
          </span>
          <span className="font-display shrink-0 rounded-md bg-[var(--feud-blue)] px-3 py-1 text-xl text-white md:text-2xl">
            {answer.points}
          </span>
        </div>
      </motion.div>
    </button>
  );
}
