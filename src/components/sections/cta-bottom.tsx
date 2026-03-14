"use client";

import { ArrowRight } from "lucide-react";

export function CTABottom() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Green Glow */}
      <div className="glow-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold rv">
          Ready to improve your
          <br />
          <span className="text-green">Google Business Profile?</span>
        </h2>
        <p className="mt-4 text-text2 max-w-lg mx-auto rv rv1">
          Get your free score in under 2 minutes. No signup, no credit card —
          just actionable insights.
        </p>
        <div className="mt-8 rv rv2">
          <a
            href="#audit"
            className="group inline-flex items-center gap-2 rounded-xl bg-green px-8 py-4 text-base font-semibold text-bg hover:bg-green/90 transition-all hover:shadow-[0_0_40px_rgba(0,229,160,0.2)]"
          >
            Start Free Audit Now
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
