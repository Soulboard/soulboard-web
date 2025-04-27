import Link from "next/link"
import Image from "next/image"
import { MapPin, Wallet, ArrowRight, Twitter, DiscIcon as Discord, Github, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fffce8] dark:bg-[#121218] font-sans transition-colors duration-300">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10 md:py-16 max-w-7xl">
        <div className="max-w-5xl mx-auto relative">
          {/* Background elements */}
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#FF3366] dark:bg-[#FF6B97] rounded-full opacity-20 dark:opacity-30"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#0055FF] rounded-full opacity-20 dark:opacity-30"></div>

          {/* Content with proper alignment */}
          <div className="relative z-10 flex flex-col items-start">
            <h1 className="text-5xl md:text-7xl font-black tracking-wider leading-tight mb-8 dark:text-white">
              <span className="block text-[#0055FF] dark:text-[#0055FF]">SOULBOARD:</span>
              <span className="block">DECENTRALIZED</span>
              <span className="block">ADVERTISING</span>
              <span className="block text-[#FF3366] dark:text-[#FF6B97]">PROTOCOL</span>
            </h1>

            <p className="text-xl md:text-2xl font-bold mb-10 max-w-3xl leading-relaxed dark:text-gray-200">
              Connect real-world displays with digital advertisers through blockchain technology
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <button className="bg-[#0055FF] text-white font-bold py-4 px-8 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:dark-glow-blue">
                Get Started
              </button>
              <button className="bg-white dark:bg-[#1e1e28] text-black dark:text-white font-bold py-4 px-8 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:translate-y-4">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="container mx-auto px-4 py-12 bg-[#fff9d6] dark:bg-[#1a1a22] border-y-[6px] border-black max-w-full transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-center dark:text-white">
            <span className="text-[#0055FF]">1,234</span> ACTIVE DISPLAYS WORLDWIDE
          </h2>
          <div className="relative w-full aspect-[16/9] border-[6px] border-black rounded-xl bg-white dark:bg-[#1e1e28] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden dark:dark-glow transition-colors duration-300">
            <div className="absolute inset-0">
              <WorldMap />
            </div>
            <div className="absolute bottom-6 left-6 bg-white dark:bg-[#1e1e28] p-4 border-[4px] border-black rounded-lg transform rotate-1 dark:text-white transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#FFCC00]"></div>
                <span className="font-bold">High Density</span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#0055FF]"></div>
                <span className="font-bold">Medium Density</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#FF3366]"></div>
                <span className="font-bold">Low Density</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        <h2 className="text-5xl font-black mb-12 text-center relative dark:text-white">
          <span className="relative z-10">HOW IT WORKS</span>
          <div className="absolute w-32 h-4 bg-[#FFCC00] bottom-1 left-1/2 -translate-x-1/2 -z-0"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              rotate={index % 2 === 0 ? 1 : -1}
            />
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-12 bg-[#fff9d6] dark:bg-[#1a1a22] border-y-[6px] border-black max-w-full transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 text-center relative dark:text-white">
            <span className="relative z-10">KEY FEATURES</span>
            <div className="absolute w-32 h-4 bg-[#FF3366] bottom-1 left-1/2 -translate-x-1/2 -z-0"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureBox
              title="Real-World Advertising"
              description="Connect digital campaigns to physical displays in high-traffic locations worldwide."
              color="#0055FF"
              icon="display"
            />
            <FeatureBox
              title="Performance-Based Allocation"
              description="Smart contracts automatically optimize budget allocation based on real-time performance."
              color="#FFCC00"
              icon="chart"
            />
            <FeatureBox
              title="Verified Engagement"
              description="NFC and IoT technology verifies real-world impressions with blockchain validation."
              color="#FF3366"
              icon="verify"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-4xl font-black mb-6">JOIN THE WAITLIST</h2>
              <p className="text-xl mb-6 leading-relaxed">
                Be the first to access the SoulBoard protocol when we launch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white dark:bg-[#1e1e28] text-black dark:text-white px-5 py-4 rounded-xl border-[6px] border-[#0055FF] text-lg font-bold w-full sm:w-auto"
                />
                <button className="bg-[#FFCC00] dark:bg-[#FF6B97] text-black dark:text-white font-bold py-4 px-6 border-[6px] border-white rounded-xl hover:-translate-y-1 transition-transform flex items-center justify-center dark:dark-glow">
                  <span>Subscribe</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black mb-6">CONNECT WITH US</h2>
              <div className="flex space-x-4 mb-8">
                <SocialButton icon={<Twitter className="w-6 h-6" />} />
                <SocialButton icon={<Discord className="w-6 h-6" />} />
                <SocialButton icon={<Github className="w-6 h-6" />} />
              </div>
              <div className="bg-white dark:bg-[#FF6B97] text-black dark:text-white inline-block px-6 py-3 rounded-xl border-[4px] border-[#0055FF] dark:border-black font-bold transform -rotate-2 dark:dark-glow">
                Built on Ethereum
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t-[4px] border-white/30 text-center">
            <p className="text-lg">© 2025 SoulBoard Protocol. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
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

function WorldMap() {
  return (
    <div className="relative w-full h-full bg-[#f0f0f0] dark:bg-[#252530]">
      <Image
        src="/simplified-blue-world-map.png"
        alt="World Map"
        fill
        className="object-cover dark:opacity-70 dark:contrast-125 dark:brightness-75"
      />
      {/* Map Pins */}
      {mapPins.map((pin, index) => (
        <MapPin
          key={index}
          className={`absolute w-8 h-8 text-[#FFCC00] dark:text-[#FF6B97] animate-pulse cursor-pointer hover:scale-125 transition-transform`}
          style={{
            top: `${pin.y}%`,
            left: `${pin.x}%`,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

function StepCard({ number, title, description, rotate }) {
  return (
    <div
      className={`bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform dark:text-white dark:dark-glow transition-colors duration-300`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="text-6xl font-black text-[#0055FF] dark:text-[#FF6B97] mb-3">{number}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-lg leading-relaxed dark:text-gray-300">{description}</p>
    </div>
  )
}

function FeatureBox({ title, description, color, icon }) {
  const darkModeColor = color === "#0055FF" ? "#0055FF" : color === "#FFCC00" ? "#FFCC00" : "#FF3366"
  const glowClass =
    color === "#0055FF" ? "dark:dark-glow-blue" : color === "#FFCC00" ? "dark:dark-glow-yellow" : "dark:dark-glow"

  return (
    <div
      className={`bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:-translate-y-2 transition-transform dark:text-white ${glowClass} transition-colors duration-300`}
    >
      <div
        className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center"
        style={{ backgroundColor: darkModeColor }}
      >
        {icon === "display" && <div className="w-10 h-8 border-4 border-black rounded-md"></div>}
        {icon === "chart" && (
          <div className="w-10 h-8 flex items-end space-x-1">
            <div className="w-2 h-3 bg-black"></div>
            <div className="w-2 h-5 bg-black"></div>
            <div className="w-2 h-7 bg-black"></div>
            <div className="w-2 h-4 bg-black"></div>
          </div>
        )}
        {icon === "verify" && (
          <div className="w-8 h-8 border-4 border-black rounded-full flex items-center justify-center">✓</div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-lg leading-relaxed dark:text-gray-300">{description}</p>
    </div>
  )
}

function SocialButton({ icon }) {
  return (
    <button className="bg-white dark:bg-[#1e1e28] text-black dark:text-white w-14 h-14 rounded-xl border-[4px] border-[#0055FF] dark:border-[#FF6B97] flex items-center justify-center hover:-translate-y-1 transition-transform dark:dark-glow">
      {icon}
    </button>
  )
}

// Sample data
const mapPins = [
  { x: 20, y: 30 },
  { x: 30, y: 40 },
  { x: 50, y: 35 },
  { x: 70, y: 25 },
  { x: 80, y: 45 },
  { x: 40, y: 60 },
  { x: 60, y: 70 },
  { x: 25, y: 50 },
  { x: 75, y: 60 },
  { x: 55, y: 20 },
]

const steps = [
  {
    title: "Registration Phase",
    description: "Display owners register their physical screens and IoT devices on the SoulBoard protocol.",
  },
  {
    title: "Liquidity & Tokenomics",
    description: "Advertisers provide liquidity to the SBC-USDC pool to participate in the network.",
  },
  {
    title: "Advertiser Flow",
    description: "Create campaigns and allocate tokens to specific display types and locations.",
  },
  {
    title: "Display & Verification",
    description: "IoT devices verify real-world impressions and record them on the blockchain.",
  },
  {
    title: "Budget Reallocation",
    description: "Smart contracts automatically optimize budget allocation based on performance.",
  },
  {
    title: "Payment Settlement",
    description: "Display owners earn tokens based on verified impressions and engagement.",
  },
]
