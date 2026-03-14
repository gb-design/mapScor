"use client";

import { Shield, Zap, DollarSign, Lock } from "lucide-react";

const reasons = [
  {
    icon: DollarSign,
    title: "100% Free",
    description: "No hidden costs, no account required. Get your audit instantly.",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Choose from multiple AI models — Llama, Gemini, GPT-4, Claude.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is never stored. BYOK means your keys stay yours.",
  },
  {
    icon: Lock,
    title: "No Lock-In",
    description: "Export your results, use any AI model. No vendor lock-in, ever.",
  },
];

const comparison = [
  {
    feature: "Free Audit",
    mapscor: true,
    others: "Limited or paid",
  },
  {
    feature: "AI-Powered Insights",
    mapscor: true,
    others: "Manual checklists",
  },
  {
    feature: "Choose Your AI Model",
    mapscor: true,
    others: "No choice",
  },
  {
    feature: "No Account Required",
    mapscor: true,
    others: "Signup required",
  },
  {
    feature: "BYOK (Bring Your Own Key)",
    mapscor: true,
    others: "Not available",
  },
  {
    feature: "Prioritized Recommendations",
    mapscor: true,
    others: "Generic tips",
  },
];

export function WhyMapScor() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">
            Why mapScor
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Built different
          </h2>
          <p className="mt-4 text-text2 max-w-xl mx-auto rv rv2">
            Most GBP tools are expensive, generic, and lock you in. mapScor
            gives you real insights, for free.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={`rv rv${i + 1} rounded-2xl border border-border bg-card p-6 text-center`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-dim border border-green-mid mb-4">
                <r.icon size={22} className="text-green" />
              </div>
              <h3 className="text-base font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-text2">{r.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="rv mx-auto max-w-2xl rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-3 gap-0 border-b border-border px-6 py-4 text-sm font-semibold">
            <span className="text-text2">Feature</span>
            <span className="text-green text-center">mapScor</span>
            <span className="text-muted text-center">Other Tools</span>
          </div>
          {comparison.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 gap-0 px-6 py-3.5 text-sm ${
                i < comparison.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-text2">{row.feature}</span>
              <span className="text-green text-center font-medium">✓</span>
              <span className="text-muted text-center">{row.others}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
