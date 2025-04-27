"use client"

import { useState, useEffect } from "react"

export type Role = "advertiser" | "provider"

export function useRole(initialRole: Role = "advertiser") {
  const [role, setRole] = useState<Role>(initialRole)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Check for saved role preference on mount
    const savedRole = localStorage.getItem("userRole") as Role | null
    if (savedRole) {
      setRole(savedRole)
    }
    setIsLoaded(true)
  }, [])

  const changeRole = (newRole: Role) => {
    if (role !== newRole) {
      setIsTransitioning(true)

      // We'll set the role immediately for localStorage, but the UI will transition
      localStorage.setItem("userRole", newRole)

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent("roleChange", { detail: { role: newRole } }))

      // After a short delay, update the actual role state
      setTimeout(() => {
        setRole(newRole)
      }, 300) // Small delay to ensure transition starts before role changes
    }
  }

  const completeTransition = () => {
    setIsTransitioning(false)
  }

  return { role, changeRole, isLoaded, isTransitioning, completeTransition }
}
