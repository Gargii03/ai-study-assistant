import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import SummaryTab from './components/SummaryTab';
import FlashcardTab from './components/FlashcardTab';
import QuizTab from './components/QuizTab';
import {
  FileText,
  Layers,
  HelpCircle,
  KeyRound,
} from 'lucide-react';

export default function App() {
  const [studyData, setStudyData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerConnected, setIsServerConnected] = useState(null);
  const [geminiKeyMissing, setGeminiKeyMissing] = useState(false);

  // Check server health and API key presence
  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setIsServerConnected(true);
        setGeminiKeyMissing(!data.geminiKeyConfigured);
      } else {
        setIsServerConnected(false);
      }
    } catch (err) {
      setIsServerConnected(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async ({ text, file }) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (text) {
        formData.append('text', text);
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate study materials.');
      }

      setStudyData(result.data);
      setActiveTab('summary');
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2D3A47] flex flex-col font-sans antialiased">
      <Header isServerConnected={isServerConnected} />

      {/* Warning banner if GEMINI_API_KEY is not set */}
      {geminiKeyMissing && (
        <div className="bg-[#F7C8D3]/40 border-b border-[#F7C8D3] text-[#2D3A47] px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-sans">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#B46A72] shrink-0" />
              <span>
                <strong className="font-medium">Gemini API Key Needed:</strong> Please set your <code className="bg-white/80 text-[#B46A72] px-1.5 py-0.5 rounded font-mono border border-[#F7C8D3]">GEMINI_API_KEY</code> in the root <code className="bg-white/80 text-[#B46A72] px-1.5 py-0.5 rounded font-mono border border-[#F7C8D3]">.env</code> file.
              </span>
            </div>
            <button
              onClick={checkHealth}
              className="text-xs font-medium text-[#B46A72] hover:text-[#9F565E] underline shrink-0"
            >
              Recheck Key
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Input Section */}
        <InputSection
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
        />

        {/* Results Section */}
        {studyData && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#F7C8D3]/80 p-5 sm:p-8 space-y-6 animate-fadeIn">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-[#F3E8DE] pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'summary'
                    ? 'bg-[#B46A72] text-white shadow-md shadow-[#B46A72]/20'
                    : 'text-[#2D3A47] hover:text-[#2D3A47] hover:bg-[#FFF7E6]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Summary</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    activeTab === 'summary'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#A8B58A]/30 text-[#2D3A47] border border-[#A8B58A]/50'
                  }`}
                >
                  {studyData.summary?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'flashcards'
                    ? 'bg-[#B46A72] text-white shadow-md shadow-[#B46A72]/20'
                    : 'text-[#2D3A47] hover:text-[#2D3A47] hover:bg-[#FFF7E6]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>3D Flashcards</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    activeTab === 'flashcards'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#A8B58A]/30 text-[#2D3A47] border border-[#A8B58A]/50'
                  }`}
                >
                  {studyData.flashcards?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'quiz'
                    ? 'bg-[#B46A72] text-white shadow-md shadow-[#B46A72]/20'
                    : 'text-[#2D3A47] hover:text-[#2D3A47] hover:bg-[#FFF7E6]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quiz</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    activeTab === 'quiz'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#A8B58A]/30 text-[#2D3A47] border border-[#A8B58A]/50'
                  }`}
                >
                  {studyData.quiz?.length || 0}
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'summary' && <SummaryTab summary={studyData.summary} />}
              {activeTab === 'flashcards' && (
                <FlashcardTab flashcards={studyData.flashcards} />
              )}
              {activeTab === 'quiz' && <QuizTab quiz={studyData.quiz} />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F3E8DE] bg-white/70 py-6 text-center font-sans font-normal text-xs text-[#2D3A47]/60">
        <p>AI Study Assistant MVP • Powered by Google Gemini Structured Outputs</p>
      </footer>
    </div>
  );
}
