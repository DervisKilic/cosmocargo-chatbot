"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SpaceBackgroundProps {
  starCount?: number;
  children?: React.ReactNode;
}

const SpaceBackground = ({
  starCount = 150,
  children,
}: SpaceBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing stars
    const existingStars = container.querySelectorAll(".star");
    existingStars.forEach((star) => star.remove());

    // GSAP timeline for orchestrating animations
    const masterTimeline = gsap.timeline();

    // Create new stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      // Random size (mostly small with a few larger ones)
      const size = Math.random() < 0.9 ? Math.random() * 2 : Math.random() * 4;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Random position
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      // Base opacity
      const baseOpacity = 0.2 + Math.random() * 0.8;
      star.style.opacity = baseOpacity.toString();

      // Randomly assign star colors for some stars (most remain white)
      if (Math.random() < 0.15) {
        const colors = ["#33C3F0", "#9b87f5", "#FEC6A1", "#E5DEFF", "#D3E4FD"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.backgroundColor = randomColor;
      }

      container.appendChild(star);

      // Apply random animation type
      const animationType = Math.random();

      if (animationType < 0.33) {
        // Twinkle animation
        gsap.to(star, {
          opacity: Math.min(baseOpacity + 0.3, 1),
          duration: 1 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 3,
        });
      } else if (animationType < 0.66) {
        // Float animation
        gsap.to(star, {
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
          duration: 3 + Math.random() * 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 3,
        });
      } else {
        // Pulse animation
        const timeline = gsap.timeline({
          repeat: -1,
          delay: Math.random() * 3,
        });

        timeline
          .to(star, {
            boxShadow: `0 0 ${Math.random() * 3 + 2}px ${
              Math.random() * 2 + 1
            }px rgba(255, 255, 255, 0.7)`,
            opacity: Math.min(baseOpacity + 0.4, 1),
            duration: 1 + Math.random() * 2,
            ease: "sine.inOut",
          })
          .to(star, {
            boxShadow: "0 0 0px 0px rgba(255, 255, 255, 0)",
            opacity: baseOpacity,
            duration: 1 + Math.random() * 2,
            ease: "sine.inOut",
          });
      }

      // Add drift animation to all stars
      gsap.to(star, {
        x: `+=${Math.random() * 30 - 15}`,
        y: `+=${Math.random() * 30 - 15}`,
        duration: 15 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }

    return () => {
      // Cleanup GSAP animations on unmount
      masterTimeline.kill();
      gsap.killTweensOf(container.querySelectorAll(".star"));
    };
  }, [starCount]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-space-gradient overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(155,135,245,0.15)_0%,_rgba(11,14,24,0)_70%)]"></div>
      {children}
    </div>
  );
};

export default SpaceBackground;
