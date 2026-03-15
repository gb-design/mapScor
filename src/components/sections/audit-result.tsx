"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowRight as ArrowRightIcon,
  Minus,
  RotateCcw,
} from "lucide-react";
import type { CategoryScore } from "@/lib/scoring/calculate";

interface Recommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

interface AuditResultProps {
  score: {
    overall: number;
    categories: CategoryScore[];
    businessName: string;
    businessType: string;
  };
  recommendations: Recommendation[];
  onReset: () => void;
}

export function AuditResult({
  score,
  recommendations,
  onReset,
}: AuditResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animated) return;
    let frame = 0;
    const total = 50;
    const interval = setInterval(() => {
      frame++;
      setDisplayScore(Math.round((frame / total) * score.overall));
      if (frame >= total) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [animated, score.overall]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = animated
    ? circumference - (score.overall / 100) * circumference
    : circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green";
    if (s >= 50) return "text-amber";
    return "text-red";
  };

  const getBarColor = (s: number) => {
    if (s >= 80) return "bg-green";
    if (s >= 50) return "bg-amber";
    return "bg-red";
  };

  const getStrokeColor = (s: number) => {
    if (s >= 80) return "var(--green)";
    if (s >= 50) return "var(--amber)";
    return "var(--red)";
  };

  const priorityConfig = {
    high: {
      label: "High Impact",
      bg: "bg-red-dim",
      text: "text-red",
      border: "border-red/20",
      icon: ArrowUp,
    },
    medium: {
      label: "Medium Impact",
      bg: "bg-amber-dim",
      text: "text-amber",
      border: "border-amber/20",
      icon: ArrowRightIcon,
    },
    low: {
      label: "Low Impact",
      bg: "bg-green-dim",
      text: "text-green",
      border: "border-green-mid",
      icon: Minus,
    },
  };

  return (
    <section id="audit" className="py-24 sm:py-32 bg-surface/50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-green mb-3">Audit Complete</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Your Score</h2>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-8 sm:p-10 mb-6"
        >
          {/* Score Circle */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={getStrokeColor(score.overall)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(score.overall)}`}>
                  {displayScore}
                </span>
                <span className="text-xs text-muted mt-0.5">/ 100</span>
              </div>
            </div>
            <p className="mt-4 text-text2">
              <span className="font-semibold text-text">{score.businessName}</span>
              <span className="text-muted"> — {score.businessType}</span>
            </p>
          </div>

          {/* Category Bars */}
          <div className="space-y-4">
            {score.categories.map((cat, i) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-text2">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-hint text-xs">{cat.weightLabel}</span>
                    <span className={`font-medium w-8 text-right ${getScoreColor(cat.score)}`}>
                      {animated ? cat.score : 0}
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getBarColor(cat.score)}`}
                    style={{
                      width: animated ? `${cat.score}%` : "0%",
                      transition: `width 0.8s ease-out ${0.3 + i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-8 sm:p-10 mb-6"
        >
          <h3 className="text-lg font-semibold mb-6">AI Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, i) => {
              const config = priorityConfig[rec.priority];
              const Icon = config.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`rounded-xl border ${config.border} ${config.bg} p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${config.text}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-text">
                          {rec.title}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${config.bg} ${config.text} border ${config.border}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-text2 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-border-accent px-6 py-3 text-sm font-medium text-text2 hover:text-text hover:border-border-bold transition-colors"
          >
            <RotateCcw size={16} />
            Run Another Audit
          </button>
        </motion.div>
      </div>
    </section>
  );
}
