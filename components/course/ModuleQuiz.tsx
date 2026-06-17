"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/courses";

type Props = {
  questions: QuizQuestion[];
};

export function ModuleQuiz({ questions }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((_, i) => selected[i] !== undefined);
  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.correctIndex).length
    : 0;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    if (allAnswered) setSubmitted(true);
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
  };

  return (
    <div className="mt-12 rounded-[16px] border border-[var(--rule)] bg-[color:var(--bg-alt)] p-[clamp(1.5rem,3vw,2.5rem)]">
      {/* Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
        <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
        Check your understanding
      </div>

      {/* Questions */}
      <div className="space-y-10">
        {questions.map((q, qIdx) => {
          const userAnswer = selected[qIdx];
          const isCorrect = submitted && userAnswer === q.correctIndex;
          const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correctIndex;

          return (
            <div key={qIdx}>
              {/* Question text */}
              <p className="mb-4 font-display italic text-[color:var(--fg)] leading-[1.3] text-[clamp(1rem,1.6vw,1.15rem)]">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isCorrectOpt = optIdx === q.correctIndex;

                  let cls =
                    "flex w-full items-start gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors cursor-pointer font-body text-[14px] leading-[1.6] ";

                  if (!submitted) {
                    cls += isSelected
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-tint)] text-[color:var(--fg)]"
                      : "border-[var(--rule)] bg-[color:var(--bg)] text-[color:var(--fg-2)] hover:border-[var(--rule-strong)] hover:text-[color:var(--fg)]";
                  } else if (isCorrectOpt) {
                    cls += "border-emerald-500/40 bg-emerald-500/8 text-[color:var(--fg)]";
                  } else if (isSelected && !isCorrectOpt) {
                    cls += "border-rose-500/40 bg-rose-500/8 text-[color:var(--fg-2)]";
                  } else {
                    cls += "border-[var(--rule)] bg-[color:var(--bg)] text-[color:var(--fg-3)] opacity-60";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={cls}
                    >
                      {/* Option indicator */}
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[9px]">
                        {submitted && isCorrectOpt ? (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : submitted && isSelected && !isCorrectOpt ? (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        ) : (
                          String.fromCharCode(65 + optIdx)
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (shown after submit) */}
              {submitted && q.explanation && (isCorrect || isWrong) && (
                <div className={`mt-3 rounded-[8px] border-l-2 pl-4 py-2 font-body text-[13px] leading-[1.65] ${isCorrect ? "border-emerald-500/60 text-[color:var(--fg-2)]" : "border-rose-500/60 text-[color:var(--fg-2)]"}`}>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="rounded-full bg-[color:var(--fg)] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--bg)] transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            Submit answers
          </button>
        ) : (
          <>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
              {score} of {questions.length} correct
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-[var(--rule)] bg-[color:var(--bg)] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-2)] transition-colors hover:border-[var(--rule-strong)] hover:text-[color:var(--fg)] cursor-pointer"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
