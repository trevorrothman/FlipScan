"use client";
import { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";

const plans = [
  {
    id: "single", name: "Single Report", price: "$9",
    description: "Perfect for one-off due diligence.",
    features: ["Full Financial Breakdown", "Red Flag Detection", "Fair Valuation", "Buy/Pass/Negotiate Verdict"],
    buttonText: "Buy Single Report",
  },
  {
    id: "unlimited", name: "Unlimited Pro", price: "$29", period: "/mo",
    description: "For active acquirers.",
    features: ["Unlimited Analyses", "Priority Access", "Advanced Risk Analysis", "Priority Support"],
    buttonText: "Go Unlimited", featured: true,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipRes.json();
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, ip }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-zinc-900">Simple, Transparent Pricing</h2>
          <p className="text-zinc-600 text-lg">One free analysis. No credit card required to start.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative p-8 rounded-3xl border-2 ${plan.featured ? 'border-blue-600 bg-white shadow-2xl' : 'border-zinc-100 bg-white shadow-xl'}`}>
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Most Popular</div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-zinc-900">{plan.price}</span>
                    {plan.period && <span className="text-zinc-500">{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-zinc-600 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-600">
                      <Check className="w-4 h-4 text-blue-600" />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(plan.id)} disabled={!!loading}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${plan.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-zinc-900 text-white hover:bg-zinc-800'} disabled:opacity-50`}>
                  {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{plan.buttonText}<ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
