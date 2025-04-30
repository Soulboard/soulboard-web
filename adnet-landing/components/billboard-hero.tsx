"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ChevronDown, Wallet } from "lucide-react"

export function BillboardHero() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const containerRef = useRef(null)

  const heroTexts = [
    {
      title: "SOULBOARD:",
      subtitle: "DECENTRALIZED ADVERTISING PROTOCOL",
      color: "#0055FF",
      accentColor: "#FF3366",
    },
    {
      title: "CONNECT",
      subtitle: "REAL-WORLD DISPLAYS WITH BLOCKCHAIN",
      color: "#FFCC00",
      accentColor: "#0055FF",
    },
    {
      title: "VERIFIED",
      subtitle: "IMPRESSIONS & TRANSPARENT PAYMENTS",
      color: "#FF3366",
      accentColor: "#FFCC00",
    },
  ]

  useEffect(() => {
    setIsVisible(true)

    // Text rotation interval
    const textInterval = setInterval(() => {
      setIsGlitching(true)

      // Short delay before changing text to allow glitch effect
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)

        // Short delay before stopping glitch effect
        setTimeout(() => {
          setIsGlitching(false)
        }, 500)
      }, 300)
    }, 6000)

    return () => clearInterval(textInterval)
  }, [])

  const currentText = heroTexts[currentTextIndex]

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Digital billboard frame */}
      <div className="billboard-hero-frame relative mx-auto max-w-7xl">
        {/* Digital noise overlay */}
        <div className="absolute inset-0 digital-noise opacity-10 pointer-events-none z-10"></div>

        {/* Scan lines */}
        <div className="absolute inset-0 scan-lines pointer-events-none z-10"></div>

        {/* Glowing edges */}
        <div className="absolute inset-0 glow-edges pointer-events-none z-10"></div>

        {/* Background elements */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#FF3366] dark:bg-[#FF6B97] rounded-full opacity-20 dark:opacity-30 animate-float"></div>
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#0055FF] rounded-full opacity-20 dark:opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#FFCC00] rounded-full opacity-10 dark:opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 billboard-grid pointer-events-none z-0"></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-16 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="relative z-10 flex flex-col items-start">
              {/* Beta tag */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block bg-white dark:bg-[#1e1e28] px-4 py-2 rounded-full border-[4px] border-black mb-6 billboard-element"
              >
                <span className="text-sm font-bold flex items-center">
                  <span className="inline-block w-3 h-3 bg-[#FF3366] rounded-full mr-2 animate-pulse"></span>
                  Now in Public Beta
                </span>
              </motion.div>

              {/* Main headline with glitch effect */}
              <div className={`mb-8 ${isGlitching ? "text-glitch" : ""}`}>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-7xl font-black tracking-wider leading-tight dark:text-white"
                  >
                    <span className="block" style={{ color: currentText.color }}>
                      {currentText.title}
                    </span>
                    <span className="block">{currentText.subtitle}</span>
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl font-bold mb-10 max-w-3xl leading-relaxed dark:text-gray-200"
              >
                Connect real-world displays with digital advertisers through blockchain technology
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
              >
                <button className="billboard-cta-primary bg-[#0055FF] text-white font-bold py-4 px-8 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:dark-glow-blue flex items-center">
                  <span>Get Started</span>
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </button>
                <button className="billboard-cta-secondary bg-white dark:bg-[#1e1e28] text-black dark:text-white font-bold py-4 px-8 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:translate-y-4">
                  <span>Learn More</span>
                </button>
              </motion.div>

              {/* Connect wallet button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="billboard-wallet-button mt-8 bg-[#FFCC00] dark:bg-[#FF6B97] text-black dark:text-white font-bold py-3 px-6 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform flex items-center space-x-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:dark-glow"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </motion.button>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-sm font-medium mb-2 dark:text-white">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 dark:text-white" />
          </motion.div>
        </div>

        {/* Animated corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-[8px] border-l-[8px] border-black"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-[8px] border-r-[8px] border-black"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[8px] border-l-[8px] border-black"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[8px] border-r-[8px] border-black"></div>
      </div>

      {/* City skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-black/10 dark:bg-white/5 z-0 city-skyline"></div>
    </div>
  )
}
