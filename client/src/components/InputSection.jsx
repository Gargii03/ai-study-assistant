import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Sparkles, Loader2, BookOpen, AlertCircle } from 'lucide-react';

const SAMPLE_NOTES = `Cellular Respiration and Photosynthesis

Photosynthesis is the biochemical process in which green plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose.
General Equation: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2

Two main stages of Photosynthesis:
1. Light-Dependent Reactions: Located in chloroplast thylakoid membranes. Chlorophyll pigments absorb sunlight, exciting electrons. Water is split (photolysis) producing oxygen gas as a byproduct, alongside ATP and NADPH energy carriers.
2. Calvin Cycle (Light-Independent Reactions): Takes place in the stroma. Carbon fixation catalyzed by the enzyme RuBisCO utilizes ATP and NADPH to convert CO2 into 3-carbon sugars (G3P) to synthesize glucose.

Cellular Respiration is the metabolic pathway that breaks down glucose to yield ATP energy for cellular work.
General Equation: C6H12O6 + 6O2 -> 6CO2 + 6H2O + 36-38 ATP

Three main stages of Cellular Respiration:
1. Glycolysis: Occurs in the cytoplasm. Anaerobic (requires no O2). Breaks 1 glucose molecule into 2 pyruvate molecules, yielding a net 2 ATP and 2 NADH.
2. Krebs Cycle (Citric Acid Cycle): Occurs in the mitochondrial matrix. Converts pyruvate into acetyl-CoA, producing 6 NADH, 2 FADH2, and 2 ATP per glucose molecule.
3. Oxidative Phosphorylation & Electron Transport Chain (ETC): Occurs across the inner mitochondrial membrane (cristae). High-energy electrons flow through complexes I-IV, pumping protons into the intermembrane space. ATP synthase utilizes this proton gradient (chemiosmosis) to generate ~32-34 ATP. Oxygen acts as the terminal electron acceptor, forming water.`;

export default function InputSection({ onGenerate, isLoading, error }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const validExtensions = ['.pdf', '.txt', '.md'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      alert('Please upload a PDF (.pdf), plain text (.txt), or markdown (.md) file.');
      return;
    }
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setText(SAMPLE_NOTES);
  };

  const handleClearAll = () => {
    setText('');
    handleRemoveFile();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      return;
    }
    onGenerate({ text, file });
  };

  const hasInput = text.trim().length > 0 || file !== null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F7C8D3]/80 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-2xl font-serif font-medium text-[#2D3A47] tracking-tight flex items-center gap-2">
            <span>Input Study Material</span>
          </h2>
          <p className="font-sans font-normal text-sm text-[#2D3A47]/70 mt-0.5">
            Paste notes, lecture transcripts, or upload your PDF / text documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-[#2D3A47] bg-[#A8B58A]/30 hover:bg-[#A8B58A]/45 px-3 py-1.5 rounded-lg transition-colors border border-[#A8B58A]/60 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#56613F]" />
            Load Sample Material
          </button>
          {hasInput && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isLoading}
              className="font-sans text-xs font-normal text-[#2D3A47]/60 hover:text-[#2D3A47] px-2 py-1.5 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Large Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="Paste your study notes, textbook excerpts, lecture transcripts, or key concepts here..."
            rows={7}
            className="w-full rounded-xl border border-[#A9B7C6]/60 p-4 font-sans font-normal text-sm text-[#2D3A47] placeholder:text-[#2D3A47]/40 bg-[#FFF7E6]/30 focus:border-[#B46A72] focus:bg-white focus:ring-4 focus:ring-[#B46A72]/15 transition-all outline-none resize-y leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 font-sans font-normal text-[11px] text-[#2D3A47]/70 bg-white/95 px-2 py-0.5 rounded shadow-2xs border border-[#F3E8DE]">
            {text.length} characters
          </div>
        </div>

        {/* Drag and drop / File upload section */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
            isDragging
              ? 'border-[#B46A72] bg-[#F7C8D3]/30'
              : 'border-[#A9B7C6]/60 hover:border-[#B46A72] bg-[#FFF7E6]/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />

          {!file ? (
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F7C8D3]/40 flex items-center justify-center text-[#B46A72] group-hover:bg-[#F7C8D3]/70 group-hover:scale-105 transition-all mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="font-sans text-sm font-medium text-[#2D3A47]">
                <span className="text-[#B46A72] font-medium group-hover:underline">Click to upload</span> or drag
                and drop
              </p>
              <p className="font-sans font-normal text-xs text-[#2D3A47]/60 mt-0.5">
                Supported formats: PDF (.pdf), Text (.txt, .md) up to 15MB
              </p>
            </label>
          ) : (
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-[#F7C8D3] shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A8B58A]/30 text-[#2D3A47] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#56613F]" />
                </div>
                <div className="text-left font-sans">
                  <p className="text-sm font-medium text-[#2D3A47] truncate max-w-[240px] sm:max-w-md">
                    {file.name}
                  </p>
                  <p className="text-xs font-normal text-[#2D3A47]/60">
                    {(file.size / 1024).toFixed(1)} KB • Ready for processing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isLoading}
                className="text-[#2D3A47]/50 hover:text-[#B46A72] p-1 rounded-md hover:bg-[#F7C8D3]/30 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Error message alert */}
        {error && (
          <div className="p-4 rounded-xl bg-[#F7C8D3]/35 border border-[#F7C8D3] text-[#2D3A47] text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B46A72] shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <p className="font-medium text-[#2D3A47]">Processing Failed</p>
              <p className="font-normal text-[#2D3A47]/80 text-xs sm:text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Primary Submit Button: Rosewood (#B46A72) with refined font-medium */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!hasInput || isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-sans font-medium text-white bg-[#B46A72] hover:bg-[#9F565E] active:bg-[#86434B] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#B46A72]/20 transition-all text-sm group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating Study Assistant Package...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FFF7E6] group-hover:rotate-12 transition-transform" />
                <span>Generate Study Package (Summary, Cards & Quiz)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
