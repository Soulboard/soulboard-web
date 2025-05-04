"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, ArrowRight } from "lucide-react"
import type { Role } from "@/hooks/use-role"

interface RoleTransitionProps {
  isVisible: boolean
  role: Role
  onAnimationComplete?: () => void
}

export function RoleTransition({ isVisible, role, onAnimationComplete }: RoleTransitionProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setAnimationComplete(false)
      setProgress(0)
      return
    }

    // Progress animation
    const startTime = Date.now()
    const duration = 3000 // 3 seconds total animation

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100))
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(progressInterval)
      }
    }, 30)

    // Cleanup
    return () => clearInterval(progressInterval)
  }, [isVisible])

  const handleAnimationComplete = () => {
    setAnimationComplete(true)
    if (onAnimationComplete) {
      // Delay the completion callback to ensure transition is visible for longer
      setTimeout(() => {
        onAnimationComplete()
      }, 1000) // Additional 1 second delay after animations complete
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              role === "advertiser"
                ? "radial-gradient(circle, rgba(0,85,255,0.15) 0%, rgba(0,0,0,0.9) 100%)"
                : "radial-gradient(circle, rgba(255,107,151,0.15) 0%, rgba(0,0,0,0.9) 100%)",
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="absolute inset-0 bg-[#121218] opacity-80"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative z-10 text-center max-w-md w-full px-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center ${
                  role === "advertiser" ? "bg-[#0055FF]" : "bg-[#FF6B97]"
                }`}
              >
                {role === "advertiser" ? (
                  <User className="w-14 h-14 text-white" />
                ) : (
                  <MapPin className="w-14 h-14 text-white" />
                )}
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-black mb-4 text-white"
            >
              Switching to {role === "advertiser" ? "Advertiser" : "Provider"} Mode
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xl text-gray-300 mb-8"
            >
              {role === "advertiser"
                ? "Manage your advertising campaigns and track performance"
                : "Manage your display locations and track earnings"}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-6 mx-auto max-w-xs"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className={`absolute top-0 left-0 h-full rounded-full ${
                  role === "advertiser" ? "bg-[#0055FF]" : "bg-[#FF6B97]"
                }`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: progress > 70 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                className={`px-4 py-2 rounded-lg text-white flex items-center ${
                  role === "advertiser" ? "bg-[#0055FF]" : "bg-[#FF6B97]"
                }`}
              >
                <span className="mr-2">Ready</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* Animated particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2,
                  }}
                  className={`absolute w-2 h-2 rounded-full ${role === "advertiser" ? "bg-[#0055FF]" : "bg-[#FF6B97]"}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
