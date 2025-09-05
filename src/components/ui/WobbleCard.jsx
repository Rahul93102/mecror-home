"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  style = {}
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
        margin: "0 auto",
        width: "100%",
        background: "linear-gradient(135deg, #e879f9, #c084fc, #a855f7)",
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        ...style
      }}
      className={containerClassName}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          backgroundImage: "radial-gradient(88% 100% at top, rgba(255,255,255,0.5), rgba(255,255,255,0))",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 32px rgba(168, 85, 247, 0.25), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(168, 85, 247, 0.1), 0 4px 6px rgba(168, 85, 247, 0.15), 0 24px 108px rgba(168, 85, 247, 0.2)"
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
            height: "100%",
            padding: "1.5rem"
          }}
          className={className}
        >
          <Noise />
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        transform: "scale(1.2)",
        opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: "30%",
        maskImage: "radial-gradient(#fff, transparent, 75%)"
      }}
    />
  );
};
