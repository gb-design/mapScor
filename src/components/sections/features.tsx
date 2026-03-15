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
  MapPin,
  CalendarDays,
  Users,
  LineChart,
  Lock,
} from "lucide-react";

const freeFeatures = [
  {
    icon: BarChart3,
    title: "Profile Completeness",
    description:
      "Check if your name, address, phone, website, and categories are fully set up.",
  },
  {
    icon: Camera,
    title: "Photo Analysis",
    description:
      "Evaluate photo count, quality indicators, logo and cover photo presence.",
  },
  {
    icon: Star,
    title: "Review Health",
    description:
      "Analyze review count, average rating, response rate and recency.",
  },
  {
    icon: MessageSquare,
    title: "Post Activity",
    description:
      "Track posting frequency and recency to keep your profile active.",
  },
  {
    icon: Search,
    title: "Keyword Optimization",
    description:
      "Check description quality, keyword usage and local relevance.",
  },
  {
    icon: Clock,
    title: "Hours & Availability",
    description:
      "Verify business hours completeness, special hours and holiday settings.",
  },
  {
    icon: HelpCircle,
    title: "Q&A Section",
    description:
      "Assess if Q&A is utilized and questions are properly answered.",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description:
      "Get prioritized, actionable suggestions powered by the AI model of your choice — free, no API key required.",
    featured: true,
  },
];

const proFeatures = [
  {
    icon: MapPin,
    title: "Rank Tracking",
    description:
      "Monitor your local rankings across a geographic grid over time.",
  },
  {
    icon: Star,
    title: "Review Manager",
    description:
      "Respond to every review with AI-generated replies and track sentiment trends.",
  },
  {
    icon: CalendarDays,
    title: "Post Scheduler",
    description:
      "Plan and publish GBP posts weeks in advance with a visual content calendar.",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description:
      "See how you stack up against the top local competitors in your category.",
  },
  {
    icon: LineChart,
    title: "Weekly Score Reports",
    description:
      "Automated email digests tracking your score progress and new quick-wins.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Everything you need to optimize
          </h2>
          <p className="mt-4 text-text2 max-w-xl mx-auto rv rv2">
            A full audit covering all key categories Google uses to rank local
            businesses — free to start, powerful with Pro.
          </p>
        </div>

        {/* FREE ZONE */}
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-green">
              Free tier
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">No account needed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeFeatures.map((f, i) => (
              <div
                key={f.title}
                className={`rv rv${(i % 3) + 1} group relative rounded-2xl border border-border bg-card p-6 hover:border-border-accent transition-all duration-200 overflow-hidden${
                  f.featured ? " sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {/* Featured shimmer */}
                {f.featured && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,229,160,0.04)_0%,transparent_60%)] pointer-events-none" />
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-dim border border-green-mid">
                    <f.icon size={18} className="text-green" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-dim text-green border border-green-mid">
                    Free
                  </span>
                </div>

                <h3
                  className={`font-semibold mb-1.5 ${f.featured ? "text-base" : "text-sm"}`}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-text2 leading-relaxed">
                  {f.description}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* PRO ZONE SEPARATOR */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/25 bg-amber-dim">
            <Lock size={11} className="text-amber" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber">
              Unlock with Pro · €19/mo
            </span>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* PRO ZONE */}
        <div className="relative">
          {/* Ambient amber glow */}
          <div
            className="absolute inset-x-0 top-0 h-64 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber">
              Pro features
            </span>
            <div className="flex-1 h-px bg-amber/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {proFeatures.map((f, i) => (
              <div
                key={f.title}
                className={`rv rv${(i % 3) + 1} group relative rounded-2xl border border-amber/10 bg-card p-6 hover:border-amber/25 transition-all duration-200 overflow-hidden`}
                style={{ background: "rgba(20,16,8,0.6)" }}
              >
                {/* Amber hover glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,166,35,0.05)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-dim border border-amber/15">
                    <f.icon size={18} className="text-amber" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-dim text-amber border border-amber/20">
                    Pro
                  </span>
                </div>

                <h3 className="text-sm font-semibold mb-1.5 text-text">
                  {f.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {f.description}
                </p>

                {/* Amber hover accent line */}
                <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
