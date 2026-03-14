"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

const businesses = [
  "Café Central",
  "Wiener Friseur",
  "Bäckerei Müller",
  "Autohaus Schmidt",
  "Dr. Weber Praxis",
  "Pizza Roma",
  "Blumen König",
  "Yoga Studio Zen",
  "Zahnarzt Dr. Steiner",
  "Boutique Lena",
  "Installateur Gruber",
  "Kosmetik Studio Belle",
];

export function SocialProof() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollDir = useRef(1); // 1 = right, -1 = left
  const lastScrollY = useRef(0);
  const offset = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      scrollDir.current = y > lastScrollY.current ? 1 : -1;
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const speed = 0.5;

    const animate = () => {
      offset.current += speed * scrollDir.current;
      if (trackRef.current) {
        const halfWidth = trackRef.current.scrollWidth / 2;
        if (offset.current > 0) offset.current -= halfWidth;
        if (offset.current < -halfWidth) offset.current += halfWidth;
        trackRef.current.style.transform = `translateX(${offset.current}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Duplicate list for seamless loop
  const items = [...businesses, ...businesses];

  return (
    <section className="relative py-6 border-y border-border overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center gap-8 w-max will-change-transform"
      >
        {items.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap text-sm text-hint"
          >
            <Star size={12} className="text-amber fill-amber shrink-0" />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
