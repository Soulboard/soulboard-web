"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Wallet } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { RoleSwitcher } from "@/components/role-switcher"
import { useRole } from "@/hooks/use-role"
import { ConnectWallet } from "./connect-wallet"


export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { role } = useRole()
  


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    {
      name: role === "advertiser" ? "Campaigns" : "Locations",
      href: role === "advertiser" ? "/dashboard/campaigns" : "/dashboard/locations",
    },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#fffce8] dark:bg-[#121218] border-b-[6px] border-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo centered on mobile, left on desktop */}
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
            <Link href="/">
              <h1 className="text-3xl font-black tracking-wider dark:text-white">SOULBOARD</h1>
            </Link>
          </div>

          {/* Navigation items centered */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            {navItems.map((item) => (
              <NavItem key={item.name} href={item.href} active={pathname === item.href}>
                {item.name}
              </NavItem>
            ))}
          </div>

          {/* Mobile menu button - only visible on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden absolute right-4 top-4 p-2 text-black dark:text-white"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Actions - centered on mobile, right on desktop */}
          <div className="flex items-center justify-center md:justify-end space-x-4 w-full md:w-auto">
            <div className="hidden md:block">
              <RoleSwitcher className="h-10" />
            </div>
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-2 border-gray-200 dark:border-gray-800">
            <div className="flex justify-center my-4">
              <RoleSwitcher />
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`block py-2 px-4 text-center font-bold rounded-lg ${
                      pathname === item.href
                        ? "bg-[#0055FF] text-white"
                        : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#252530]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

interface NavItemProps {
  children: React.ReactNode
  href: string
  active?: boolean
}

function NavItem({ children, href, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-lg font-bold rounded-lg hover:-translate-y-1 transition-transform ${
        active ? "text-[#0055FF] dark:text-[#FF6B97]" : "text-black dark:text-white"
      }`}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0055FF] dark:bg-[#FF6B97] transform rotate-1"></div>
      )}
    </Link>
  )
}
