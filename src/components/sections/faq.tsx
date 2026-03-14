"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is mapScor really free?",
    a: "Yes! The audit, score, and 3 AI recommendations are completely free. No account, no credit card, no catch. We use free AI models (Groq/Gemini) for free users.",
  },
  {
    q: "How accurate is the score?",
    a: "The score is based on 7 key categories that Google uses to evaluate business profiles. While it's a self-assessment (you answer 10 questions), the AI analysis provides genuinely useful, prioritized recommendations.",
  },
  {
    q: "What AI models can I use?",
    a: "Free users get Llama 3.3 70B (via Groq) and Gemini Flash. If you bring your own API key (BYOK), you can also use GPT-4o, Claude Sonnet, Claude Haiku, and Gemini Pro.",
  },
  {
    q: "What is BYOK (Bring Your Own Key)?",
    a: "BYOK lets you use your own API key from OpenAI, Anthropic, or Google. This way you get access to premium AI models while mapScor never stores or charges for your API usage.",
  },
  {
    q: "Do you store my data?",
    a: "No. Your audit answers are processed in real-time and not stored on our servers. If you use BYOK, your API key is only used for the current session and never saved.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you a one-time audit with score and 3 recommendations. Pro (coming soon at €19/mo) adds unlimited audits, full recommendations, rank tracking, review management, post scheduling, and competitor analysis.",
  },
  {
    q: "Can I audit any Google Business Profile?",
    a: "Yes! You can audit any business profile — your own or a competitor's. The self-assessment works for any type of local business.",
  },
  {
    q: "How long does the audit take?",
    a: "About 2 minutes. You answer 10 quick questions about your profile, and the AI generates your score and recommendations in under 30 seconds.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  const half = Math.ceil(faqs.length / 2);
  const col1 = faqs.slice(0, half);
  const col2 = faqs.slice(half);

  const renderItem = (item: (typeof faqs)[0], index: number) => (
    <div
      key={index}
      className="rv border-b border-border last:border-0"
    >
      <button
        onClick={() => toggle(index)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-text hover:text-green transition-colors"
      >
        <span>{item.q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 ml-3 text-muted transition-transform ${
            open === index ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open === index ? "max-h-48 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-text2 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );

  return (
    <section id="faq" className="py-24 sm:py-32 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Frequently asked questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div>{col1.map((item, i) => renderItem(item, i))}</div>
          <div>{col2.map((item, i) => renderItem(item, i + half))}</div>
        </div>
      </div>
    </section>
  );
}
