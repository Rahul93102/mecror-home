import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BackgroundLines } from "./ui/BackgroundLines.jsx";

export function SplashScreen({ onComplete }) {
  useEffect(() => {
    // Auto-navigate to dashboard after 4-5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 4.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <BackgroundLines
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        flexDirection: "column",
        padding: "1rem",
        height: "100vh",
        margin: 0,
        background:
          "linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #f3e8ff 100%)",
        overflow: "hidden",
      }}
    >
      {/* Animated Logo/Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ marginBottom: "2rem" }}
      >
        <div
          style={{
            width: "96px",
            height: "96px",
            background: "linear-gradient(135deg, #3b82f6, #9333ea)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              color: "white",
              fontSize: "2.5rem",
            }}
          >
            🌐
          </motion.div>
        </div>
      </motion.div>

      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          background: "linear-gradient(180deg, #1f2937, #4b5563)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem 0",
          position: "relative",
          zIndex: 20,
          fontWeight: "800",
          letterSpacing: "-0.025em",
          margin: "0",
          lineHeight: "1.1",
        }}
      >
        Mercor Referral Network <br />
        <motion.span
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: "linear-gradient(90deg, #2563eb, #9333ea, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            backgroundSize: "200% auto",
          }}
        >
          Analytics Dashboard
        </motion.span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          maxWidth: "32rem",
          margin: "0 auto 2rem auto",
          fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
          color: "#374151",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        Advanced analytics for referral networks with BFS algorithms, influencer
        identification, network simulation, and optimization strategies.
        Comprehensive solution for Parts 1-5 of the Mercor challenge.
      </motion.p>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          "Graph Structure Analysis",
          "Network Reach (BFS)",
          "Influencer Detection",
          "Growth Simulation",
          "Bonus Optimization",
        ].map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 + index * 0.1, duration: 0.4 }}
            style={{
              padding: "0.5rem 1rem",
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
              borderRadius: "9999px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            {feature}
          </motion.div>
        ))}
      </motion.div>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              style={{
                width: "12px",
                height: "12px",
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderRadius: "50%",
              }}
            />
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: "500",
          }}
        >
          Initializing Dashboard...
        </motion.p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 3.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "4px",
          background: "linear-gradient(90deg, #3b82f6, #9333ea, #ec4899)",
          maxWidth: "100vw",
        }}
      />

      {/* Floating Particles */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              borderRadius: "50%",
              opacity: 0.6,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </BackgroundLines>
  );
}
