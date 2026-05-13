import AnalysisForm from "@/components/AnalysisForm";
import Pricing from "@/components/Pricing";
import { Zap, BarChart3, ShieldAlert, BadgeCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              Flip<span className="text-blue-600">Scan</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>
        </div>
      </header>
      <main className="flex-1 px-6 pb-24">
        <div className="max-w-4xl mx-auto pt-16 md:pt-24 text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-tight">
            Stop Guessing.<br />
            <span className="text-blue-600">Analyze Listings</span> Like a Pro.
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Paste any business listing from Empire Flippers, Flippa, BizBuySell, or anywhere.
            Get an instant Claude-powered acquisition analysis.
          </p>
          <div className="pt-8"><AnalysisForm /></div>
        </div>
        <div className="max-w-6xl mx-auto pt-32 grid md:grid-cols-3 gap-12" id="how-it-works">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Financial Breakdown</h3>
            <p className="text-zinc-600 leading-relaxed">Instantly extract revenue, SDE, and margins. We calculate the payback period and fair valuation.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Red Flags & Risks</h3>
            <p className="text-zinc-600 leading-relaxed">Identify hidden risks from traffic concentration to questionable financial reporting.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Expert Recommendation</h3>
            <p className="text-zinc-600 leading-relaxed">Get a final Buy, Pass, or Negotiate verdict with specific talking points.</p>
          </div>
        </div>
        <Pricing />
      </main>
      <footer className="border-t border-zinc-200 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-zinc-900">FlipScan</span>
          <div className="text-zinc-500 text-sm">© {new Date().getFullYear()} FlipScan. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
