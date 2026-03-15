"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuditResult } from "./audit-result";

const questions = [
  {
    id: "business_name",
    question: "What's your business name?",
    type: "text" as const,
    placeholder: "e.g. Café Central",
  },
  {
    id: "business_type",
    question: "What type of business do you run?",
    type: "select" as const,
    options: [
      "Restaurant / Café",
      "Retail / Shop",
      "Health / Medical",
      "Beauty / Wellness",
      "Professional Services",
      "Automotive",
      "Home Services",
      "Fitness / Sports",
      "Other",
    ],
  },
  {
    id: "profile_complete",
    question: "Is your profile fully filled out? (Name, address, phone, website, description, categories)",
    type: "select" as const,
    options: [
      "Yes, everything is complete",
      "Mostly — missing 1–2 fields",
      "Partially — several fields empty",
      "I'm not sure",
    ],
  },
  {
    id: "photos",
    question: "How many photos does your profile have?",
    type: "select" as const,
    options: [
      "50+ photos (with logo and cover)",
      "20–49 photos",
      "5–19 photos",
      "Less than 5 photos",
      "No photos",
    ],
  },
  {
    id: "reviews",
    question: "How many Google reviews do you have, and what's your average rating?",
    type: "select" as const,
    options: [
      "100+ reviews, 4.5+ stars",
      "50–99 reviews, 4.0+ stars",
      "20–49 reviews, 3.5+ stars",
      "Less than 20 reviews",
      "No reviews yet",
    ],
  },
  {
    id: "review_responses",
    question: "Do you respond to reviews?",
    type: "select" as const,
    options: [
      "Yes, to all reviews (positive & negative)",
      "Yes, mostly to negative ones",
      "Sometimes",
      "Rarely or never",
    ],
  },
  {
    id: "posts",
    question: "How often do you publish Google Business posts?",
    type: "select" as const,
    options: [
      "Weekly or more",
      "1–2 times per month",
      "Occasionally (every few months)",
      "Never posted",
    ],
  },
  {
    id: "description",
    question: "Does your business description include relevant keywords and services?",
    type: "select" as const,
    options: [
      "Yes, it's keyword-optimized and detailed (500+ chars)",
      "It's decent but could be better",
      "It's very short or generic",
      "I don't have a description",
    ],
  },
  {
    id: "hours",
    question: "Are your business hours complete and up to date?",
    type: "select" as const,
    options: [
      "Yes, including special hours and holidays",
      "Regular hours are set, no special hours",
      "Hours are partially set",
      "No hours set",
    ],
  },
  {
    id: "qna",
    question: "Is your Q&A section active?",
    type: "select" as const,
    options: [
      "Yes, with pre-seeded questions and answers",
      "Some questions, all answered",
      "Some questions, not all answered",
      "No Q&A activity",
    ],
  },
];

const loadingSteps = [
  "Calculating category scores...",
  "Analyzing profile completeness...",
  "Evaluating photo presence...",
  "Checking review health...",
  "Assessing posting activity...",
  "Generating AI recommendations...",
];

export function AuditForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: {
      overall: number;
      categories: { name: string; score: number; weight: number; weightLabel: string }[];
      businessName: string;
      businessType: string;
    };
    recommendations: { priority: "high" | "medium" | "low"; title: string; description: string }[];
  } | null>(null);

  const current = questions[step];
  const isFirst = step === 0;
  const isLast = step === questions.length - 1;
  const progress = ((step + 1) / questions.length) * 100;

  const canAdvance =
    current.type === "text"
      ? (answers[current.id] || "").trim().length > 0
      : !!answers[current.id];

  // Animate loading steps
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    if (!isLast) {
      setTimeout(() => setStep((s) => s + 1), 300);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingStep(0);
    setError(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error("Audit failed");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  // Show result
  if (result) {
    return (
      <AuditResult
        score={result.score}
        recommendations={result.recommendations}
        onReset={handleReset}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <section id="audit" className="py-24 sm:py-32 bg-surface/50">
        <div className="mx-auto max-w-md px-4 sm:px-6 text-center">
          <Loader2
            size={40}
            className="text-green mx-auto mb-8 animate-spin"
          />
          <h2 className="text-2xl font-bold mb-6">
            Analyzing your profile...
          </h2>
          <div className="space-y-3 text-left">
            {loadingSteps.map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                  i < loadingStep
                    ? "text-green"
                    : i === loadingStep
                    ? "text-text"
                    : "text-hint"
                }`}
              >
                {i < loadingStep ? (
                  <CheckCircle2 size={16} className="text-green shrink-0" />
                ) : i === loadingStep ? (
                  <Loader2 size={16} className="animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-hint/30 shrink-0" />
                )}
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="audit" className="py-24 sm:py-32 bg-surface/50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-green mb-3 rv">Free Audit</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Audit your profile now
          </h2>
          <p className="mt-4 text-text2 rv rv2">
            10 quick questions — takes less than 2 minutes.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>
              Question {step + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red/20 bg-red-dim px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        {/* Question */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-lg font-semibold mb-6">
                {current.question}
              </h3>

              {current.type === "text" ? (
                <input
                  type="text"
                  value={answers[current.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [current.id]: e.target.value,
                    }))
                  }
                  placeholder={current.placeholder}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-hint focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/25 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAdvance) {
                      if (isLast) {
                        handleSubmit();
                      } else {
                        setStep((s) => s + 1);
                      }
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div className="space-y-2.5">
                  {current.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                        answers[current.id] === option
                          ? "border-green/50 bg-green-dim text-text"
                          : "border-border bg-surface text-text2 hover:border-border-accent hover:text-text"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep((s) => s - 1)}
              className={`inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors ${
                isFirst ? "invisible" : ""
              }`}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!canAdvance}
                className="inline-flex items-center gap-2 rounded-xl bg-green px-6 py-2.5 text-sm font-semibold text-bg hover:bg-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Get My Score
                <ArrowRight size={16} />
              </button>
            ) : current.type === "text" ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:text-green/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
