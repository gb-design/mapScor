"use client";

import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for a quick audit of your profile.",
    features: [
      "Full 7-category audit",
      "Score from 0–100",
      "3 AI recommendations",
      "Choose your AI model",
      "No account required",
    ],
    cta: "Start Free Audit",
    ctaHref: "#audit",
    popular: false,
  },
  {
    name: "Pro",
    price: "€19",
    period: "/month",
    description: "For businesses serious about local visibility.",
    features: [
      "Everything in Free",
      "Unlimited audits",
      "Full AI recommendations (no paywall)",
      "Rank Tracker (Geo-Grid)",
      "Review Manager",
      "Post Scheduler",
      "Competitor Analysis",
      "Weekly Email Reports",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    popular: true,
  },
  {
    name: "Agency",
    price: "€49",
    period: "/month",
    description: "Manage multiple business profiles at scale.",
    features: [
      "Everything in Pro",
      "Up to 10 profiles",
      "White-label reports",
      "Team collaboration",
      "API access",
      "Priority support",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Start free, upgrade when ready
          </h2>
          <p className="mt-4 text-text2 max-w-xl mx-auto rv rv2">
            The free audit gives you everything you need to get started. Pro
            adds tracking and management tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rv rv${i + 1} relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-green/30 bg-card shadow-[0_0_40px_rgba(0,229,160,0.06)]"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green px-3 py-1 text-xs font-semibold text-bg">
                    <Sparkles size={12} />
                    Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>
              <p className="text-sm text-text2 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={16}
                      className="text-green mt-0.5 shrink-0"
                    />
                    <span className="text-text2">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`block text-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.name === "Free"
                    ? "bg-green text-bg hover:bg-green/90"
                    : "border border-border-accent text-text2 hover:text-text hover:border-border-bold"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
