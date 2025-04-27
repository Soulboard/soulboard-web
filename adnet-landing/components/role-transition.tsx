"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin } from "lucide-react"
import type { Role } from "@/hooks/use-role"

interface RoleTransitionProps {
  isVisible: boolean
  role: Role
  onAnimationComplete?: () => void
}

export function RoleTransition({ isVisible, role, onAnimationComplete }: RoleTransitionProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setAnimationComplete(false)
    }
  }, [isVisible])

  const handleAnimationComplete = () => {
    setAnimationComplete(true)
    if (onAnimationComplete) {
      onAnimationComplete()
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#fffce8] dark:bg-[#121218]"
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  role === "advertiser" ? "bg-[#0055FF]" : "bg-[#FF6B97]"
                }`}
              >
                {role === "advertiser" ? (
                  <User className="w-12 h-12 text-white" />
                ) : (
                  <MapPin className="w-12 h-12 text-white" />
                )}
              </div>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-black mb-4 dark:text-white"
            >
              Switching to {role === "advertiser" ? "Advertiser" : "Provider"} Mode
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg dark:text-gray-300"
            >
              {role === "advertiser"
                ? "Manage your advertising campaigns and track performance"
                : "Manage your display locations and track earnings"}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
