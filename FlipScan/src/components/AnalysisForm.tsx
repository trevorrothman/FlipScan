"use client";
import { useState, useRef } from "react";
import { Loader2, ArrowRight, FileText, AlertTriangle, Crown, TrendingUp, ShieldAlert, DollarSign, CheckCircle, XCircle, MinusCircle } from "lucide-react";
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

  const getVerdict = (text: string) => {
    if (text.includes("VERDICT: BUY") || text.includes("**BUY**")) return "BUY";
    if (text.includes("VERDICT: PASS") || text.includes("**PASS**")) return "PASS";
    if (text.includes("VERDICT: NEGOTIATE") || text.includes("**NEGOTIATE**")) return "NEGOTIATE";
    return null;
  };

  const verdict = result ? getVerdict(result) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={listing}
            onChange={(e) => setListing(e.target.value)}
            placeholder="Paste any business listing from Empire Flippers, Flippa, BizBuySell, or anywhere..."
            className="w-full min-h-[250px] p-6 text-lg border-2 border-zinc-200 rounded-2xl focus:border-blue-500 outline-none resize-none bg-white shadow-sm"
          />
          <div className="absolute bottom-4 right-4">
            <button type="submit" disabled={isAnalyzing || !listing.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Analyzing...</>
              ) : (
                <>Analyze Now<ArrowRight className="w-5 h-5" /></>
              )}
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
        <div ref={resultRef} className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="bg-zinc-900 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-blue-500 p-2 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Acquisition Report</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Powered by Claude AI</p>
              </div>
            </div>
            {verdict && (
              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm ${
                verdict === "BUY" ? "bg-green-500 text-white" :
                verdict === "PASS" ? "bg-red-500 text-white" :
                "bg-blue-500 text-white"
              }`}>
                {verdict === "BUY" && <CheckCircle className="w-4 h-4" />}
                {verdict === "PASS" && <XCircle className="w-4 h-4" />}
                {verdict === "NEGOTIATE" && <MinusCircle className="w-4 h-4" />}
                VERDICT: {verdict}
              </div>
            )}
          </div>

          {/* Report Body */}
          <div className="p-8 md:p-10">
            <div className="prose prose-zinc max-w-none
              prose-h1:text-2xl prose-h1:font-bold prose-h1:text-zinc-900 prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b prose-h1:border-zinc-200
              prose-h3:text-base prose-h3:font-semibold prose-h3:text-zinc-800 prose-h3:mt-5 prose-h3:mb-2
              prose-h4:text-sm prose-h4:font-semibold prose-h4:text-zinc-700 prose-h4:mt-4 prose-h4:mb-1
              prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:mb-3
              prose-strong:text-zinc-900 prose-strong:font-semibold
              prose-hr:border-zinc-100 prose-hr:my-6
            ">
              <ReactMarkdown
                components={{
                  strong: ({children}) => {
                    const text = String(children);
                    if (text === "BUY" || text === "VERDICT: BUY")
                      return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-sm font-bold">✓ BUY</span>;
                    if (text === "PASS" || text === "VERDICT: PASS")
                      return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-sm font-bold">✗ PASS</span>;
                    if (text === "NEGOTIATE" || text === "VERDICT: NEGOTIATE")
                      return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-sm font-bold">~ NEGOTIATE</span>;
                    return <strong className="font-semibold text-zinc-900">{children}</strong>;
                  },
                  h2: ({children}) => {
                    const text = String(children).toLowerCase();
                    let icon = <TrendingUp className="w-4 h-4" />;
                    let color = "text-blue-700 bg-blue-50 border-blue-200";
                    if (text.includes("risk") || text.includes("red flag") || text.includes("concern")) {
                      icon = <ShieldAlert className="w-4 h-4" />;
                      color = "text-red-700 bg-red-50 border-red-200";
                    } else if (text.includes("financial") || text.includes("valuation") || text.includes("payback")) {
                      icon = <DollarSign className="w-4 h-4" />;
                      color = "text-green-700 bg-green-50 border-green-200";
                    } else if (text.includes("recommendation") || text.includes("verdict") || text.includes("final")) {
                      icon = <CheckCircle className="w-4 h-4" />;
                      color = "text-purple-700 bg-purple-50 border-purple-200";
                    }
                    const textColor = color.split(' ')[0];
                    return (
                      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border mt-8 mb-4 ${color}`}>
                        <span className={textColor}>{icon}</span>
                        <span className={`text-sm font-bold ${textColor}`}>{children}</span>
                      </div>
                    );
                  },
                  ul: ({children}) => <ul className="space-y-2 mb-4 list-none ml-0 pl-0">{children}</ul>,
                  ol: ({children}) => <ol className="space-y-2 mb-4 list-decimal ml-4">{children}</ol>,
                  li: ({children}) => (
                    <li className="flex items-start gap-2.5 text-zinc-600 text-sm leading-relaxed">
                      <span className="text-blue-400 mt-1 shrink-0">▸</span>
                      <span>{children}</span>
                    </li>
                  ),
                  hr: () => <hr className="border-zinc-100 my-6" />,
                  p: ({children}) => <p className="text-zinc-600 leading-relaxed mb-3 text-sm">{children}</p>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-blue-300 pl-4 py-1 bg-blue-50 rounded-r-xl text-zinc-600 italic my-4 text-sm">
                      {children}
                    </blockquote>
                  ),
                  table: () => null,
                  thead: () => null,
                  tbody: () => null,
                  tr: () => null,
                  th: () => null,
                  td: () => null,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <p className="text-zinc-400 text-xs">Generated by Claude AI · Always perform your own due diligence before acquiring any business</p>
            <button onClick={() => window.print()} className="text-xs text-zinc-500 hover:text-zinc-800 font-medium transition-colors">
              Print →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
