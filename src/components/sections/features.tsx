"use client";

import {
  BarChart3,
  Brain,
  Camera,
  MessageSquare,
  Star,
  Clock,
  HelpCircle,
  Search,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Profile Completeness",
    description: "Check if your name, address, phone, website, and categories are fully set up.",
    free: true,
  },
  {
    icon: Camera,
    title: "Photo Analysis",
    description: "Evaluate photo count, quality indicators, logo and cover photo presence.",
    free: true,
  },
  {
    icon: Star,
    title: "Review Health",
    description: "Analyze review count, average rating, response rate and recency.",
    free: true,
  },
  {
    icon: MessageSquare,
    title: "Post Activity",
    description: "Track posting frequency and recency to keep your profile active.",
    free: true,
  },
  {
    icon: Search,
    title: "Keyword Optimization",
    description: "Check description quality, keyword usage and local relevance.",
    free: true,
  },
  {
    icon: Clock,
    title: "Hours & Availability",
    description: "Verify business hours completeness, special hours and holiday settings.",
    free: true,
  },
  {
    icon: HelpCircle,
    title: "Q&A Section",
    description: "Assess if Q&A is utilized and questions are properly answered.",
    free: true,
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Get prioritized, actionable suggestions powered by AI models of your choice.",
    free: true,
  },
  {
    icon: Zap,
    title: "Rank Tracking",
    description: "Monitor your local rankings across a geographic grid over time.",
    free: false,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Everything you need to optimize
          </h2>
          <p className="mt-4 text-text2 max-w-xl mx-auto rv rv2">
            Comprehensive audit covering all 7 key categories that Google uses
            to rank local businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`rv rv${(i % 3) + 1} group relative rounded-2xl border border-border bg-card p-6 hover:border-border-accent transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-dim border border-green-mid">
                  <f.icon size={20} className="text-green" />
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    f.free
                      ? "bg-green-dim text-green border border-green-mid"
                      : "bg-amber-dim text-amber border border-amber/20"
                  }`}
                >
                  {f.free ? "Free" : "Pro"}
                </span>
              </div>

              <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-text2 leading-relaxed">
                {f.description}
              </p>

              {/* Bottom border hover */}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
