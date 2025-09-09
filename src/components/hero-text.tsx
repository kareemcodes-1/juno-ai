import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HeroText() {
  const words = ["Customer Service", "FAQ Support", "Sales Bot"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (wordRef.current) {
        gsap.fromTo(
          wordRef.current,
          { rotationX: 0, opacity: 1 },
          {
            rotationX: 90,
            opacity: 0,
            duration: 0.4,
            ease: "power1.in",
            onComplete: () => {
              setCurrentIndex((prev) => (prev + 1) % words.length);
              gsap.fromTo(
                wordRef.current,
                { rotationX: -90, opacity: 0 },
                { rotationX: 0, opacity: 1, duration: 0.4, ease: "power1.out" }
              );
            },
          }
        );
      }
    }, 2500); // change every 2.5s

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span ref={wordRef} className="inline-block text-blue-600">
      {words[currentIndex]}
    </span>
  );
}
