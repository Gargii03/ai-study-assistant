import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export default function Header({ isServerConnected }) {
  return (
    <header className="border-b border-[#F3E8DE] bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B46A72] flex items-center justify-center text-white shadow-md shadow-[#B46A72]/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-medium text-xl sm:text-2xl text-[#2D3A47] tracking-tight">
                AI Study Assistant
              </h1>
              <span className="inline-flex items-center gap-1 font-sans text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#A8B58A]/30 text-[#2D3A47] border border-[#A8B58A]/60">
                <Sparkles className="w-3 h-3 text-[#56613F]" />
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="font-sans font-normal text-xs text-[#2D3A47]/70 hidden sm:block">
              Transform lecture notes & PDFs into high-yield summaries, 3D flashcards & quizzes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-sans font-medium text-xs text-[#2D3A47] bg-[#FFF7E6] border border-[#F3E8DE] px-3 py-1.5 rounded-full shadow-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isServerConnected === true
                  ? 'bg-[#A8B58A] ring-2 ring-[#A8B58A]/30 animate-pulse'
                  : isServerConnected === false
                  ? 'bg-[#B46A72]'
                  : 'bg-[#A9B7C6] animate-pulse'
              }`}
            />
            <span className="hidden sm:inline">
              {isServerConnected === true
                ? 'Server Ready'
                : isServerConnected === false
                ? 'Server Offline'
                : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
