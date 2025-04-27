import { ThemeToggle } from "@/components/theme-toggle"
import { Wallet, Menu } from "lucide-react"
import Link from "next/link"


export function NavBar( ) {
  return (
    <nav className="sticky top-0 z-50 bg-[#fffce8] dark:bg-[#121218] border-b-[6px] border-black transition-colors duration-300">
<div className="container mx-auto px-4 py-3">
  <div className="flex flex-col md:flex-row items-center justify-between">
    {/* Logo centered on mobile, left on desktop */}
    <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
      <h1 className="text-3xl font-black tracking-wider dark:text-white">SOULBOARD</h1>
    </div>

    {/* Navigation items centered */}
    <div className="hidden md:flex items-center justify-center space-x-6">
      {["Home", "Dashboard", "Providers", "Swap", "Analytics"].map((item) => (
        <NavItem key={item} active={item === "Home"}>
          {item}
        </NavItem>
      ))}
    </div>

    {/* Mobile menu button - only visible on mobile */}
    <button className="md:hidden absolute right-4 top-4 p-2">
      <Menu className="w-6 h-6" />
    </button>

    {/* Actions - centered on mobile, right on desktop */}
    <div className="flex items-center justify-center md:justify-end space-x-4 w-full md:w-auto">
      <ThemeToggle />
      <button className="bg-[#FFCC00] dark:bg-[#FF6B97] text-black dark:text-white font-bold py-2 px-5 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform flex items-center space-x-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:dark-glow">
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </button>
    </div>
  </div>
</div>
</nav>
  )
}


function NavItem({ children, active = false }) {
    return (
      <Link
        href="#"
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


