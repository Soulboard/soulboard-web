"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ChevronDown, BarChart3, MapPin, Briefcase, Users, DollarSign, Shield } from "lucide-react"
import { useRole } from "@/hooks/use-role"
import { AdvertiserIllustration, ProviderIllustration } from "@/components/role-illustrations"
import { useThingSpeakContext } from "@/providers/thingspeak-provider"

export function HeroBillboard() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isRoleTransitioning, setIsRoleTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<"out" | "change" | "in" | "none">("none")
  const [targetRole, setTargetRole] = useState<"advertiser" | "provider" | null>(null)
  const containerRef = useRef(null)
  const frames = 5
  const frameInterval = 800 // milliseconds
  const { role } = useRole()
  const { viewsData, tapsData, isLoading } = useThingSpeakContext()

  // Get the latest values from ThingSpeak data
  const latestViews = viewsData?.feeds && viewsData.feeds.length > 0 
    ? viewsData.feeds[viewsData.feeds.length - 1].field1 ?? "0"
    : "0"
  
  const latestTaps = tapsData?.feeds && tapsData.feeds.length > 0 
    ? tapsData.feeds[tapsData.feeds.length - 1].field2 ?? "0"
    : "0"

  // Store the current role to compare during transitions
  const prevRoleRef = useRef(role)
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clear any existing timers when component unmounts
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      if (!isRoleTransitioning) {
        setCurrentFrame((prev) => (prev + 1) % frames)
      }
    }, frameInterval)

    // Listen for role changes
    const handleRoleChange = (event: Event) => {
      // Get the new role from the event
      const customEvent = event as CustomEvent;
      const newRole = customEvent.detail?.newRole || (role === "advertiser" ? "provider" : "advertiser")

      // Store the previous role before updating
      prevRoleRef.current = role

      // Set the target role (what we're changing to)
      setTargetRole(newRole)

      // Start transition sequence
      setIsRoleTransitioning(true)
      setTransitionPhase("out")

      // Clear any existing transition timers
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current)
      }

      // Phase 1: Fade out (500ms)
      transitionTimerRef.current = setTimeout(() => {
        setTransitionPhase("change")

        // Phase 2: Change content (2000ms) - Extended duration
        transitionTimerRef.current = setTimeout(() => {
          setTransitionPhase("in")

          // Phase 3: Fade in (500ms)
          transitionTimerRef.current = setTimeout(() => {
            setTransitionPhase("none")
            setIsRoleTransitioning(false)
            setTargetRole(null)
          }, 1000)
        }, 2000) // Extended to 2 seconds
      }, 500)
    }

    window.addEventListener("roleChange", handleRoleChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("roleChange", handleRoleChange)
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current)
      }
    }
  }, [frames, frameInterval, isRoleTransitioning, role])

  // Determine which content to show based on transition phase
  const showContent = transitionPhase === "none" || transitionPhase === "in"
  const showTransition = transitionPhase === "change"
  const contentOpacity = transitionPhase === "out" ? 0 : 1

  // Determine which role to display during transition
  const displayRole = targetRole || role
  const transitionFromRole = prevRoleRef.current
  const transitionToRole = targetRole || role

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

            {/* Role transition animation */}
            <AnimatePresence>
              {showTransition && (
                <motion.div
                  className="absolute inset-0 z-30 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <RoleTransitionAnimation fromRole={transitionFromRole} toRole={transitionToRole} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 1 }}
              animate={{ opacity: contentOpacity }}
              transition={{ duration: 0.5 }}
            >
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
                      opacity: currentFrame === index && showContent ? 1 : 0,
                      y: currentFrame === index && showContent ? 0 : 20,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <HeadlineFrame index={index} role={displayRole} />
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible && showContent ? 1 : 0, y: isVisible && showContent ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl font-bold mb-12 max-w-3xl text-white"
              >
                {displayRole === "advertiser"
                  ? "Connect with real-world displays to showcase your brand through blockchain technology"
                  : "Monetize your physical displays by connecting with advertisers through blockchain technology"}
              </motion.p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isVisible && showContent ? 1 : 0, x: isVisible && showContent ? 0 : -20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative group"
                >
                  <div
                    className={`absolute inset-0 ${displayRole === "advertiser" ? "bg-blue" : "bg-pink"} rounded-xl translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform`}
                  ></div>
                  <div
                    className={`relative ${displayRole === "advertiser" ? "bg-blue" : "bg-pink"} text-white font-bold py-4 px-8 border-[6px] border-black rounded-xl flex items-center justify-center group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform`}
                  >
                    <span>Get Started</span>
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isVisible && showContent ? 1 : 0, x: isVisible && showContent ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white rounded-xl translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                  <div className="relative bg-white text-black font-bold py-4 px-8 border-[6px] border-black rounded-xl flex items-center justify-center group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                    <span>Learn More</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>

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
function HeadlineFrame({ index, role }: { index: number; role: string }) {
  const { viewsData, tapsData, isLoading } = useThingSpeakContext()
  
  // Get the latest values from ThingSpeak data
  const latestViews = viewsData?.feeds && viewsData.feeds.length > 0 
    ? viewsData.feeds[viewsData.feeds.length - 1].field1 ?? "0"
    : "0"
  
  const latestTaps = tapsData?.feeds && tapsData.feeds.length > 0 
    ? tapsData.feeds[tapsData.feeds.length - 1].field2 ?? "0"
    : "0"

  const textColor = role === "advertiser" ? "text-blue" : "text-pink"

  switch (index) {
    case 0:
      return (
        <h1 className="text-5xl md:text-7xl font-black leading-tight dark:text-white">
          <span className={textColor}>DECENTRALIZED</span>
          <br />
          ADVERTISING
          <br />
          PROTOCOL
        </h1>
      )
    case 1:
      return (
        <h1 className="text-5xl md:text-7xl font-black leading-tight dark:text-white">
          <span className={textColor}>
            {isLoading ? "LOADING..." : latestViews} VIEWS
          </span>
          <br />
          VERIFIED ON
          <br />
          BLOCKCHAIN
        </h1>
      )
    case 2:
      return (
        <h1 className="text-5xl md:text-7xl font-black leading-tight dark:text-white">
          CONNECT
          <br />
          <span className={textColor}>DIGITAL</span> TO
          <br />
          PHYSICAL
        </h1>
      )
    case 3:
      return (
        <h1 className="text-5xl md:text-7xl font-black leading-tight dark:text-white">
          <span className={textColor}>
            {isLoading ? "LOADING..." : latestTaps} TAPS
          </span>
          <br />
          RECORDED
          <br />
          THIS MONTH
        </h1>
      )
    case 4:
      return (
        <h1 className="text-5xl md:text-7xl font-black leading-tight dark:text-white">
          TRANSPARENT
          <br />
          <span className={textColor}>VERIFIABLE</span>
          <br />
          RESULTS
        </h1>
      )
    default:
      return null
  }
}

// Improved Role transition animation component with illustrations
function RoleTransitionAnimation({ fromRole, toRole }: { fromRole: string; toRole: string }) {
  const isToAdvertiser = toRole === "advertiser"
  const isFromAdvertiser = fromRole === "advertiser"

  // Colors based on transition direction
  const fromColor = isFromAdvertiser ? "#0055FF" : "#FF6B97"
  const toColor = isToAdvertiser ? "#0055FF" : "#FF6B97"

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full relative overflow-hidden">
        {/* Animated background transition */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Transition animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="max-w-4xl w-full text-center">
            {/* First phase - current role fading out */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-6`}
                style={{ backgroundColor: fromColor }}
              >
                {isFromAdvertiser ? (
                  <Briefcase className="w-12 h-12 text-white" />
                ) : (
                  <MapPin className="w-12 h-12 text-white" />
                )}
              </div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: fromColor }}>
                {isFromAdvertiser ? "Advertiser Mode" : "Provider Mode"}
              </h2>
            </motion.div>

            {/* Middle phase - transition animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.8, times: [0, 0.6, 1], delay: 0.3 }}
              className="relative z-10"
            >
              <div className="relative">
                {/* Animated circles */}
                <motion.div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: fromColor }}
                  initial={{ width: 0, height: 0, opacity: 0.8 }}
                  animate={{ width: 500, height: 500, opacity: 0 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                />

                <motion.div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: toColor }}
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{ width: 200, height: 200, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />

                {/* Transition text */}
                <motion.div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1, times: [0, 0.3, 0.7, 1], delay: 0.4 }}
                >
                  <span className="text-2xl font-bold text-white">
                    Switching to {isToAdvertiser ? "Advertiser" : "Provider"} Mode
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Final phase - new role fading in with illustration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-16">
                {/* Left side: Role info */}
                <motion.div
                  className="flex flex-col items-center md:items-start text-center md:text-left"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6`}
                    style={{ backgroundColor: toColor }}
                  >
                    {isToAdvertiser ? (
                      <Briefcase className="w-12 h-12 text-white" />
                    ) : (
                      <MapPin className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <h2 className="text-4xl font-bold mb-2" style={{ color: toColor }}>
                    {isToAdvertiser ? "Advertiser Mode" : "Provider Mode"}
                  </h2>
                  <p className="text-xl text-white mb-6 max-w-xs">
                    {isToAdvertiser
                      ? "Create campaigns and reach your audience"
                      : "Monetize your displays and grow your network"}
                  </p>

                  {/* Role-specific features */}
                  <div className="flex flex-col gap-2 items-start">
                    {isToAdvertiser ? (
                      <>
                        <FeatureItem icon={<BarChart3 className="w-4 h-4" />} text="Target high-traffic locations" />
                        <FeatureItem icon={<Users className="w-4 h-4" />} text="Reach your ideal audience" />
                        <FeatureItem
                          icon={<DollarSign className="w-4 h-4" />}
                          text="Pay only for verified impressions"
                        />
                      </>
                    ) : (
                      <>
                        <FeatureItem icon={<MapPin className="w-4 h-4" />} text="List your premium locations" />
                        <FeatureItem icon={<DollarSign className="w-4 h-4" />} text="Maximize your earnings" />
                        <FeatureItem icon={<Shield className="w-4 h-4" />} text="Verified blockchain payments" />
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Right side: Custom illustration */}
                <motion.div
                  className="w-full max-w-xs md:max-w-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 1.3 }}
                >
                  {isToAdvertiser ? (
                    <AdvertiserIllustration color={toColor} />
                  ) : (
                    <ProviderIllustration color={toColor} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for feature items
function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      className="flex items-center gap-2 text-white"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-1 bg-white bg-opacity-20 rounded-full">{icon}</div>
      <span>{text}</span>
    </motion.div>
  )
}
