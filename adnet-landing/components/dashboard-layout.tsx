"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  PlusCircle,
  List,
  Settings,
  LogOut,
  Menu,
  X,
  MapPin,
  BarChart3,
  Sun,
  Moon,
  User,
  ChevronDown,
} from "lucide-react"
import { useRole, type Role } from "@/hooks/use-role"
import { RoleTransition } from "./role-transition"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { role, changeRole, isTransitioning, completeTransition } = useRole()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check for dark mode preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setIsDarkMode(!isDarkMode)
  }

  const advertiserNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: List },
    { name: "Create Campaign", href: "/dashboard/campaigns/create", icon: PlusCircle },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const providerNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Locations", href: "/dashboard/locations", icon: MapPin },
    { name: "Register Location", href: "/dashboard/locations/register", icon: PlusCircle },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const navItems = role === "advertiser" ? advertiserNavItems : providerNavItems

  return (
    <div className="min-h-screen bg-[#fffce8] dark:bg-[#121218] transition-colors duration-300">
      {/* Role Transition Screen */}
      <RoleTransition isVisible={isTransitioning} role={role} onAnimationComplete={completeTransition} />

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-[#fffce8] dark:bg-[#121218] border-b-[6px] border-black p-4 flex items-center justify-between">
        <h1 className="text-2xl font-black dark:text-white">SOULBOARD</h1>
        <div className="flex items-center space-x-3">
          <RoleDropdown role={role} onRoleChange={changeRole} />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-80 border-r-[6px] border-black bg-white dark:bg-[#1e1e28] transition-colors duration-300">
          <div className="p-4 border-b-[6px] border-black flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-black dark:text-white">SOULBOARD</h1>
            </Link>
            <RoleDropdown role={role} onRoleChange={changeRole} />
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-[4px] font-bold transition-all ${
                      pathname === item.href
                        ? `border-black bg-${role === "advertiser" ? "[#0055FF]" : "[#FF6B97]"} text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                        : "border-transparent hover:border-black dark:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t-[6px] border-black">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl border-[4px] border-transparent hover:border-black font-bold dark:text-white"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 mt-2 w-full rounded-xl border-[4px] border-transparent hover:border-black font-bold dark:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-white dark:bg-[#1e1e28] pt-20"
            >
              <div className="p-4">
                <nav className="mt-6">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-[4px] font-bold transition-all ${
                            pathname === item.href
                              ? `border-black bg-${role === "advertiser" ? "[#0055FF]" : "[#FF6B97]"} text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                              : "border-transparent hover:border-black dark:text-white"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl border-[4px] border-transparent hover:border-black font-bold dark:text-white"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>

                  <Link
                    href="/"
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl border-[4px] border-transparent hover:border-black font-bold dark:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

interface RoleDropdownProps {
  role: Role
  onRoleChange: (role: Role) => void
}

function RoleDropdown({ role, onRoleChange }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const selectRole = (newRole: Role) => {
    if (role !== newRole) {
      onRoleChange(newRole)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 p-2 rounded-lg border-2 border-black bg-white dark:bg-[#252530] dark:text-white"
      >
        {role === "advertiser" ? (
          <User className="w-4 h-4 text-[#0055FF]" />
        ) : (
          <MapPin className="w-4 h-4 text-[#FF6B97]" />
        )}
        <span className="text-sm font-bold capitalize">{role}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#252530] border-[4px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
          <button
            onClick={() => selectRole("advertiser")}
            className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
              role === "advertiser" ? "bg-gray-100 dark:bg-[#1e1e28]" : ""
            }`}
          >
            <User className="w-4 h-4 text-[#0055FF]" />
            <span className="font-medium dark:text-white">Advertiser</span>
          </button>
          <button
            onClick={() => selectRole("provider")}
            className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
              role === "provider" ? "bg-gray-100 dark:bg-[#1e1e28]" : ""
            }`}
          >
            <MapPin className="w-4 h-4 text-[#FF6B97]" />
            <span className="font-medium dark:text-white">Provider</span>
          </button>
        </div>
      )}
    </div>
  )
}
