"use client";

import { useEffect } from "react";

/**
 * Adds `.visible` to any `.fade-up` element as it enters the viewport.
 * Mounted once at the root; subsequent navigations re-run via effect.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document
        .querySelectorAll<HTMLElement>(".fade-up")
        .forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    const targets = document.querySelectorAll<HTMLElement>(".fade-up");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
