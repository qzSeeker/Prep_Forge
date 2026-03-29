"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types";
import { CheckCircle2, Clock, ChevronRight, X, Shuffle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizModeProps {
  questions: Question[];
  onStatusChange: (id: string, status: "unseen" | "reviewing" | "known") => void;
  onClose: () => void;
}

export function QuizMode({ questions, onStatusChange, onClose }: QuizModeProps) {
  const [shuffled] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [results, setResults] = useState<{ known: number; reviewing: number }>({
    known: 0,
    reviewing: 0,
  });

  const current = shuffled[index];
  const isLast = index === shuffled.length - 1;
  const isDone = index >= shuffled.length;

  const handleMark = useCallback(
    (status: "reviewing" | "known") => {
      onStatusChange(current.id, status);
      setResults((r) => ({ ...r, [status]: r[status] + 1 }));
      setRevealed(false);
      setShowCode(false);
      setIndex((i) => i + 1);
    },
    [current, onStatusChange]
  );

  if (isDone) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg-0)]/95 backdrop-blur flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[var(--bg-2)] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-5"
        >
          <Trophy size={40} className="text-yellow-400 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-1">Session complete!</h2>
            <p className="text-sm text-zinc-500">
              You went through {shuffled.length} questions
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400 tabular-nums">
                {results.known}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">Got it</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400 tabular-nums">
                {results.reviewing}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">Still learning</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium transition-colors"
          >
            Back to questions
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-0)]/95 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <Shuffle size={15} className="text-zinc-500" />
          <span className="text-sm text-zinc-400">
            Quiz mode
          </span>
          <span className="text-xs text-zinc-600 tabular-nums">
            {index + 1} / {shuffled.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/8 rounded-lg transition-colors"
        >
          <X size={16} className="text-zinc-500" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-800">
        <motion.div
          className="h-full bg-[var(--accent)]"
          animate={{ width: `${((index) / shuffled.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--bg-2)] border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Question */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full border",
                      current.level === "fresher"
                        ? "text-blue-400 bg-blue-400/10 border-blue-500/20"
                        : current.level === "intermediate"
                        ? "text-yellow-400 bg-yellow-400/10 border-yellow-500/20"
                        : "text-red-400 bg-red-400/10 border-red-500/20"
                    )}
                  >
                    {current.level}
                  </span>
                  <span className="text-xs text-zinc-600">{current.category}</span>
                </div>
                <p className="text-base font-medium text-zinc-100 leading-relaxed">
                  {current.question}
                </p>
              </div>

              {/* Reveal */}
              <div className="border-t border-white/8">
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="w-full py-4 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/3 transition-colors"
                  >
                    Tap to reveal answer
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 space-y-4"
                  >
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {current.answer}
                    </p>
                    {current.codeExample && (
                      <div>
                        <button
                          onClick={() => setShowCode((s) => !s)}
                          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                          {showCode ? "▲ Hide code" : "▼ Show code example"}
                        </button>
                        {showCode && (
                          <motion.pre
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 p-4 bg-[var(--bg-0)] rounded-lg text-xs text-zinc-300 font-mono overflow-x-auto leading-relaxed"
                          >
                            <code>{current.codeExample}</code>
                          </motion.pre>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <button
                  onClick={() => handleMark("reviewing")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-sm text-yellow-400 font-medium transition-all"
                >
                  <Clock size={15} />
                  Still learning
                </button>
                <button
                  onClick={() => handleMark("known")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-sm text-green-400 font-medium transition-all"
                >
                  <CheckCircle2 size={15} />
                  Got it!
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed && (
            <button
              onClick={() => handleMark("reviewing")}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              Skip <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
