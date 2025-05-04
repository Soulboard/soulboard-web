"use client"

import { useState, useEffect } from "react"
import { usePrivy } from '@privy-io/react-auth'

export type Role = "advertiser" | "provider"

export function useRole(initialRole: Role = "advertiser") {
  const { user, ready } = usePrivy()
  const [role, setRole] = useState<Role>(initialRole)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!ready) return

    // Check for saved role preference on mount
    const savedRole = localStorage.getItem("userRole") as Role | null
    if (savedRole) {
      setRole(savedRole)
    }
    setIsLoaded(true)
  }, [ready])

  const changeRole = (newRole: Role) => {
    if (!user) {
      console.error("User must be authenticated to change role")
      return
    }

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

  return { 
    role, 
    changeRole, 
    isLoaded: isLoaded && ready, 
    isTransitioning, 
    completeTransition,
    isAuthenticated: !!user 
  }
}
