"use client"

import { motion } from "framer-motion"

// Advertiser Illustration - Shows a campaign creation and billboard concept
export function AdvertiserIllustration({ color = "#0055FF" }) {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background elements */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="black"
          stroke={color}
          strokeWidth="8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.path
          d="M50 200C50 117.157 117.157 50 200 50C282.843 50 350 117.157 350 200C350 282.843 282.843 350 200 350C117.157 350 50 282.843 50 200Z"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="8 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* City skyline */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <path d="M80 280H320V290H80V280Z" fill="#333" />
          <path d="M100 280V250H110V280H100Z" fill="#333" />
          <path d="M120 280V260H130V280H120Z" fill="#333" />
          <path d="M140 280V240H160V280H140Z" fill="#333" />
          <path d="M170 280V255H180V280H170Z" fill="#333" />
          <path d="M190 280V230H210V280H190Z" fill="#333" />
          <path d="M220 280V260H230V280H220Z" fill="#333" />
          <path d="M240 280V245H260V280H240Z" fill="#333" />
          <path d="M270 280V250H280V280H270Z" fill="#333" />
          <path d="M290 280V235H300V280H290Z" fill="#333" />
        </motion.g>

        {/* Billboard */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Billboard stand */}
          <rect x="180" y="200" width="40" height="80" fill="#222" />

          {/* Billboard frame */}
          <rect x="120" y="120" width="160" height="80" fill={color} stroke="black" strokeWidth="8" />

          {/* Billboard content */}
          <rect x="130" y="130" width="140" height="60" fill="white" />
          <path d="M140 150H260" stroke="black" strokeWidth="4" />
          <path d="M140 160H220" stroke="black" strokeWidth="4" />
          <path d="M140 170H240" stroke="black" strokeWidth="4" />
        </motion.g>

        {/* Person/advertiser */}
        <motion.g
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {/* Body */}
          <circle cx="100" cy="220" r="20" fill="white" />
          <rect x="90" y="240" width="20" height="40" fill="white" />

          {/* Arms */}
          <path d="M90 245L70 260" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M110 245L130 255" stroke="white" strokeWidth="8" strokeLinecap="round" />

          {/* Legs */}
          <path d="M90 280L80 310" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M110 280L120 310" stroke="white" strokeWidth="8" strokeLinecap="round" />

          {/* Device/tablet */}
          <rect x="60" y="260" width="30" height="20" rx="2" fill={color} stroke="black" strokeWidth="2" />
        </motion.g>

        {/* Connection lines */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}>
          <path
            d="M90 260C120 230 150 200 200 160"
            stroke={color}
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          <circle cx="90" cy="260" r="5" fill={color} />
          <circle cx="200" cy="160" r="5" fill={color} />
        </motion.g>

        {/* Animated elements */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
        >
          <circle cx="200" cy="160" r="15" fill={color} fillOpacity="0.3" />
          <circle cx="200" cy="160" r="25" fill={color} fillOpacity="0.2" />
        </motion.g>
      </svg>
    </div>
  )
}

// Provider Illustration - Shows a location with multiple displays
export function ProviderIllustration({ color = "#FF6B97" }) {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background elements */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="black"
          stroke={color}
          strokeWidth="8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.path
          d="M50 200C50 117.157 117.157 50 200 50C282.843 50 350 117.157 350 200C350 282.843 282.843 350 200 350C117.157 350 50 282.843 50 200Z"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="8 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Building */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <rect x="120" y="160" width="160" height="150" fill="#333" />

          {/* Windows */}
          <rect x="140" y="180" width="30" height="30" fill="white" opacity="0.8" />
          <rect x="185" y="180" width="30" height="30" fill="white" opacity="0.8" />
          <rect x="230" y="180" width="30" height="30" fill="white" opacity="0.8" />

          <rect x="140" y="225" width="30" height="30" fill="white" opacity="0.8" />
          <rect x="185" y="225" width="30" height="30" fill="white" opacity="0.8" />
          <rect x="230" y="225" width="30" height="30" fill="white" opacity="0.8" />

          <rect x="140" y="270" width="30" height="30" fill="white" opacity="0.8" />
          <rect x="185" y="270" width="30" height="30" fill="white" opacity="0.8" />
          <rect x="230" y="270" width="30" height="30" fill="white" opacity="0.8" />

          {/* Door */}
          <rect x="185" y="290" width="30" height="20" fill="#222" />
        </motion.g>

        {/* Digital displays */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
          {/* Main billboard on building */}
          <rect x="140" y="120" width="120" height="40" fill={color} stroke="black" strokeWidth="4" />
          <rect x="145" y="125" width="110" height="30" fill="white" />
          <path d="M155 140H245" stroke="black" strokeWidth="2" />
          <path d="M155 145H225" stroke="black" strokeWidth="2" />

          {/* Street level display */}
          <rect x="280" y="260" width="40" height="60" fill={color} stroke="black" strokeWidth="4" />
          <rect x="285" y="265" width="30" height="50" fill="white" />
          <path d="M290 280H310" stroke="black" strokeWidth="2" />
          <path d="M290 290H305" stroke="black" strokeWidth="2" />
          <path d="M290 300H300" stroke="black" strokeWidth="2" />

          {/* Display stand */}
          <rect x="295" y="320" width="10" height="20" fill="#222" />
        </motion.g>

        {/* Provider person */}
        <motion.g
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {/* Body */}
          <circle cx="300" cy="200" r="20" fill="white" />
          <rect x="290" y="220" width="20" height="40" fill="white" />

          {/* Arms */}
          <path d="M290 225L270 235" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M310 225L330 235" stroke="white" strokeWidth="8" strokeLinecap="round" />

          {/* Legs */}
          <path d="M290 260L280 290" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M310 260L320 290" stroke="white" strokeWidth="8" strokeLinecap="round" />

          {/* Device/tablet */}
          <rect x="270" y="235" width="30" height="20" rx="2" fill={color} stroke="black" strokeWidth="2" />
        </motion.g>

        {/* Connection lines */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}>
          <path
            d="M285 245C250 220 220 200 200 140"
            stroke={color}
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          <path
            d="M285 245C270 260 280 280 300 290"
            stroke={color}
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          <circle cx="285" cy="245" r="5" fill={color} />
          <circle cx="200" cy="140" r="5" fill={color} />
          <circle cx="300" cy="290" r="5" fill={color} />
        </motion.g>

        {/* Animated elements */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
        >
          <circle cx="200" cy="140" r="15" fill={color} fillOpacity="0.3" />
          <circle cx="200" cy="140" r="25" fill={color} fillOpacity="0.2" />
          <circle cx="300" cy="290" r="15" fill={color} fillOpacity="0.3" />
          <circle cx="300" cy="290" r="25" fill={color} fillOpacity="0.2" />
        </motion.g>

        {/* Location pin */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <path
            d="M200 80C213.255 80 224 90.7452 224 104C224 117.255 213.255 128 200 128C186.745 128 176 117.255 176 104C176 90.7452 186.745 80 200 80Z"
            fill={color}
            stroke="white"
            strokeWidth="4"
          />
          <path d="M200 128L210 148H190L200 128Z" fill={color} stroke="white" strokeWidth="4" />
        </motion.g>
      </svg>
    </div>
  )
}
