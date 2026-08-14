"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@/lib/types";
import {
  playBuzzIn,
  playFanfare,
  playReveal,
  playStrike,
  setSoundEnabled,
} from "@/lib/sound";
import Logo from "./Logo";
import Board from "./Board";
import StrikeDisplay from "./StrikeDisplay";
import ScorePanel from "./ScorePanel";
import StartScreen from "./StartScreen";
import EndScreen from "./EndScreen";
import ConfettiBurst from "./Confetti";

type Phase = "start" | "playing" | "end";
type TileState = null | 0 | 1 | -1;
type PlayerIndex = 0 | 1;

interface Player {
  name: string;
  score: number;
}

const PLAYER_NAMES: [string, string] = ["Kai", "Slotte"];

export default function Game({ questions }: { questions: Question[] }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [players, setPlayers] = useState<[Player, Player]>([
    { name: PLAYER_NAMES[0], score: 0 },
    { name: PLAYER_NAMES[1], score: 0 },
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [tileStates, setTileStates] = useState<TileState[]>([]);
  // buzzedFirst: who buzzed in first this round. wrongCount: 0 = no misses yet,
  // 1 = first buzzer missed and control passed to the opponent, 2 = the
  // opponent also missed and the round is over (no steal, no third strike).
  const [buzzedFirst, setBuzzedFirst] = useState<PlayerIndex | null>(null);
  const [wrongCount, setWrongCount] = useState<0 | 1 | 2>(0);
  const [soundOn, setSoundOn] = useState(true);
  const [confettiBurst, setConfettiBurst] = useState<number | null>(null);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const triggerConfetti = useCallback(() => {
    setConfettiBurst(Date.now());
    if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    confettiTimeoutRef.current = setTimeout(() => setConfettiBurst(null), 2200);
  }, []);

  const currentQuestion = questions[questionIndex];

  const activePlayer: PlayerIndex | null =
    buzzedFirst === null || wrongCount === 2
      ? null
      : wrongCount === 1
        ? buzzedFirst === 0
          ? 1
          : 0
        : buzzedFirst;

  const roundOver = wrongCount === 2;

  const startGame = () => {
    setPlayers([
      { name: PLAYER_NAMES[0], score: 0 },
      { name: PLAYER_NAMES[1], score: 0 },
    ]);
    setQuestionIndex(0);
    setTileStates(Array(questions[0].answers.length).fill(null));
    setBuzzedFirst(null);
    setWrongCount(0);
    setPhase("playing");
    playFanfare();
  };

  const selectBuzzedFirst = (idx: PlayerIndex) => {
    setBuzzedFirst((prev) => (prev === idx ? null : idx));
    setWrongCount(0);
    playBuzzIn();
  };

  const adjustScore = useCallback((idx: PlayerIndex, delta: number) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, score: p.score + delta } : p)) as [
        Player,
        Player,
      ],
    );
  }, []);

  const toggleAnswer = useCallback(
    (idx: number) => {
      const current = tileStates[idx];
      const next = [...tileStates];

      if (current === null) {
        next[idx] = activePlayer === null ? -1 : activePlayer;
        setTileStates(next);
        playReveal();
        if (activePlayer !== null) {
          const points = currentQuestion.answers[idx].points;
          adjustScore(activePlayer, points);
          triggerConfetti();
        }
      } else {
        next[idx] = null;
        setTileStates(next);
        if (current === 0 || current === 1) {
          const points = currentQuestion.answers[idx].points;
          adjustScore(current, -points);
        }
      }
    },
    [tileStates, activePlayer, currentQuestion, adjustScore, triggerConfetti],
  );

  const markWrong = useCallback(() => {
    if (buzzedFirst === null || wrongCount >= 2) return;
    setWrongCount((prev) => (prev + 1) as 0 | 1 | 2);
    playStrike();
  }, [buzzedFirst, wrongCount]);

  const resetRound = useCallback(() => {
    setBuzzedFirst(null);
    setWrongCount(0);
    playBuzzIn();
  }, []);

  const goNext = useCallback(() => {
    setQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < questions.length) {
        setTileStates(Array(questions[nextIndex].answers.length).fill(null));
        setBuzzedFirst(null);
        setWrongCount(0);
        return nextIndex;
      }
      setPhase("end");
      playFanfare();
      return prevIndex;
    });
  }, [questions]);

  const goPrevious = useCallback(() => {
    setQuestionIndex((prevIndex) => {
      if (prevIndex === 0) return prevIndex;
      const newIndex = prevIndex - 1;
      setTileStates(Array(questions[newIndex].answers.length).fill(null));
      setBuzzedFirst(null);
      setWrongCount(0);
      return newIndex;
    });
  }, [questions]);

  const endGameEarly = useCallback(() => {
    setPhase("end");
    playFanfare();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "t") {
        e.preventDefault();
        markWrong();
        return;
      }
      if (key === "n") {
        e.preventDefault();
        goNext();
        return;
      }
      if (key === "b") {
        e.preventDefault();
        goPrevious();
        return;
      }
      if (key === "p") {
        e.preventDefault();
        endGameEarly();
        return;
      }
      if (key === "r") {
        e.preventDefault();
        resetRound();
        return;
      }
      const answerNumber = Number(e.key);
      if (
        Number.isInteger(answerNumber) &&
        answerNumber >= 1 &&
        answerNumber <= currentQuestion.answers.length
      ) {
        e.preventDefault();
        toggleAnswer(answerNumber - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    phase,
    markWrong,
    goNext,
    goPrevious,
    endGameEarly,
    resetRound,
    toggleAnswer,
    currentQuestion,
  ]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const badgeFor = (idx: PlayerIndex) => {
    if (activePlayer !== idx) return undefined;
    return idx === buzzedFirst ? "Buzzede først" : "Svarer nu";
  };

  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 py-8">
      <AnimatePresence mode="wait">
        {phase === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full flex-col items-center"
          >
            <StartScreen
              soundOn={soundOn}
              onToggleSound={toggleSound}
              onStart={startGame}
            />
          </motion.div>
        )}

        {phase === "playing" && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full max-w-5xl flex-col items-center gap-6"
          >
            <Logo small />

            <Board
              question={currentQuestion}
              revealed={tileStates.map((t) => t !== null)}
              onToggle={toggleAnswer}
              questionNumber={questionIndex + 1}
              totalQuestions={questions.length}
            />

            <div className="flex flex-col items-center gap-2">
              <StrikeDisplay
                strikes={wrongCount}
                onSetStrikes={(n) => setWrongCount(n as 0 | 1 | 2)}
              />
              {roundOver && (
                <p className="font-display text-sm text-[var(--feud-red)] uppercase md:text-base">
                  Runden er slut
                </p>
              )}
            </div>

            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              <ScorePanel
                name={players[0].name}
                score={players[0].score}
                isActive={activePlayer === 0}
                badge={badgeFor(0)}
                onBuzz={() => selectBuzzedFirst(0)}
                onAdjust={(delta) => adjustScore(0, delta)}
              />
              <ScorePanel
                name={players[1].name}
                score={players[1].score}
                isActive={activePlayer === 1}
                badge={badgeFor(1)}
                onBuzz={() => selectBuzzedFirst(1)}
                onAdjust={(delta) => adjustScore(1, delta)}
              />
            </div>

            {/* <BuzzControls
              onWrong={markWrong}
              onNext={goNext}
              onReset={resetRound}
              isLastQuestion={questionIndex === questions.length - 1}
              wrongDisabled={buzzedFirst === null || roundOver}
            /> */}
          </motion.div>
        )}

        {phase === "end" && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full flex-col items-center"
          >
            <EndScreen players={players} />
          </motion.div>
        )}
      </AnimatePresence>

      {confettiBurst !== null && <ConfettiBurst burstId={confettiBurst} />}
    </main>
  );
}
