import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function FlashcardTab({ flashcards = [] }) {
  const [cards, setCards] = useState(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#F7C8D3]/70 p-8 font-sans">
        <p className="text-[#2D3A47]/70 text-sm font-normal">No flashcards available. Generate study notes first!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const progressPercentage = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#2D3A47] flex items-center gap-2 tracking-tight">
            <span>Interactive 3D Flashcards</span>
          </h3>
          <p className="font-sans font-normal text-xs sm:text-sm text-[#2D3A47]/70 mt-0.5">
            Click card or press <kbd className="px-1.5 py-0.5 rounded bg-[#FFF7E6] border border-[#F3E8DE] text-xs text-[#2D3A47] font-medium font-sans">Space</kbd> to flip.
          </p>
        </div>

        <button
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-[#2D3A47] bg-white hover:bg-[#FFF7E6] border border-[#A9B7C6]/60 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
          title="Shuffle Cards"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#B46A72]" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#F3E8DE] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#B46A72] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 3D Flashcard Container */}
      <div className="perspective-1000 w-full max-w-2xl mx-auto py-2">
        <div
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label={`Flashcard ${currentIndex + 1}: ${isFlipped ? 'Answer' : 'Question'}`}
          className={`preserve-3d relative w-full h-80 sm:h-96 rounded-2xl cursor-pointer transition-transform duration-500 select-none shadow-md ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face: Surface #FFFFFF with soft Blush Petal border (#F7C8D3) */}
          <div className="backface-hidden absolute inset-0 w-full h-full rounded-2xl bg-white border-2 border-[#F7C8D3] p-8 sm:p-10 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between font-sans text-xs uppercase tracking-wider text-[#2D3A47]">
              {/* Tag / Pill: Soft pastel background using Blush Petal with dark readable text */}
              <span className="flex items-center gap-1.5 bg-[#F7C8D3]/50 text-[#2D3A47] px-3 py-1 rounded-full border border-[#F7C8D3] font-medium font-sans">
                <HelpCircle className="w-3.5 h-3.5 text-[#B46A72]" />
                Question / Term
              </span>
              <span className="text-[#2D3A47]/60 font-normal font-sans">
                Card {currentIndex + 1} of {cards.length}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center my-4 overflow-y-auto px-2">
              <p className="font-sans font-medium text-xl sm:text-2xl text-[#2D3A47] leading-snug">
                {currentCard?.front}
              </p>
            </div>

            <div className="flex items-center justify-center font-sans text-xs font-normal text-[#2D3A47]/60 gap-1.5 pt-2 border-t border-[#F3E8DE]">
              <RotateCw className="w-3.5 h-3.5 text-[#B46A72]" />
              <span>Click to flip answer</span>
            </div>
          </div>

          {/* Back Face: Rich Rosewood (#B46A72 to #9C555D) with crisp white text */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#B46A72] to-[#9C555D] text-white border-2 border-[#D58C95]/40 p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between font-sans text-xs uppercase tracking-wider text-white">
              {/* Accent badge: Sage Leaf background (#A8B58A) with dark readable text */}
              <span className="flex items-center gap-1.5 bg-[#A8B58A] text-[#2D3A47] px-3 py-1 rounded-full border border-[#C7D2B6] font-medium font-sans shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D3A47]" />
                Explanation / Answer
              </span>
              <span className="text-[#FFF7E6]/90 font-normal font-sans">
                Card {currentIndex + 1} of {cards.length}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center my-4 overflow-y-auto px-2">
              <p className="font-sans font-normal text-base sm:text-lg text-white leading-relaxed">
                {currentCard?.back}
              </p>
            </div>

            <div className="flex items-center justify-center font-sans text-xs font-normal text-white/85 gap-1.5 pt-2 border-t border-white/20">
              <RotateCw className="w-3.5 h-3.5 text-[#FFF7E6]" />
              <span>Click to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#A9B7C6]/60 bg-white hover:bg-[#FFF7E6] text-[#2D3A47] font-sans font-medium text-sm shadow-2xs transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 text-[#B46A72]" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleFlip}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F7C8D3]/40 hover:bg-[#F7C8D3]/70 text-[#2D3A47] font-sans font-medium text-sm transition-all border border-[#F7C8D3]"
        >
          <RotateCw className="w-4 h-4 text-[#B46A72]" />
          <span>Flip Card</span>
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#A9B7C6]/60 bg-white hover:bg-[#FFF7E6] text-[#2D3A47] font-sans font-medium text-sm shadow-2xs transition-all active:scale-95"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 text-[#B46A72]" />
        </button>
      </div>
    </div>
  );
}
