"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    business: "Blumen König, Vienna",
    text: "I had no idea my Google profile was missing so many things. mapScor showed me exactly what to fix — and my calls went up 30% in the first month.",
    rating: 5,
    featured: true,
  },
  {
    name: "Thomas K.",
    business: "AutoFit Werkstatt, Graz",
    text: "Finally a tool that doesn't just tell me to 'add more photos' but actually prioritizes what matters most. The AI recommendations were spot on.",
    rating: 5,
    featured: false,
  },
  {
    name: "Maria L.",
    business: "Yoga Flow Studio, Salzburg",
    text: "Free, fast, and actually useful. I completed the audit in under 2 minutes and immediately knew what to improve. Highly recommend!",
    rating: 5,
    featured: false,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green mb-3 rv">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold rv rv1">
            Loved by local businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`rv rv${i + 1} rounded-2xl border p-6 ${
                t.featured
                  ? "border-green/20 bg-green-dim"
                  : "border-border bg-card"
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-amber fill-amber"
                  />
                ))}
              </div>

              <p className="text-sm text-text2 leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
