"use client";

import { ClipboardList, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Answer 10 Quick Questions",
    description:
      "Tell us about your Google Business Profile — photos, reviews, posts, and more. Takes less than 2 minutes.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes Your Profile",
    description:
      "Our AI evaluates 7 key categories and calculates a weighted score from 0–100.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get Prioritized Actions",
    description:
      "Receive high, medium, and low impact recommendations — sorted by what moves the needle most.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Three steps to a better profile
          </h2>
          <p className="mt-4 text-text2 max-w-xl mx-auto rv rv2">
            No account needed. No credit card. Just honest insights about your
            Google Business Profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`rv rv${i + 1} group relative rounded-2xl border border-border bg-card p-8 hover:border-border-accent transition-all`}
            >
              {/* Step Number */}
              <span className="absolute top-6 right-6 text-5xl font-bold text-hint/30">
                {s.step}
              </span>

              <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-dim border border-green-mid">
                <s.icon size={22} className="text-green" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-text2 leading-relaxed">
                {s.description}
              </p>

              {/* Bottom border hover effect */}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
