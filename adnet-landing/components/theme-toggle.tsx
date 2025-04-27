"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a preference stored
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

  return (
    <button
      onClick={toggleTheme}
      className="bg-white dark:bg-[#FF6B97] text-black dark:text-white p-2 rounded-xl border-[4px] border-black hover:-translate-y-1 transition-transform"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
