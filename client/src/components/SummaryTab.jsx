import React, { useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';

export default function SummaryTab({ summary = [] }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyOne = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = summary.map((point, i) => `${i + 1}. ${point}`).join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!summary || summary.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#F7C8D3]/70 p-8 font-sans">
        <p className="text-[#2D3A47]/70 text-sm font-normal">No summary available. Generate study notes first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F3E8DE]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#2D3A47] flex items-center gap-2 tracking-tight">
            <Sparkles className="w-5 h-5 text-[#B46A72]" />
            Core Takeaways & Executive Summary
          </h3>
          <p className="font-sans font-normal text-sm text-[#2D3A47]/70 mt-0.5">
            {summary.length} high-impact key concepts distilled from your study material.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-[#2D3A47] bg-[#FFF7E6] hover:bg-[#FDEFD2] px-3 py-2 rounded-lg transition-colors border border-[#F3E8DE] shadow-xs w-fit"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#56613F]" />
              <span className="text-[#56613F] font-medium">Copied all points!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#A9B7C6]" />
              <span>Copy All Takeaways</span>
            </>
          )}
        </button>
      </div>

      {/* Takeaway Items */}
      <div className="grid gap-3.5">
        {summary.map((point, idx) => {
          const isCopied = copiedIndex === idx;
          return (
            <div
              key={idx}
              className="group flex items-start gap-4 p-4.5 rounded-xl bg-white border border-[#F3E8DE] hover:border-[#F7C8D3] hover:shadow-xs transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-[#A8B58A]/30 text-[#2D3A47] font-sans font-medium text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#A8B58A]/60 shadow-2xs">
                {idx + 1}
              </div>

              <div className="flex-1 font-sans font-normal text-slate-800 text-sm sm:text-[15px] leading-relaxed">
                {point}
              </div>

              <button
                onClick={() => handleCopyOne(point, idx)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-[#A9B7C6] hover:text-[#B46A72] p-1.5 rounded-lg hover:bg-[#FFF7E6] transition-all shrink-0"
                title="Copy takeaway"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-[#56613F]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
