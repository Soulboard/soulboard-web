"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ChevronDown } from "lucide-react"

export function HeroBillboard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const containerRef = useRef(null)
  const frames = 5
  const frameInterval = 800 // milliseconds

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames)
    }, frameInterval)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full overflow-hidden min-h-screen flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 hero-grid"></div>

      {/* Animated circles */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blue opacity-20 blur-xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-pink opacity-20 blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-yellow opacity-20 blur-xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Main billboard container */}
      <div ref={containerRef} className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="billboard-container border-[12px] border-black rounded-xl overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          {/* Billboard screen */}
          <div className="billboard-screen bg-black p-12 md:p-16 relative overflow-hidden">
            {/* Scan lines */}
            <div className="absolute inset-0 scan-lines pointer-events-none"></div>

            {/* Glitch effect */}
            <div className="absolute inset-0 glitch-overlay"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Beta tag */}
              <div className="inline-block mb-8">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border-[4px] border-black transform rotate-[-2deg]">
                  <div className="w-3 h-3 bg-pink rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold">Now in Public Beta</span>
                </div>
              </div>

              {/* Main headline with animation frames */}
              <div className="mb-8 relative h-[280px] md:h-[320px]">
                {[...Array(frames)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: currentFrame === index ? 1 : 0,
                      y: currentFrame === index ? 0 : 20,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <HeadlineFrame index={index} />
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl font-bold mb-12 max-w-3xl text-white"
              >
                Connect real-world displays with digital advertisers through blockchain technology
              </motion.p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-blue rounded-xl translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                  <div className="relative bg-blue text-white font-bold py-4 px-8 border-[6px] border-black rounded-xl flex items-center justify-center group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                    <span>Get Started</span>
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white rounded-xl translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                  <div className="relative bg-white text-black font-bold py-4 px-8 border-[6px] border-black rounded-xl flex items-center justify-center group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                    <span>Learn More</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-20 h-20 border-t-[8px] border-r-[8px] border-white opacity-20"></div>
            <div className="absolute bottom-6 left-6 w-20 h-20 border-b-[8px] border-l-[8px] border-white opacity-20"></div>
          </div>
        </div>

        {/* Billboard stand */}
        <div className="mx-auto w-40 h-40 bg-black"></div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
        >
          <span className="text-sm font-medium mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </div>
  )
}

// Different headline frames for animation
function HeadlineFrame({ index }) {
  switch (index) {
    case 0:
      return (
        <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight">
          <span className="block text-blue">SOULBOARD:</span>
          <span className="block text-white">DECENTRALIZED</span>
          <span className="block text-white">ADVERTISING</span>
          <span className="block text-pink">PROTOCOL</span>
        </h1>
      )
    case 1:
      return (
        <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight">
          <span className="block text-yellow">CONNECT</span>
          <span className="block text-white">PHYSICAL</span>
          <span className="block text-white">DISPLAYS TO</span>
          <span className="block text-blue">BLOCKCHAIN</span>
        </h1>
      )
    case 2:
      return (
        <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight">
          <span className="block text-pink">VERIFIED</span>
          <span className="block text-white">IMPRESSIONS</span>
          <span className="block text-white">TRANSPARENT</span>
          <span className="block text-yellow">PAYMENTS</span>
        </h1>
      )
    case 3:
      return (
        <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight">
          <span className="block text-blue">GLOBAL</span>
          <span className="block text-white">ADVERTISING</span>
          <span className="block text-white">NETWORK</span>
          <span className="block text-pink">FOR ALL</span>
        </h1>
      )
    case 4:
      return (
        <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight">
          <span className="block text-yellow">JOIN THE</span>
          <span className="block text-white">ADVERTISING</span>
          <span className="block text-white">REVOLUTION</span>
          <span className="block text-blue">TODAY</span>
        </h1>
      )
    default:
      return null
  }
}
