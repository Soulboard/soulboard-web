"use client"

import { LandingNavbar } from "@/components/landing-navbar"
import Image from "next/image"
import { MapPin, ArrowRight, Twitter, DiscIcon as Discord, Github } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { BillboardFeatures } from "@/components/billboard-features"
import { HeroBillboard } from "@/components/hero-billboard"
import { useRole } from "@/hooks/use-role"
import { RoleTransition } from "@/components/role-transition"

export default function Home() {
  const { role, isTransitioning, completeTransition } = useRole()

  return (
    <div className="min-h-screen bg-[#121218] font-sans transition-colors duration-300">
      {/* Role Transition Screen */}
      <RoleTransition isVisible={isTransitioning} role={role} onAnimationComplete={completeTransition} />

      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <HeroBillboard />

      {/* Location Map */}
      <section className="container mx-auto px-4 py-16 bg-[#fff9d6] dark:bg-[#1a1a22] border-y-[6px] border-black max-w-full transition-colors duration-300 dot-pattern">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="inline-block bg-[#0055FF] dark:bg-[#0055FF] px-4 py-1 rounded-full text-white text-sm font-bold mb-4">
              Global Network
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-center dark:text-white">
              <span className="text-[#0055FF]">1,234</span> ACTIVE DISPLAYS WORLDWIDE
            </h2>
            <p className="text-lg text-center max-w-2xl dark:text-gray-300">
              Join our growing network of display providers and advertisers across the globe
            </p>
          </div>

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
      <section className="w-full py-16 grid-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center mb-12">
            <div className="inline-block bg-[#FFCC00] dark:bg-[#FFCC00] px-4 py-1 rounded-full text-black text-sm font-bold mb-4">
              Process
            </div>
            <h2 className="text-5xl font-black mb-4 text-center relative dark:text-white">
              <span className="relative z-10">HOW IT WORKS</span>
              <div className="absolute w-32 h-4 bg-[#FFCC00] bottom-1 left-1/2 -translate-x-1/2 -z-0"></div>
            </h2>
            <p className="text-lg text-center max-w-2xl dark:text-gray-300 mb-8">
              Our decentralized protocol connects advertisers with display providers through a transparent blockchain
              system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedStepCards />
          </div>
        </div>
      </section>

      {/* Key Features - Billboard Style */}
      <section className="w-full py-12 md:py-16 bg-[#fff9d6] dark:bg-[#1a1a22] border-y-[6px] border-black transition-colors duration-300 diagonal-lines">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <div className="inline-block bg-[#FF3366] dark:bg-[#FF6B97] px-4 py-1 rounded-full text-white text-sm font-bold mb-4">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-center relative dark:text-white">
              <span className="relative z-10">KEY FEATURES</span>
              <div className="absolute w-24 md:w-32 h-3 md:h-4 bg-[#FF3366] bottom-1 left-1/2 -translate-x-1/2 -z-0"></div>
            </h2>
            <p className="text-base md:text-lg text-center max-w-2xl dark:text-gray-300 mb-6 md:mb-8">
              Our platform offers unique capabilities that set us apart from traditional advertising networks
            </p>
          </div>

          <BillboardFeatures />
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 grid-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="1,234" label="Active Displays" color="#0055FF" />
            <StatCard number="$2.5M" label="Ad Revenue Generated" color="#FFCC00" />
            <StatCard number="56+" label="Countries Covered" color="#FF3366" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
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

function AnimatedStepCards() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <>
      {steps.map((step, index) => (
        <div
          key={index}
          ref={index === 0 ? ref : null}
          className={`step-card bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:text-white dark:dark-glow transition-colors duration-300 ${
            isVisible
              ? index % 3 === 0
                ? "animate-fade-in-up"
                : index % 3 === 1
                  ? "animate-rotate-in"
                  : "animate-scale-in"
              : "opacity-0"
          }`}
          style={{
            transform: `rotate(${index % 2 === 0 ? 1 : -1}deg)`,
            animationDelay: `${0.2 * index}s`,
          }}
        >
          <div className="text-6xl font-black text-[#0055FF] dark:text-[#FF6B97] mb-3 overflow-hidden">
            <div
              className={isVisible ? "animate-number-count" : "opacity-0"}
              style={{ animationDelay: `${0.3 * index}s` }}
            >
              {index + 1}
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
          <p className="text-lg leading-relaxed dark:text-gray-300">{step.description}</p>

          {/* Progress indicator */}
          <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0055FF] dark:bg-[#FF6B97] transition-all duration-1000 ease-out"
              style={{
                width: isVisible ? "100%" : "0%",
                transitionDelay: `${0.5 * index}s`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </>
  )
}

function StatCard({ number, label, color }) {
  return (
    <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform dark:text-white dark:dark-glow">
      <div className="text-5xl font-black mb-2" style={{ color }}>
        {number}
      </div>
      <div className="text-xl font-bold">{label}</div>
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
