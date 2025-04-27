"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { User, MapPin } from "lucide-react"
import { useRole, type Role } from "@/hooks/use-role"

interface RoleSwitcherProps {
  initialRole?: Role
  onRoleChange?: (role: Role) => void
  className?: string
}

export function RoleSwitcher({ initialRole = "advertiser", onRoleChange, className = "" }: RoleSwitcherProps) {
  const { role, changeRole, isLoaded } = useRole(initialRole)

  useEffect(() => {
    if (isLoaded && onRoleChange) {
      onRoleChange(role)
    }
  }, [role, onRoleChange, isLoaded])

  return (
    <div
      className={`flex items-center justify-center p-2 bg-white dark:bg-[#1e1e28] rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      <button
        onClick={() => changeRole("advertiser")}
        className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-bold ${
          role === "advertiser"
            ? "bg-[#0055FF] text-white"
            : "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#252530]"
        }`}
      >
        <User className="w-5 h-5" />
        <span>Advertiser</span>
        {role === "advertiser" && (
          <motion.div
            layoutId="rolePill"
            className="absolute inset-0 bg-[#0055FF] dark:bg-[#0055FF] rounded-lg -z-10"
            initial={false}
            transition={{ type: "spring", duration: 0.6 }}
          />
        )}
      </button>

      <button
        onClick={() => changeRole("provider")}
        className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-bold ${
          role === "provider"
            ? "bg-[#FF6B97] text-white"
            : "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#252530]"
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span>Provider</span>
        {role === "provider" && (
          <motion.div
            layoutId="rolePill"
            className="absolute inset-0 bg-[#FF6B97] dark:bg-[#FF6B97] rounded-lg -z-10"
            initial={false}
            transition={{ type: "spring", duration: 0.6 }}
          />
        )}
      </button>
    </div>
  )
}
