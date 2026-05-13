"use client";
import { useState, useRef } from "react";
import { Loader2, ArrowRight, FileText, AlertTriangle, Crown } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AnalysisForm() {
  const [listing, setListing] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing }),
      });
      const data = await response.json();
      if (!response.ok) throw { message: data.error || "Failed to analyze", code: data.code };
      setResult(data.analysis);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: any) {
      setError({ message: err.message, code: err.code });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={listing}
            onChange={(e) => setListing(e.target.value)}
            placeholder="Paste any business listing from Empire Flippers, Flippa, BizBuySell, or anywhere..."
            className="w-full min-h-[250px] p-6 text-lg border-2 border-zinc-200 rounded-2xl focus:border-blue-500 outline-none resize-none bg-white"
          />
          <div className="absolute bottom-4 right-4">
            <button type="submit" disabled={isAnalyzing || !listing.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-4 rounded-xl font-bold transition-all">
              {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" />Analyzing...</> : <>Analyze Now<ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        </form>

        {error && (
          <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${error.code === 'LIMIT_REACHED' ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-red-50 border-red-100 text-red-700'}`}>
            <div className="flex items-start gap-3">
              {error.code === 'LIMIT_REACHED' ? <Crown className="w-6 h-6 text-blue-600" /> : <AlertTriangle className="w-6 h-6" />}
              <div>
                <p className="font-bold">{error.code === 'LIMIT_REACHED' ? 'Upgrade to FlipScan Pro' : 'Error'}</p>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
            {error.code === 'LIMIT_REACHED' && (
              <a href="#pricing" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 inline-flex items-center gap-2 w-fit">
                View Plans<ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {result && (
        <div ref={resultRef} className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-zinc-900 px-8 py-6 flex items-center gap-3 text-white">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-bold">Acquisition Report</h2>
          </div>
          <div className="p-8 md:p-12">
            <div className="prose prose-zinc max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">{children}</h3>,
                  h4: ({children}) => <h4 className="text-base font-semibold text-zinc-700 mt-4 mb-2">{children}</h4>,
                  p: ({children}) => <p className="text-zinc-600 leading-relaxed mb-3">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside space-y-1 text-zinc-600 mb-4">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside space-y-1 text-zinc-600 mb-4">{children}</ol>,
                  li: ({children}) => <li className="text-zinc-600">{children}</li>,
                  strong: ({children}) => {
                    const text = String(children);
                    if (text.includes("BUY")) return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{children}</span>;
                    if (text.includes("PASS")) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">{children}</span>;
                    if (text.includes("NEGOTIATE")) return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{children}</span>;
                    return <strong className="font-semibold text-zinc-900">{children}</strong>;
                  },
                  table: ({children}) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse border border-zinc-200 text-sm">{children}</table></div>,
                  thead: ({children}) => <thead className="bg-zinc-50">{children}</thead>,
                  th: ({children}) => <th className="border border-zinc-200 px-3 py-2 text-left font-semibold text-zinc-700">{children}</th>,
                  td: ({children}) => <td className="border border-zinc-200 px-3 py-2 text-zinc-600">{children}</td>,
                  hr: () => <hr className="border-zinc-200 my-6" />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-100 text-zinc-400 text-sm italic">
              Analysis generated by Claude AI. Always perform your own due diligence.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
