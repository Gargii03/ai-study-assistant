import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Info,
} from 'lucide-react';

export default function QuizTab({ quiz = [] }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#F7C8D3]/70 p-8 font-sans">
        <p className="text-[#2D3A47]/70 text-sm font-normal">No quiz available. Generate study notes first!</p>
      </div>
    );
  }

  const handleSelectOption = (questionIdx, optionIdx) => {
    if (selectedAnswers[questionIdx] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === quiz.length;

  const correctCount = quiz.reduce((count, q, idx) => {
    return selectedAnswers[idx] === q.correctAnswer ? count + 1 : count;
  }, 0);

  const percentage = Math.round((correctCount / quiz.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header with live score indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3E8DE]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#2D3A47] flex items-center gap-2 tracking-tight">
            <span>Comprehension Self-Assessment Quiz</span>
          </h3>
          <p className="font-sans font-normal text-sm text-[#2D3A47]/70 mt-0.5">
            Select an answer to reveal instant feedback and detailed explanations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tag / Pill: Soft pastel background using Sage Leaf (#A8B58A) with dark readable text */}
          <div className="text-xs font-medium font-sans px-3 py-1.5 rounded-full bg-[#A8B58A]/30 text-[#2D3A47] border border-[#A8B58A]/60 shadow-2xs">
            Progress: {answeredCount}/{quiz.length} Answered
          </div>

          {(answeredCount > 0 || showResults) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#2D3A47] hover:text-[#2D3A47] bg-[#FFF7E6] hover:bg-[#FDEFD2] border border-[#F3E8DE] px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-[#B46A72]" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Score Banner - Deep Contrast Midnight Lagoon Card (#2D3A47) */}
      {isComplete && (
        <div className="p-6 rounded-2xl bg-[#2D3A47] text-white shadow-xl border border-[#A9B7C6]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF7E6]/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-[#FFF7E6]/20">
              <Award className="w-8 h-8 text-[#A8B58A]" />
            </div>
            <div>
              <h4 className="text-2xl font-serif font-medium text-white tracking-tight">Quiz Completed!</h4>
              <p className="font-sans font-normal text-sm text-[#FFF7E6]/90 mt-0.5">
                You scored <span className="font-medium text-[#A8B58A]">{correctCount}</span> out of{' '}
                <span className="font-medium text-[#A8B58A]">{quiz.length}</span> ({percentage}%)
              </p>
            </div>
          </div>

          {/* Primary CTA Button: Rosewood (#B46A72) with refined font-medium */}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-[#B46A72] hover:bg-[#9F565E] active:bg-[#86434B] text-white px-5 py-2.5 rounded-xl font-sans font-medium text-sm shadow-md shadow-[#B46A72]/20 transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {quiz.map((item, qIdx) => {
          const selectedOpt = selectedAnswers[qIdx];
          const hasAnswered = selectedOpt !== undefined;
          const isCorrect = hasAnswered && selectedOpt === item.correctAnswer;

          return (
            <div
              key={qIdx}
              className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all ${
                hasAnswered
                  ? isCorrect
                    ? 'border-[#A8B58A] shadow-xs ring-1 ring-[#A8B58A]/30'
                    : 'border-[#F7C8D3] shadow-xs ring-1 ring-[#F7C8D3]'
                  : 'border-[#F3E8DE] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  {/* Tag / Pill: Soft pastel Blush Petal */}
                  <span className="w-6 h-6 rounded-full bg-[#F7C8D3]/50 text-[#2D3A47] font-sans text-xs font-medium flex items-center justify-center shrink-0 mt-0.5 border border-[#F7C8D3]">
                    {qIdx + 1}
                  </span>
                  <h4 className="font-serif font-medium text-lg sm:text-xl text-[#2D3A47] leading-snug tracking-tight">
                    {item.question}
                  </h4>
                </div>

                {hasAnswered && (
                  <span
                    className={`inline-flex items-center gap-1 font-sans text-xs font-medium px-3 py-1 rounded-full shrink-0 border ${
                      isCorrect
                        ? 'bg-[#A8B58A]/30 text-[#2D3A47] border-[#A8B58A]'
                        : 'bg-[#F7C8D3]/50 text-[#2D3A47] border-[#B46A72]'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#56613F]" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-[#B46A72]" />
                        Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="grid gap-2.5 pl-0 sm:pl-9">
                {item.options.map((option, optIdx) => {
                  const isThisSelected = selectedOpt === optIdx;
                  const isThisCorrectAnswer = item.correctAnswer === optIdx;

                  let optionClasses =
                    'border-[#A9B7C6]/50 bg-white hover:bg-[#FFF7E6]/60 text-[#2D3A47] hover:border-[#B46A72]/60';
                  let icon = null;

                  if (hasAnswered) {
                    if (isThisCorrectAnswer) {
                      // Correct option: Sage Leaf highlight
                      optionClasses =
                        'border-[#A8B58A] bg-[#A8B58A]/20 text-[#2D3A47] font-medium ring-2 ring-[#A8B58A]/40';
                      icon = <CheckCircle2 className="w-4 h-4 text-[#56613F] shrink-0" />;
                    } else if (isThisSelected && !isThisCorrectAnswer) {
                      // Selected wrong option: Rosewood / Blush tint
                      optionClasses =
                        'border-[#B46A72] bg-[#F7C8D3]/30 text-[#2D3A47] font-medium ring-2 ring-[#B46A72]/30';
                      icon = <XCircle className="w-4 h-4 text-[#B46A72] shrink-0" />;
                    } else {
                      optionClasses = 'border-[#F3E8DE] bg-[#FFF7E6]/20 text-[#2D3A47]/40 opacity-70';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-sm font-sans font-normal ${optionClasses} ${
                        !hasAnswered ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-medium font-sans flex items-center justify-center shrink-0 ${
                            hasAnswered && isThisCorrectAnswer
                              ? 'bg-[#A8B58A] text-[#1B242E]'
                              : hasAnswered && isThisSelected
                              ? 'bg-[#B46A72] text-white'
                              : 'bg-[#FFF7E6] border border-[#F3E8DE] text-[#2D3A47]'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {hasAnswered && (
                <div className="mt-4 sm:ml-9 p-3.5 rounded-xl bg-[#FFF7E6] border border-[#F3E8DE] text-xs font-sans text-[#2D3A47] space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-[#B46A72]">
                    <Info className="w-3.5 h-3.5 text-[#B46A72]" />
                    <span>Explanation:</span>
                  </div>
                  <p className="leading-relaxed pl-5 font-normal text-[#2D3A47]/90">{item.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
