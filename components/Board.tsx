"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnswerTile from "./AnswerTile";
import type { Question } from "@/lib/types";

interface BoardProps {
  question: Question;
  revealed: boolean[];
  onToggle: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function Board({
  question,
  revealed,
  onToggle,
  questionNumber,
  totalQuestions,
}: BoardProps) {
  const n = question.answers.length;
  const useTwoColumns = n > 4;
  const half = Math.ceil(n / 2);
  const leftIndices = Array.from(
    { length: useTwoColumns ? half : n },
    (_, i) => i,
  );
  const rightIndices = useTwoColumns
    ? Array.from({ length: n - half }, (_, i) => i + half)
    : [];

  return (
    <div className="feud-panel w-full max-w-4xl rounded-2xl p-4 md:p-6">
      <div className="mb-3 text-center text-xs text-[var(--feud-gold-light)] md:text-sm">
        Spørgsmål {questionNumber} / {totalQuestions}
      </div>

      <AnimatePresence mode="wait">
        <motion.h2
          key={question.id}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3 }}
          className="font-display mb-4 text-center text-xl text-white uppercase md:text-3xl"
        >
          {question.question}
        </motion.h2>
      </AnimatePresence>

      <div
        className={
          useTwoColumns
            ? "grid grid-cols-1 gap-3 md:grid-cols-2"
            : "mx-auto grid max-w-xl grid-cols-1 gap-3"
        }
      >
        <div className="flex flex-col gap-3">
          {leftIndices.map((i) => (
            <AnswerTile
              key={`${question.id}-${i}`}
              index={i}
              answer={question.answers[i]}
              revealed={revealed[i]}
              onToggle={() => onToggle(i)}
            />
          ))}
        </div>
        {useTwoColumns && (
          <div className="flex flex-col gap-3">
            {rightIndices.map((i) => (
              <AnswerTile
                key={`${question.id}-${i}`}
                index={i}
                answer={question.answers[i]}
                revealed={revealed[i]}
                onToggle={() => onToggle(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
