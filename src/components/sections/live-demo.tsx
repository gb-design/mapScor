"use client";

import { useEffect, useRef, useState } from "react";

const categories = [
  { name: "Completeness", score: 85, weight: "25%" },
  { name: "Photos", score: 60, weight: "20%" },
  { name: "Reviews", score: 92, weight: "20%" },
  { name: "Posts & Activity", score: 35, weight: "15%" },
  { name: "Keywords", score: 70, weight: "10%" },
  { name: "Hours", score: 100, weight: "5%" },
  { name: "Q&A", score: 20, weight: "5%" },
];

const overallScore = 72;

export function LiveDemo() {
  const [animated, setAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animated) return;
    let frame = 0;
    const total = 40;
    const interval = setInterval(() => {
      frame++;
      setDisplayScore(Math.round((frame / total) * overallScore));
      if (frame >= total) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [animated]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green";
    if (score >= 50) return "bg-amber";
    return "bg-red";
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = animated
    ? circumference - (overallScore / 100) * circumference
    : circumference;

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">Live Preview</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            See what your report looks like
          </h2>
          <p className="mt-4 text-text2 max-w-xl mx-auto rv rv2">
            Here&apos;s an example audit result for a local business in Vienna.
          </p>
        </div>

        <div
          ref={ref}
          className="rv mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10"
        >
          {/* Score Circle */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
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
                  stroke="var(--green)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{displayScore}</span>
                <span className="text-xs text-muted">/ 100</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-text2">
              <span className="font-medium text-text">Café Central</span> — Vienna, AT
            </p>
          </div>

          {/* Category Bars */}
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-text2">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-hint text-xs">{cat.weight}</span>
                    <span className="font-medium text-text w-8 text-right">
                      {animated ? cat.score : 0}
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreColor(cat.score)}`}
                    style={{
                      width: animated ? `${cat.score}%` : "0%",
                      transition: `width 0.8s ease-out ${0.2 + i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
