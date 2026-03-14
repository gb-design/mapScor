"use client";

import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export function ScrollRevealInit() {
  useScrollReveal();
  return null;
}
