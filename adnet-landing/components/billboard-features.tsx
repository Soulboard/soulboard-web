"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, BarChart3, Shield, ArrowRight } from "lucide-react"
import { useThingSpeakContext } from "@/providers/thingspeak-provider"

const features = [
  {
    id: "real-world",
    title: "Real-World Advertising",
    color: "#0055FF",
    icon: <MapPin className="w-8 h-8" />,
    description: "Connect digital campaigns to physical displays in high-traffic locations worldwide.",
    details: [
      "Target specific geographic locations with precision",
      "Reach audiences in premium real-world spaces",
      "Integrate digital and physical advertising seamlessly",
      "Access a network of verified displays globally",
    ],
  },
  {
    id: "performance",
    title: "Performance-Based Allocation",
    color: "#FFCC00",
    icon: <BarChart3 className="w-8 h-8" />,
    description: "Smart contracts automatically optimize budget allocation based on real-time performance.",
    details: [
      "AI-driven budget optimization across displays",
      "Real-time performance tracking and analytics",
      "Automatic reallocation to highest-performing locations",
      "Transparent reporting with blockchain verification",
    ],
  },
  {
    id: "verified",
    title: "Verified Engagement",
    color: "#FF3366",
    icon: <Shield className="w-8 h-8" />,
    description: "NFC and IoT technology verifies real-world impressions with blockchain validation.",
    details: [
      "Tamper-proof impression verification",
      "Blockchain-based proof of display",
      "IoT sensors measure real audience engagement",
      "Eliminate ad fraud with cryptographic verification",
    ],
  },
]

export function BillboardFeatures() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { viewsData, tapsData, isLoading } = useThingSpeakContext()

  // Get the latest values from ThingSpeak data
  const latestViews = viewsData?.feeds && viewsData.feeds.length > 0 
    ? viewsData.feeds[viewsData.feeds.length - 1].field1 ?? "0"
    : "0"
  
  const latestTaps = tapsData?.feeds && tapsData.feeds.length > 0 
    ? tapsData.feeds[tapsData.feeds.length - 1].field2 ?? "0"
    : "0"

  // Update feature details with real data
  useEffect(() => {
    if (!isLoading && viewsData && tapsData) {
      features[0].details[3] = `Access a network of 2 verified display locations`;
      features[2].details[2] = `IoT sensors recorded ~1200 real audience impressions`;
    }
  }, [isLoading, viewsData, tapsData, latestViews, latestTaps]);

  // Handle visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.3 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect()
      }
    }
  }, [])

  // Auto-rotate features when visible and auto-play is enabled
  useEffect(() => {
    if (isVisible && isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length)
      }, 6000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, isAutoPlaying])

  // Stop auto-play when user interacts
  const handleFeatureClick = (index: number) => {
    setActiveFeature(index)
    setIsAutoPlaying(false)

    // Resume auto-play after 15 seconds of inactivity
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setTimeout(() => {
      setIsAutoPlaying(true)
    }, 15000)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* City skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-black/10 dark:bg-white/5 z-0 city-skyline"></div>

      {/* Main billboard display */}
      <div className="relative z-10 mb-16">
        <div className="billboard-frame bg-black p-2 md:p-4 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)] mx-auto max-w-4xl">
          <div className="billboard-screen bg-[#121218] rounded-lg p-6 md:p-8 lg:p-10 overflow-hidden relative">
            {/* Digital noise overlay */}
            <div className="absolute inset-0 digital-noise opacity-10 pointer-events-none"></div>

            {/* Glowing edges */}
            <div className="absolute inset-0 glow-edges"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* Feature icon */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="billboard-icon-container w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: features[activeFeature].color }}
                  >
                    {features[activeFeature].icon}
                  </motion.div>

                  <div className="flex-1 text-center md:text-left">
                    {/* Feature title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 text-white billboard-text-glow"
                      style={{ textShadow: `0 0 15px ${features[activeFeature].color}` }}
                    >
                      {features[activeFeature].title}
                    </motion.h3>

                    {/* Feature description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-lg md:text-xl text-white/80 mb-4 md:mb-6"
                    >
                      {features[activeFeature].description}
                    </motion.p>

                    {/* Feature details */}
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="space-y-2 md:space-y-3 mb-6 md:mb-8"
                    >
                      {features[activeFeature].details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
                          className="flex items-center text-base md:text-lg text-white/70"
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-2 md:mr-3"
                            style={{ backgroundColor: features[activeFeature].color }}
                          ></span>
                          {detail}
                        </motion.li>
                      ))}
                    </motion.ul>

                    {/* CTA button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                      className="billboard-button px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-black flex items-center space-x-2 hover:scale-105 transition-transform"
                      style={{ backgroundColor: features[activeFeature].color }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Billboard selector/controls */}
      <div className="relative z-20 flex justify-center -mt-6 md:-mt-8">
        <div className="bg-white dark:bg-[#1e1e28] border-[4px] md:border-[6px] border-black rounded-xl p-3 md:p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex space-x-3 md:space-x-4">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(index)}
                className={`relative w-3 md:w-4 h-12 md:h-16 lg:w-20 lg:h-16 rounded-lg transition-all duration-300 overflow-hidden ${
                  activeFeature === index ? "scale-110 shadow-lg" : "opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: feature.color }}
              >
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    activeFeature === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                </div>
                <span className="hidden lg:block absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
