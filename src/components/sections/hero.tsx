"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const scrollToAudit = () => {
    document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Grid Pattern */}
      <div className="hero-grid absolute inset-0" />

      {/* Green Glow */}
      <div className="glow-green top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-green-mid bg-green-dim px-4 py-1.5 text-xs font-medium text-green mb-8"
        >
          <Sparkles size={14} />
          Free AI-Powered Audit — No Account Required
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
        >
          Your Google Business Profile
          <br />
          <span className="text-green">scored in seconds.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-text2 max-w-2xl mx-auto leading-relaxed"
        >
          Get an AI-powered score from 0–100, with prioritized recommendations
          to boost your local visibility. Free, instant, no signup.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToAudit}
            className="group inline-flex items-center gap-2 rounded-xl bg-green px-7 py-3.5 text-base font-semibold text-bg hover:bg-green/90 transition-all hover:shadow-[0_0_30px_rgba(0,229,160,0.2)]"
          >
            Start Free Audit
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-border-accent px-7 py-3.5 text-base font-medium text-text2 hover:text-text hover:border-border-bold transition-colors"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-12 text-sm text-muted"
        >
          <div>
            <span className="block text-2xl font-bold text-text">100%</span>
            Free
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="block text-2xl font-bold text-text">30s</span>
            Audit Time
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="block text-2xl font-bold text-text">AI</span>
            Powered
          </div>
        </motion.div>
      </div>
    </section>
  );
}
